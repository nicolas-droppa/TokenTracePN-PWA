import { PANELS } from './workspace.js';

/**
 * Menu definitions for the header bar. labelKey = i18n key with namespace.
 */
export const MENUS = [
    {
        id: 'file',
        labelKey: 'header:menus.file',
        items: [
            { id: 'newProject', labelKey: 'header:items.newProject' },
            { id: 'openFile', labelKey: 'header:items.openFile' },
            { id: 'save', labelKey: 'header:items.save' },
        ],
    },
    {
        id: 'edit',
        labelKey: 'header:menus.edit',
        items: [
            { id: 'undo', labelKey: 'header:items.undo' },
            { id: 'redo', labelKey: 'header:items.redo' },
            { id: 'deleteSelected', labelKey: 'header:items.deleteSelected' },
        ],
    },
    {
        id: 'view',
        labelKey: 'header:menus.view',
        items: [
            ...PANELS.map((panel) => ({ id: `show:${panel.id}`, labelKey: `workspace:panels.${panel.id}` })),
            { id: 'resetLayout', labelKey: 'header:items.resetLayout' },
        ],
    },
];
