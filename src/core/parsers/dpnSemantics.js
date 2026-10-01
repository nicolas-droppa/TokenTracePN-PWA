import { ATTRIBUTE_ALIASES, ATTRIBUTE_SCHEMA, PLACE_TO_TRANSITION_ONLY } from '../../constants/parsers/dpnParser.js';

/**
 * Runs all semantic rules over the AST.
 * @param {Object} model - AST from dpnParser.
 * @returns {Array} Diagnostics sorted by position.
 */
export function checkSemantics(model) {
    if (!Array.isArray(model?.statements)) return [];

    const ctx = buildContext(model);

    return [
        // names and references
        ...checkUniqueNames(ctx),
        ...checkUndeclaredNames(ctx),
        // arcs
        ...checkArcEndpoints(ctx),
        ...checkSpecialArcDirection(ctx),
        ...checkUniqueArcs(ctx),
        // attributes
        ...checkUniqueAttributes(ctx),
        ...checkUnknownAttributes(ctx),
        ...checkAttributeValues(ctx),
        // hints
        ...checkUnconnectedNodes(ctx),
    ].sort((a, b) => a.line - b.line || a.col - b.col);
}

// private

/**
 * Builds derived views of the AST shared by all rules.
 * @param {Object} model - The parsed model containing statements.
 * @returns {Object} Context.
 */
function buildContext(model) {
    const { statements } = model;
    const declarations = statements.filter((s) => s.type === 'declaration');

    return {
        statements,
        declarations,
        arcs: statements.filter((s) => s.type === 'arc'),
        configurations: statements.filter((s) => s.type === 'configuration'),
        symbols: new Map(declarations.map((d) => [d.name, d])),
    };
}

/**
 * Creates a diagnostic in the shape shared by parser and semantics.
 * @param {'error'|'warning'|'info'} severity
 * @param {string} message
 * @param {{line: number, col: number}} pos - Any AST node or position object.
 * @returns {Object} Diagnostic.
 */
function diagnostic(severity, message, pos) {
    return {
        severity,
        message,
        line: pos.line,
        col: pos.col,
    };
}

/**
 * Returns every repeated occurrence of a key together with its first occurrence.
 * @param {Array} items - Items to check.
 * @param {Function} getKey - Returns the comparison key for an item.
 * @returns {Array<{item: *, first: *, key: string}>} Duplicates.
 */
function findDuplicates(items, getKey) {
    const seen = new Map();
    const duplicates = [];

    for (const item of items) {
        const key = getKey(item);
        const first = seen.get(key);

        if (first) duplicates.push({ item, first, key });
        else seen.set(key, item);
    }

    return duplicates;
}

/**
 * Resolves attribute shortcuts to their full name (m -> tokens).
 * @param {string} key - Attribute key as written in the source.
 * @returns {string} Canonical attribute key.
 */
function canonicalKey(key) {
    return ATTRIBUTE_ALIASES[key] ?? key;
}

/**
 * Resolves what kind of node a statement describes.
 * @param {Object} statement - AST node.
 * @param {Map<string, Object>} symbols - Declared nodes by name.
 * @returns {string|undefined} 'place' | 'transition' | 'arc', undefined if the name is not declared.
 */
function kindOf(statement, symbols) {
    if (statement.type === 'arc') return 'arc';
    if (statement.type === 'declaration') return statement.keyword;
    return symbols.get(statement.name)?.keyword;
}

/**
 * Label used in messages and duplicate keys: node name, or "from->to" for arcs.
 * @param {Object} statement - AST node.
 * @returns {string}
 */
function labelOf(statement) {
    return statement.type === 'arc' ? `${statement.from}->${statement.to}` : statement.name;
}

/**
 * Pairs every attribute with the schema entry it should match.
 * @param {Object} ctx - Context from buildContext.
 * @returns {Array<{attr: Object, kind: string, key: string, expected: *, schema: Object}>}
 *          expected is undefined when the attribute is not in the schema for that kind.
 */
function schemaEntries({ statements, symbols }) {
    return statements.flatMap((statement) => {
        const kind = kindOf(statement, symbols);
        const schema = ATTRIBUTE_SCHEMA[kind];
        if (!schema) return [];

        return statement.attributes.map((attr) => {
            const key = canonicalKey(attr.key);
            const expected = Object.hasOwn(schema, key) ? schema[key] : undefined;
            return { attr, kind, key, expected, schema };
        });
    });
}

/**
 * Value types usable in ATTRIBUTE_SCHEMA.
 */
const VALUE_TYPES = {
    number:         { test: (v) => typeof v === 'number',         label: 'a number' },
    string:         { test: (v) => typeof v === 'string',         label: 'a string' },
    nonNegativeInt: { test: (v) => Number.isInteger(v) && v >= 0, label: 'a whole number ≥ 0' },
    positiveInt:    { test: (v) => Number.isInteger(v) && v >= 1, label: 'a whole number ≥ 1' },
};

function matchesSchema(value, expected) {
    if (Array.isArray(expected)) return expected.includes(value);
    return VALUE_TYPES[expected]?.test(value) ?? false;
}

function describeExpected(expected) {
    if (Array.isArray(expected)) return `one of: ${expected.join(', ')}`;
    return VALUE_TYPES[expected]?.label ?? expected;
}

