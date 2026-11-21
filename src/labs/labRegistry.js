// Every lab is a folder: task.js (meta + reference), description.md, template.py, tests.js, solution.py, icon.svg
const metas = import.meta.glob('./*/task.js', { eager: true, import: 'default' });
const descriptions = import.meta.glob('./*/description.md', { eager: true, query: '?raw', import: 'default' });
const templates = import.meta.glob('./*/template.py', { eager: true, query: '?raw', import: 'default' });
const tests = import.meta.glob('./*/tests.js', { eager: true, import: 'default' });
const icons = import.meta.glob('./*/icon.svg', { eager: true, query: '?url', import: 'default' });
// Lazy: each solution is its own small chunk, downloaded only when the student opens it
const solutions = import.meta.glob('./*/solution.py', { query: '?raw', import: 'default' });

const folderOf = (path) => path.split('/')[1];

/**
 * All labs, sorted by their order in the course.
 */
export const LABS = Object.entries(metas)
    .map(([path, meta]) => {
        const folder = folderOf(path);
        return {
            ...meta,
            description: descriptions[`./${folder}/description.md`] ?? '',
            template: templates[`./${folder}/template.py`] ?? '',
            icon: icons[`./${folder}/icon.svg`] ?? null,
            tests: tests[`./${folder}/tests.js`] ?? [],
        };
    })
    .sort((a, b) => a.order - b.order);

export const getLab = (labId) => LABS.find((lab) => lab.id === labId);

/**
 * Reference solution of a lab (loaded on demand).
 * @param {string} labId
 * @returns {Promise<string|null>} Python source, or null when the lab has none.
 */
export const getLabSolution = async (labId) => {
    const load = solutions[`./${labId}/solution.py`];
    return load ? load() : null;
};
