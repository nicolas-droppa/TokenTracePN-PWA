import { ATTRIBUTE_ALIASES } from '../../constants/dpn.js';
import { arcId } from '../models.js';
import { parse } from './dpnParser.js';
import { canonicalKey } from './dpnSchema.js';

/**
 * Canvas -> code: turns a net command into a small edit of the DPN source. 
 * 
 * @param {string} code - Current DPN source.
 * @param {import('../netCommands.js').NetCommand} command
 * @returns {string|null} The new source, or null when the code has errors.
 */
export function applyCommandToCode(code, command) {
    const { model, errors } = parse(code);
    if (!model || errors.some((err) => err.severity === 'error')) return null;

    const changes = changesFor(code, model.statements, command);
    return applyChanges(code, changes);
}

// private

/**
 * Short form used when attribute is written for the first time (tokens -> m).
 */
const SHORT_KEY = Object.fromEntries(Object.entries(ATTRIBUTE_ALIASES).map(([alias, full]) => [full, alias]));

/**
 * @returns {Array<{from: number, to: number, insert: string}>}
 */
function changesFor(code, statements, command) {
    switch (command.type) {
        case 'addPlace':
        case 'addTransition': {
            const keyword = command.type === 'addPlace' ? 'place' : 'transition';
            const line = `${keyword} ${command.id} (x: ${Math.round(command.x)}, y: ${Math.round(command.y)});`;
            return [appendLine(code, statements, line, (s) => s.type !== 'arc')];
        }
        case 'addArc': {
            const type = command.arcType && command.arcType !== 'regular' ? ` (${writeAttribute('type', command.arcType)})` : '';
            return [appendLine(code, statements, `${command.source} -> ${command.target}${type};`, (s) => s.type === 'arc')];
        }
        case 'moveNode':
            return setAttributes(statements, command.id, { x: Math.round(command.x), y: Math.round(command.y) });
        case 'setAttribute':
            return setAttributes(statements, command.id, { [command.key]: command.value });
        case 'deleteElement':
            return deleteElement(code, statements, command.id);
        default:
            return [];
    }
}

/**
 * Statements that describe an element. Node knows its declaration and its arcs + Arc knows itself.
 * @param {Array<Object>} statements - AST nodes.
 * @param {string} id - Node or arc ID.
 * @returns {Array<Object>}
 */
function statementsOf(statements, id) {
    return statements.filter((s) => (s.type === 'arc' ? arcId(s.from, s.to) === id : s.name === id));
}

/**
 * Sets attributes of one element.
 * @param {Object<string, *>} values - Canonical key -> value, e.g. { x: 10, y: 20 }.
 */
function setAttributes(statements, id, values) {
    const owned = statementsOf(statements, id);
    if (owned.length === 0) return [];

    const changes = [];
    const missing = [];

    for (const [key, value] of Object.entries(values)) {
        const attr = owned.flatMap((s) => s.attributes).find((a) => canonicalKey(a.key) === key);
        if (attr) changes.push({ from: attr.valueStart, to: attr.end, insert: formatValue(value) });
        else missing.push(writeAttribute(key, value));
    }

    if (missing.length === 0) return changes;

    const target = owned.find((s) => s.type === 'declaration') ?? owned[0];
    const text = missing.join(', ');

    if (!target.attributeList) {
        return [...changes, { from: target.headerEnd, to: target.headerEnd, insert: ` (${text})` }];
    }

    const beforeParen = target.attributeList.end - 1;
    const separator = target.attributes.length > 0 ? ', ' : '';
    return [...changes, { from: beforeParen, to: beforeParen, insert: `${separator}${text}` }];
}

/**
 * Removes every statement of the element.
 * @param {string} code - Source code.
 * @param {Array<Object>} statements - AST nodes.
 * @param {string} id - ID of the element to delete.
 * @returns {Array<{from: number, to: number, insert: string}>}
 */
function deleteElement(code, statements, id) {
    const isArc = id.includes('->');
    const doomed = statements.filter((s) =>
        isArc ? s.type === 'arc' && arcId(s.from, s.to) === id : s.name === id || s.from === id || s.to === id
    );

    return mergeRanges(doomed.map((s) => removalRange(code, s)));
}

/**
 * Inserts a new line after the last statement of the same group (nodes / arcs) or at the EOF.
 */
function appendLine(code, statements, line, inGroup) {
    const last = statements.filter(inGroup).at(-1);

    if (last) {
        const at = lineEnd(code, last.end);
        return { from: at, to: at, insert: `\n${line}` };
    }

    const needsNewline = code.length > 0 && !code.endsWith('\n');
    return { from: code.length, to: code.length, insert: `${needsNewline ? '\n' : ''}${line}\n` };
}

/**
 * What to delete for statement.
 */
function removalRange(code, statement) {
    const start = code.lastIndexOf('\n', statement.start - 1) + 1;
    const end = lineEnd(code, statement.end);
    const before = code.slice(start, statement.start);
    const after = code.slice(statement.end, end).trim();

    if (before.trim() === '' && (after === '' || after.startsWith('//'))) {
        return { from: start, to: Math.min(end + 1, code.length), insert: '' };
    }

    const spaces = code.slice(statement.end).match(/^[ \t]*/)[0].length;
    return { from: statement.start, to: statement.end + spaces, insert: '' };
}

/** 
 * Joins overlapping removals so they can be applied together.
 */
function mergeRanges(ranges) {
    const sorted = [...ranges].sort((a, b) => a.from - b.from);
    const merged = [];

    for (const range of sorted) {
        const last = merged.at(-1);
        if (last && range.from <= last.to) last.to = Math.max(last.to, range.to);
        else merged.push({ ...range });
    }

    return merged;
}

/**
 * Applies non-overlapping changes, from the end so earlier offsets stay valid.
 */
function applyChanges(code, changes) {
    return [...changes]
        .sort((a, b) => b.from - a.from)
        .reduce((text, { from, to, insert }) => text.slice(0, from) + insert + text.slice(to), code);
}

/**
 * Position of the end of the line that contains index (before the newline).
 */
function lineEnd(code, index) {
    const newline = code.indexOf('\n', index);
    return newline === -1 ? code.length : newline;
}

/**
 * key: value with the short key when there is one (m: 3, l: "Idle").
 */
function writeAttribute(key, value) {
    return `${SHORT_KEY[key] ?? key}: ${formatValue(value)}`;
}

/**
 * Numbers as they are, strings quoted.
 */
function formatValue(value) {
    if (typeof value !== 'string') return String(value);
    const text = value.replace(/\n/g, ' ');
    if (!text.includes('"')) return `"${text}"`;
    if (!text.includes("'")) return `'${text}'`;
    return `"${text.replace(/"/g, '')}"`;
}
