import { ATTRIBUTE_SCHEMA } from '../../constants/dpn.js';
import { AUTO_LAYOUT } from '../../constants/layout.js';
import { createPlace, createTransition, createArc, arcId } from '../models.js';
import { canonicalKey, kindOf, matchesSchema, modelField } from './dpnSchema.js';

/**
 * Builds the Petri net model (see core/models.js) from a DPN AST.
 *
 * Meant to run only on code without errors. Whatever the semantic checker reports as
 * a warning is resolved the way its message says: the first declaration, the first arc
 * between two nodes and the first value of an attribute win, the rest is ignored.
 *
 * @param {Object} ast - `model` returned by dpnParser.parse().
 * @returns {import('../models.js').Net}
 */
export function buildNet(ast) {
    const statements = ast?.statements ?? [];
    const symbols = collectDeclarations(statements);
    const nodeFields = collectNodeFields(statements, symbols);

    const places = [];
    const transitions = [];
    let declarationIndex = 0;

    for (const [name, declaration] of symbols) {
        const fields = nodeFields.get(name);
        // Grid cell = order of the declaration, so moving another node never shifts this one
        const auto = autoPosition(declarationIndex++);
        const node = { ...fields, id: name, x: fields.x ?? auto.x, y: fields.y ?? auto.y };

        if (declaration.keyword === 'place') places.push(createPlace(node));
        else transitions.push(createTransition(node));
    }

    return { places, transitions, arcs: buildArcs(statements, symbols) };
}

// private

/**
 * Name -> first declaration of that name (later duplicates are errors and are ignored).
 * @returns {Map<string, Object>}
 */
function collectDeclarations(statements) {
    const symbols = new Map();

    for (const statement of statements) {
        if (statement.type === 'declaration' && !symbols.has(statement.name)) {
            symbols.set(statement.name, statement);
        }
    }

    return symbols;
}

/**
 * Name -> model fields of that node, merged from its declaration and all its
 * configurations in source order (`p1 (x: 10);` after `place p1;`).
 * @returns {Map<string, Object>}
 */
function collectNodeFields(statements, symbols) {
    const nodeFields = new Map([...symbols.keys()].map((name) => [name, {}]));

    for (const statement of statements) {
        if (statement.type === 'arc') continue;
        if (statement.type === 'declaration' && symbols.get(statement.name) !== statement) continue; // duplicate

        const fields = nodeFields.get(statement.name);
        if (!fields) continue; // configuration of an undeclared node

        addAttributes(fields, statement.attributes, kindOf(statement, symbols));
    }

    return nodeFields;
}

/**
 * Arcs between existing nodes of different kinds, one per pair of nodes.
 * @returns {import('../models.js').Arc[]}
 */
function buildArcs(statements, symbols) {
    const arcs = [];
    const seen = new Set();

    for (const statement of statements) {
        if (statement.type !== 'arc') continue;

        const from = symbols.get(statement.from);
        const to = symbols.get(statement.to);
        if (!from || !to || from.keyword === to.keyword) continue;

        const id = arcId(statement.from, statement.to);
        if (seen.has(id)) continue;
        seen.add(id);

        const fields = addAttributes({}, statement.attributes, 'arc');
        arcs.push(createArc({ ...fields, source: statement.from, target: statement.to }));
    }

    return arcs;
}

/**
 * Copies valid attributes into `fields` under their model field name.
 * A field that is already set keeps its value (first one wins).
 * @param {Object} fields - Target object, mutated and returned.
 * @param {Array<{key: string, value: *}>} attributes - From the AST.
 * @param {'place'|'transition'|'arc'} kind
 * @returns {Object} fields
 */
function addAttributes(fields, attributes, kind) {
    const schema = ATTRIBUTE_SCHEMA[kind] ?? {};

    for (const { key, value } of attributes) {
        const canonical = canonicalKey(key);
        const expected = Object.hasOwn(schema, canonical) ? schema[canonical] : undefined;
        if (expected === undefined || !matchesSchema(value, expected)) continue;

        const field = modelField(kind, canonical);
        if (!Object.hasOwn(fields, field)) fields[field] = value;
    }

    return fields;
}

/** Grid position of the n-th declared node (used only when it has no x/y in the code). */
function autoPosition(index) {
    return {
        x: AUTO_LAYOUT.ORIGIN_X + (index % AUTO_LAYOUT.COLUMNS) * AUTO_LAYOUT.SPACING_PX,
        y: AUTO_LAYOUT.ORIGIN_Y + Math.floor(index / AUTO_LAYOUT.COLUMNS) * AUTO_LAYOUT.SPACING_PX,
    };
}
