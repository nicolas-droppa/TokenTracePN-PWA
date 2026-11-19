import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';

const files = import.meta.glob('../../src/locales/*/*.json', { eager: true, import: 'default' });

// { en: { common: {...}, matrices: {...} }, sk: {...} }
const resources = {};
for (const [path, content] of Object.entries(files)) {
    const [lang, file] = path.split('/').slice(-2);
    resources[lang] ??= {};
    resources[lang][file.replace('.json', '')] = content;
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

/** Flat list of keys without plural suffixes: 'copy.tooltip', 'toasts.removedArcs'. */
const keysOf = (object, prefix = '') =>
    Object.entries(object).flatMap(([key, value]) =>
        value && typeof value === 'object'
            ? keysOf(value, `${prefix}${key}.`)
            : [`${prefix}${key.replace(PLURAL_SUFFIX, '')}`]
    );

const unique = (list) => [...new Set(list)].sort();

describe('locales', () => {
    const base = resources[DEFAULT_LANGUAGE];

    it('has a folder for every language in LANGUAGES', () => {
        expect(Object.keys(resources).sort()).toEqual(LANGUAGES.map((l) => l.code).sort());
    });

    for (const { code } of LANGUAGES.filter((l) => l.code !== DEFAULT_LANGUAGE)) {
        it(`${code} has the same namespaces as ${DEFAULT_LANGUAGE}`, () => {
            expect(Object.keys(resources[code]).sort()).toEqual(Object.keys(base).sort());
        });

        for (const ns of Object.keys(base)) {
            it(`${code}/${ns} has the same keys as ${DEFAULT_LANGUAGE}`, () => {
                expect(unique(keysOf(resources[code][ns] ?? {}))).toEqual(unique(keysOf(base[ns])));
            });
        }
    }
});

// --- keys used in code ---------------------------------------------------

const SRC = join(process.cwd(), 'src');

const sourceFiles = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === 'locales' ? [] : sourceFiles(path);
        return /\.(js|jsx)$/.test(name) ? [path] : [];
    });

/** Does 'ns:key' (or key in the default namespace) exist in the default language? */
const exists = (fullKey, defaultNs) => {
    const [ns, key] = fullKey.includes(':') ? fullKey.split(':') : [defaultNs, fullKey];
    const value = key.split('.').reduce((node, part) => node?.[part], resources[DEFAULT_LANGUAGE][ns]);
    if (typeof value === 'string') return true;

    // plural key: 'toasts.removedArcs' -> 'toasts.removedArcs_one' / '_other'
    const parts = key.split('.');
    const last = parts.pop();
    const parent = parts.reduce((node, part) => node?.[part], resources[DEFAULT_LANGUAGE][ns]);
    return typeof parent?.[`${last}_other`] === 'string';
};

describe('translation keys used in code', () => {
    for (const file of sourceFiles(SRC)) {
        const code = readFileSync(file, 'utf-8');
        const ns = code.match(/useTranslation\('([^']+)'\)/)?.[1] ?? 'common';

        // only literal keys: t('a.b'), t("a.b") and labelKey: 'ns:a.b'
        const used = [
            ...[...code.matchAll(/\bt\(\s*'([^'`$]+)'/g)].map((m) => m[1]),
            ...[...code.matchAll(/labelKey:\s*'([^'`$]+)'/g)].map((m) => m[1]),
        ];
        if (used.length === 0) continue;

        it(`${file.replace(SRC, 'src')} uses existing keys`, () => {
            const missing = used.filter((key) => !exists(key, ns));
            expect(missing).toEqual([]);
        });
    }
});
