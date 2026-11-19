// Every task is a folder: task.js (meta + reference), description.md, template.py, tests.js
const metas = import.meta.glob('./*/task.js', { eager: true, import: 'default' });
const descriptions = import.meta.glob('./*/description.md', { eager: true, query: '?raw', import: 'default' });
const templates = import.meta.glob('./*/template.py', { eager: true, query: '?raw', import: 'default' });
const tests = import.meta.glob('./*/tests.js', { eager: true, import: 'default' });

const folderOf = (path) => path.split('/')[1];

/**
 * All analysis tasks, sorted by their order in the course.
 */
export const TASKS = Object.entries(metas)
    .map(([path, meta]) => {
        const folder = folderOf(path);
        return {
            ...meta,
            description: descriptions[`./${folder}/description.md`] ?? '',
            template: templates[`./${folder}/template.py`] ?? '',
            tests: tests[`./${folder}/tests.js`] ?? [],
        };
    })
    .sort((a, b) => a.order - b.order);

export const getTask = (id) => TASKS.find((task) => task.id === id);
