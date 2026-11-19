// Lists diagnostics that still use plain text instead of a DIAGNOSTIC code.
// Usage: node scripts/find-old-diagnostics.mjs   (exit code 1 when something is found)
// A line ending with `// i18n-ignore` is skipped (developer-only errors).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PATTERNS = [
    { name: 'diagnostic', regex: /diagnostic\(\s*'(?:error|warning|info)'\s*,\s*[`'"]/g },
    { name: 'error', regex: /new\s+Error\(\s*[`'"]/g },
    { name: 'message', regex: /message:\s*[`'"][A-Za-z]/g },
];

const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return files(path);
        return /\.(js|jsx)$/.test(name) ? [path] : [];
    });

let total = 0;
for (const file of [...files('src/core'), ...files('src/hooks')]) {
    const code = readFileSync(file, 'utf-8');
    const lines = code.split('\n');

    for (const { name, regex } of PATTERNS) {
        for (const match of code.matchAll(regex)) {
            const line = code.slice(0, match.index).split('\n').length;
            const text = lines[line - 1];
            if (text.includes('i18n-ignore')) continue;

            console.log(`${file}:${line}  [${name}]  ${text.trim().slice(0, 110)}`);
            total++;
        }
    }
}

console.log(total === 0 ? 'No plain-text diagnostics left.' : `\n${total} left to migrate.`);
process.exit(total === 0 ? 0 : 1);
