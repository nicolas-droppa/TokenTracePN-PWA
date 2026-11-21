import { DEFAULT_LANGUAGE } from '../constants/languages';
import { parseFrontmatter } from './frontmatter.js';

const metas = import.meta.glob('./*/task.js', { eager: true, import: 'default' });
const descriptions = import.meta.glob('./*/descriptions/*.md', { eager: true, query: '?raw', import: 'default' });
const templates = import.meta.glob('./*/template.py', { eager: true, query: '?raw', import: 'default' });
const tests = import.meta.glob('./*/tests.js', { eager: true, import: 'default' });
const icons = import.meta.glob('./*/icon.svg', { eager: true, query: '?url', import: 'default' });
// solution lazy loaded on demand
const solutions = import.meta.glob('./*/solution.py', { query: '?raw', import: 'default' });

const folderOf = (path) => path.split('/')[1];

const languageOf = (path) => path.split('/').pop().replace('.md', '');

const textsByLab = {};
for (const [path, raw] of Object.entries(descriptions)) {
    if (!raw.trim()) {
        continue;
    }

    const folder = folderOf(path);
    const { meta, body } = parseFrontmatter(raw);
    textsByLab[folder] ??= {};
    textsByLab[folder][languageOf(path)] = {
        title: meta.title ?? '',
        summary: meta.summary ?? '',
        body,
    };
}

/**
 * All labs, sorted by their order in the course.
 */
export const LABS = Object.entries(metas)
    .map(([path, meta]) => {
        const folder = folderOf(path);
        return {
            ...meta,
            texts: textsByLab[folder] ?? {},
            template: templates[`./${folder}/template.py`] ?? '',
            icon: icons[`./${folder}/icon.svg`] ?? null,
            tests: tests[`./${folder}/tests.js`] ?? [],
        };
    })
    .sort((a, b) => a.order - b.order);

export const getLab = (labId) => LABS.find((lab) => lab.id === labId);

/**
 * Get the text of a lab in a specific language, fallback to the default...
 * @param {Object} lab - Lab object.
 * @param {string} language - Language code.
 * @returns {Object} Object with title, summary and body.
 */
export const getLabText = (lab, language) => {
    const fallbackText = language !== DEFAULT_LANGUAGE ? lab.texts?.[DEFAULT_LANGUAGE] : undefined;
    const text = lab.texts?.[language] ?? fallbackText ?? {};

    return {
        title: text.title || fallbackText?.title || lab.title || lab.id,
        summary: text.summary || fallbackText?.summary || '',
        body: text.body || fallbackText?.body || '',
    };
};

/**
 * Reference solution of a lab (loaded on demand).
 * @param {string} labId
 * @returns {Promise<string|null>} Python source, or null when the lab has none.
 */
export const getLabSolution = async (labId) => {
    const load = solutions[`./${labId}/solution.py`];
    return load ? load() : null;
};
