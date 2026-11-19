import { describe, it, expect } from 'vitest';
import { parse } from '@/core/parsers/dpnParser';
import { DIAGNOSTIC } from '@/constants/diagnostics';

/** Codes of all diagnostics for the code. */
const codesOf = (code) => parse(code).errors.map((d) => d.code);

/** The first diagnostic with the given code. */
const find = (code, diagnosticCode) => parse(code).errors.find((d) => d.code === diagnosticCode);

const NET = 'place p; transition t;';

describe('syntax diagnostics', () => {
    it.each([
        ['missing semicolon', 'place p', DIAGNOSTIC.UNEXPECTED_TOKEN],
        ['unknown character', 'place p; @', DIAGNOSTIC.UNKNOWN_CHARACTER],
        ['unclosed string', 'place p (l: "abc);', DIAGNOSTIC.UNCLOSED_STRING],
        ['statement without keyword', '42;', DIAGNOSTIC.EXPECTED_DECLARATION],
        ['attribute without value', 'place p (x: ;);', DIAGNOSTIC.EXPECTED_VALUE],
    ])('%s', (_name, code, expected) => {
        expect(codesOf(code)).toContain(expected);
    });

    it('keeps token types as params, not text', () => {
        expect(find('place p', DIAGNOSTIC.UNEXPECTED_TOKEN)).toMatchObject({
            severity: 'error',
            params: { expected: 'SEMI', found: 'EOF' },
        });
    });
});

describe('semantic diagnostics', () => {
    it.each([
        ['duplicate declaration', 'place p; place p;', DIAGNOSTIC.DUPLICATE_DECLARATION],
        ['undeclared name', `${NET} p -> t9;`, DIAGNOSTIC.UNDECLARED_NAME],
        ['place to place', 'place a; place b; a -> b;', DIAGNOSTIC.INVALID_ARC_ENDPOINTS],
        ['read arc from a transition', `${NET} t -> p (t: "read");`, DIAGNOSTIC.SPECIAL_ARC_DIRECTION],
        ['duplicate arc', `${NET} p -> t; p -> t;`, DIAGNOSTIC.DUPLICATE_ARC],
        ['duplicate reset arc', `${NET} p -> t (t: "reset"); p -> t (t: "reset");`, DIAGNOSTIC.DUPLICATE_RESET_ARC],
        ['arc type conflict', `${NET} p -> t; p -> t (t: "read");`, DIAGNOSTIC.ARC_TYPE_CONFLICT],
        ['reset arc with weight', `${NET} p -> t (t: "reset", w: 2);`, DIAGNOSTIC.RESET_ARC_WEIGHT],
        ['duplicate attribute', 'place p (x: 1, x: 2);', DIAGNOSTIC.DUPLICATE_ATTRIBUTE],
        ['unknown attribute', 'place p (color: "red");', DIAGNOSTIC.UNKNOWN_ATTRIBUTE],
        ['wrong value type', 'place p (tokens: "abc");', DIAGNOSTIC.INVALID_ATTRIBUTE_TYPE],
        ['value not in options', `${NET} p -> t (t: "magic");`, DIAGNOSTIC.INVALID_ATTRIBUTE_OPTION],
        ['not connected', 'place lonely;', DIAGNOSTIC.NOT_CONNECTED],
    ])('%s', (_name, code, expected) => {
        expect(codesOf(code)).toContain(expected);
    });

    it('passes the node kind so the UI can pick the right sentence', () => {
        expect(find('place lonely;', DIAGNOSTIC.NOT_CONNECTED).params).toEqual({ kind: 'place', name: 'lonely' });
    });

    it('passes both arc types on a conflict', () => {
        expect(find(`${NET} p -> t; p -> t (t: "read");`, DIAGNOSTIC.ARC_TYPE_CONFLICT).params).toMatchObject({
            arc: 'p->t',
            firstType: 'regular',
            type: 'read',
        });
    });

    it('never puts English text into diagnostics', () => {
        const all = parse(`${NET} place p; p -> x; t -> p (t: "read"); place q (color: "red");`).errors;
        expect(all.every((d) => d.code && d.message === undefined)).toBe(true);
    });
});