/**
 * Finds a schema key close enough to be a typo (makrings -> markings).
 * @param {string} key - Unknown key.
 * @param {Object} schema - Schema for the node kind.
 * @returns {string|undefined} Suggested key.
 */
function suggestKey(key, schema) {
    let best;
    let bestDistance = Infinity;

    for (const candidate of Object.keys(schema)) {
        const distance = levenshtein(key, candidate);
        if (distance < bestDistance) {
            best = candidate;
            bestDistance = distance;
        }
    }

    return best && bestDistance <= 2 && bestDistance < best.length / 2 ? best : undefined;
}

/** 
 * Computes the Levenshtein distance between two strings.
 * @param {string} a - First string.
 * @param {string} b - Second string.
 * @returns {number} Levenshtein distance.
 */
function levenshtein(a, b) {
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

    for (let i = 1; i <= a.length; i++) {
        const curr = [i];
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
        }
        prev = curr;
    }

    return prev[b.length];
}

/**
 * place p1; place p1;
 */
function checkUniqueNames({ declarations }) {
    return findDuplicates(declarations, (decl) => decl.name).map(({ item, first }) =>
        diagnostic('error', `'${item.name}' is already declared on line ${first.line}`, item.namePos)
    );
}

/**
 * p1 -> t9; p9 (x: 10); (t9, p9 not declared)
 */
function checkUndeclaredNames({ arcs, configurations, symbols }) {
    const references = [
        ...arcs.flatMap((arc) => [
            { name: arc.from, pos: arc.fromPos },
            { name: arc.to, pos: arc.toPos },
        ]),
        ...configurations.map((config) => ({ name: config.name, pos: config.namePos })),
    ];

    return references
        .filter(({ name }) => !symbols.has(name))
        .map(({ name, pos }) => diagnostic('error', `'${name}' is not declared`, pos));
}

/**
 * p1 -> p2; t1 -> t2;
 */
function checkArcEndpoints({ arcs, symbols }) {
    return arcs
        .map((arc) => ({ arc, from: symbols.get(arc.from), to: symbols.get(arc.to) }))
        .filter(({ from, to }) => from && to && from.keyword === to.keyword)
        .map(({ arc, from, to }) =>
            diagnostic('error', `Arc cannot connect ${from.keyword} '${arc.from}' to ${to.keyword} '${arc.to}'`, arc)
        );
}

/**
 * t1 -> p1 (type: "inhibitor");   
 * inhibitor/reset/read : place -> transition
 */
function checkSpecialArcDirection({ arcs, symbols }) {
    return arcs.flatMap((arc) => {
        const typeAttr = arc.attributes.find((attr) => canonicalKey(attr.key) === 'type');
        if (!typeAttr || !PLACE_TO_TRANSITION_ONLY.has(typeAttr.value)) return [];

        const from = symbols.get(arc.from);
        if (!from || from.keyword === 'place') return [];

        return [diagnostic('error', `Arc of type '${typeAttr.value}' must go from a place to a transition`, typeAttr)];
    });
}

/**
 * p1 -> t1; p1 -> t1;
 */
function checkUniqueArcs({ arcs }) {
    return findDuplicates(arcs, (arc) => labelOf(arc)).map(({ item, first, key }) =>
        diagnostic('warning', `Arc '${key}' is already declared on line ${first.line}, ignoring this one`, item)
    );
}

/**
 * place p1 (m: 2, tokens: 3); p1 (x: 10); p1 (x: 20); p1 -> t1 (w: 1, w: 2);
 */
function checkUniqueAttributes({ statements }) {
    const entries = statements.flatMap((statement) =>
        statement.attributes.map((attr) => ({ owner: labelOf(statement), attr }))
    );

    return findDuplicates(entries, (entry) => `${entry.owner}.${canonicalKey(entry.attr.key)}`).map(({ item, first }) =>
        diagnostic(
            'warning',
            `'${item.attr.key}' on '${item.owner}' is already set as '${first.attr.key}' on line ${first.attr.line}, ignoring this one`,
            item.attr
        )
    );
}

/**
 * place p1 (makrings: 2); 
 * - results in error with suggestion
 * place p1 (color: "red"); 
 * - results error
 */
function checkUnknownAttributes(ctx) {
    return schemaEntries(ctx)
        .filter(({ expected }) => expected === undefined)
        .map(({ attr, kind, key, schema }) => {
            const suggestion = suggestKey(key, schema);
            const hint = suggestion ? `, did you mean '${suggestion}'?` : '';

            return diagnostic('error', `Unknown attribute '${attr.key}' on ${kind}${hint}`, attr);
        });
}

/**
 * place p1 (tokens: "abc"); p1 -> t1 (weight: 0); p1 -> t1 (type: "unknown");
 */
function checkAttributeValues(ctx) {
    return schemaEntries(ctx)
        .filter(({ attr, expected }) => expected !== undefined && !matchesSchema(attr.value, expected))
        .map(({ attr, expected }) =>
            diagnostic('error', `'${attr.key}' must be ${describeExpected(expected)}`, attr)
        );
}

/**
 * place lonely;   
 * no arc connects to object.
 */
function checkUnconnectedNodes({ declarations, arcs }) {
    const connected = new Set(arcs.flatMap((arc) => [arc.from, arc.to]));

    return declarations
        .filter((decl) => !connected.has(decl.name))
        .map((decl) => diagnostic('info', `${decl.keyword} '${decl.name}' is not connected`, decl.namePos));
}