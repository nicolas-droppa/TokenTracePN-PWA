import { describe, it, expect } from 'vitest';
import { createInstance } from 'i18next';
import { formatDiagnostic } from '@/utils/formatDiagnostic';
import { DIAGNOSTIC, DIAGNOSTIC_CODES } from '@/constants/diagnostics';
import { LANGUAGES } from '@/constants/languages';

const files = import.meta.glob('../../src/locales/*/*.json', { eager: true, import: 'default' });
const resources = {};
for (const [path, content] of Object.entries(files)) {
    const [lang, file] = path.split('/').slice(-2);
    resources[lang] ??= {};
    resources[lang][file.replace('.json', '')] = content;
}

/** Separate i18next instance, the app one needs a browser (document, localStorage). */
const tFor = (lng) => {
    const i18n = createInstance();
    i18n.init({ resources, lng, fallbackLng: 'en', defaultNS: 'common', interpolation: { escapeValue: false } });
    return i18n.t.bind(i18n);
};

/** Realistic params for every code. */
const SAMPLE_PARAMS = {
    [DIAGNOSTIC.UNCLOSED_STRING]: {},
    [DIAGNOSTIC.UNKNOWN_CHARACTER]: { char: '@' },
    [DIAGNOSTIC.UNEXPECTED_TOKEN]: { expected: 'SEMI', found: 'EOF' },
    [DIAGNOSTIC.EXPECTED_DECLARATION]: { found: 'NUMBER' },
    [DIAGNOSTIC.EXPECTED_VALUE]: { found: 'SEMI' },
    [DIAGNOSTIC.DUPLICATE_DECLARATION]: { name: 'p', line: 1 },
    [DIAGNOSTIC.UNDECLARED_NAME]: { name: 'p9' },
    [DIAGNOSTIC.INVALID_ARC_ENDPOINTS]: { kind: 'place', from: 'a', to: 'b' },
    [DIAGNOSTIC.SPECIAL_ARC_DIRECTION]: { type: 'read' },
    [DIAGNOSTIC.DUPLICATE_ARC]: { arc: 'p->t', line: 2 },
    [DIAGNOSTIC.DUPLICATE_RESET_ARC]: { arc: 'p->t', line: 2 },
    [DIAGNOSTIC.ARC_TYPE_CONFLICT]: { arc: 'p->t', line: 2, firstType: 'regular', type: 'read' },
    [DIAGNOSTIC.RESET_ARC_WEIGHT]: { arc: 'p->t' },
    [DIAGNOSTIC.DUPLICATE_ATTRIBUTE]: { key: 'x', owner: 'p', firstKey: 'x', line: 1 },
    [DIAGNOSTIC.UNKNOWN_ATTRIBUTE]: { key: 'color', kind: 'place' },
    [DIAGNOSTIC.INVALID_ATTRIBUTE_TYPE]: { key: 'tokens', expected: 'nonNegativeInt' },
    [DIAGNOSTIC.INVALID_ATTRIBUTE_OPTION]: { key: 'type', options: ['regular', 'read'] },
    [DIAGNOSTIC.NOT_CONNECTED]: { kind: 'transition', name: 't1' },
    [DIAGNOSTIC.UNKNOWN_ERROR]: { details: 'boom' },
};

describe('formatDiagnostic', () => {
    it('has sample params for every code', () => {
        expect(Object.keys(SAMPLE_PARAMS).sort()).toEqual([...DIAGNOSTIC_CODES].sort());
    });

    for (const { code: lng } of LANGUAGES) {
        const t = tFor(lng);

        it.each(DIAGNOSTIC_CODES)(`${lng}: %s renders a full sentence`, (code) => {
            const text = formatDiagnostic({ code, params: SAMPLE_PARAMS[code] }, t);

            expect(text).not.toContain('{{'); // every placeholder filled
            expect(text).not.toContain(code); // not the raw key
            expect(text).not.toContain('diagnostics:');
        });
    }

    it('uses the node kind for grammar (sk)', () => {
        const t = tFor('sk');
        expect(formatDiagnostic({ code: DIAGNOSTIC.NOT_CONNECTED, params: { kind: 'place', name: 'p' } }, t))
            .toBe("Miesto 'p' nie je prepojené");
        expect(formatDiagnostic({ code: DIAGNOSTIC.NOT_CONNECTED, params: { kind: 'transition', name: 't' } }, t))
            .toBe("Prechod 't' nie je prepojený");
    });

    it('translates token types', () => {
        expect(formatDiagnostic({ code: DIAGNOSTIC.UNEXPECTED_TOKEN, params: { expected: 'SEMI', found: 'EOF' } }, tFor('en')))
            .toBe("Expected ';' but found the end of the code");
    });

    it('adds the suggestion when there is one', () => {
        const text = formatDiagnostic(
            { code: DIAGNOSTIC.UNKNOWN_ATTRIBUTE, params: { key: 'tokns', kind: 'place', suggestion: 'tokens' } },
            tFor('en')
        );
        expect(text).toBe("Unknown attribute 'tokns' on a place, did you mean 'tokens'?");
    });

    it('falls back to a plain message without a code', () => {
        expect(formatDiagnostic({ message: 'old text' }, tFor('en'))).toBe('old text');
    });
});
