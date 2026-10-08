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
];
