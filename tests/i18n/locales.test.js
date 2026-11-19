import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/languages';
import { DIAGNOSTIC_CODES } from '@/constants/diagnostics';

const files = import.meta.glob('../../src/locales/*/*.json', { eager: true, import: 'default' });

const resources = {};
for (const [path, content] of Object.entries(files)) {
    const [lang, file] = path.split('/').slice(-2);
    resources[lang] ??= {};
    resources[lang][file.replace('.json', '')] = content;
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

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


const SRC = join(process.cwd(), 'src');

const sourceFiles = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === 'locales' ? [] : sourceFiles(path);
        return /\.(js|jsx)$/.test(name) ? [path] : [];
    });

const exists = (fullKey, defaultNs) => {
    const [ns, key] = fullKey.includes(':') ? fullKey.split(':') : [defaultNs, fullKey];
    const value = key.split('.').reduce((node, part) => node?.[part], resources[DEFAULT_LANGUAGE][ns]);
    if (typeof value === 'string') return true;

    const parts = key.split('.');
    const last = parts.pop();
    const parent = parts.reduce((node, part) => node?.[part], resources[DEFAULT_LANGUAGE][ns]);
    return typeof parent?.[`${last}_other`] === 'string';
};

describe('translation keys used in code', () => {
    for (const file of sourceFiles(SRC)) {
        const code = readFileSync(file, 'utf-8');
        const ns = code.match(/useTranslation\('([^']+)'\)/)?.[1] ?? 'common';

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

describe('diagnostics', () => {
    it('every DIAGNOSTIC code has a translation', () => {
        const keys = Object.keys(resources[DEFAULT_LANGUAGE].diagnostics);
        const missing = DIAGNOSTIC_CODES.filter((code) => !keys.some((key) => key === code || key.startsWith(`${code}_`)));
        expect(missing).toEqual([]);
    });

    it('core and hooks have no plain-text diagnostics left', () => {
        expect(() => execSync('node scripts/find-old-diagnostics.mjs', { stdio: 'pipe' })).not.toThrow();
    });
});
