import { PANELS } from './workspace.js';

/**
 * Menu definitions for the header bar.
 */
export const MENUS = [
    {
        id: 'file',
        label: 'File',
        items: [
            { id: 'newProject', label: 'New project' },
            { id: 'openFile', label: 'Open file' },
            { id: 'save', label: 'Save' },
        ],
    },
    {
        id: 'edit',
        label: 'Edit',
        items: [
            { id: 'undo', label: 'Undo' },
            { id: 'redo', label: 'Redo' },
            { id: 'deleteSelected', label: 'Delete selected' },
        ],
    },
    {
        id: 'view',
        label: 'View',
        items: [
            ...PANELS.map((panel) => ({ id: `show:${panel.id}`, label: panel.title })),
            { id: 'resetLayout', label: 'Reset layout' },
        ],
    },
];
