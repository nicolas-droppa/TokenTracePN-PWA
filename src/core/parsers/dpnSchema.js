import { ATTRIBUTE_ALIASES, ATTRIBUTE_FIELDS } from '../../constants/dpn.js';

/**
 * Resolves attribute shortcuts to their full name (m -> tokens).
 * @param {string} key - Attribute key as written in source.
 * @returns {string} Canonical attribute key.
 */
export function canonicalKey(key) {
    return ATTRIBUTE_ALIASES[key] ?? key;
}

/**
 * Model field an attribute is stored in, when it differs from attribute name.
 * @param {'place'|'transition'|'arc'} kind
 * @param {string} key - Canonical attribute key.
 * @returns {string}
 */
export function modelField(kind, key) {
    return ATTRIBUTE_FIELDS[kind]?.[key] ?? key;
}

/**
 * Resolves what kind of node a statement describes.
 * @param {Object} statement - AST node.
 * @param {Map<string, Object>} symbols - Declared nodes by name.
 * @returns {string|undefined} 'place' | 'transition' | 'arc' | undefined.
 */
export function kindOf(statement, symbols) {
    if (statement.type === 'arc') return 'arc';
    if (statement.type === 'declaration') return statement.keyword;
    return symbols.get(statement.name)?.keyword;
}

/**
 * Value types usable in ATTRIBUTE_SCHEMA.
 */
export const VALUE_TYPES = {
    number:         { test: (v) => typeof v === 'number',         label: 'a number' },
    string:         { test: (v) => typeof v === 'string',         label: 'a string' },
    nonNegativeInt: { test: (v) => Number.isInteger(v) && v >= 0, label: 'a whole number ≥ 0' },
    positiveInt:    { test: (v) => Number.isInteger(v) && v >= 1, label: 'a whole number ≥ 1' },
};

export function matchesSchema(value, expected) {
    if (Array.isArray(expected)) return expected.includes(value);
    return VALUE_TYPES[expected]?.test(value) ?? false;
}

export function describeExpected(expected) {
    if (Array.isArray(expected)) return `one of: ${expected.join(', ')}`;
    return VALUE_TYPES[expected]?.label ?? expected;
}
