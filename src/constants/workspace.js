/**
 * Workspace (dockview) configuration.
 */

export const PANELS = [
    { id: 'canvas', title: 'Canvas' },
    { id: 'code', title: 'Code' },
    { id: 'inspector', title: 'Inspector' },
    { id: 'problems', title: 'Problems' },
];

export const DEFAULT_LAYOUT = [
    { id: 'canvas' },
    { id: 'code', position: { referencePanel: 'canvas', direction: 'left' }, initialWidth: 320 },
    { id: 'inspector', position: { referencePanel: 'code', direction: 'below' } },
    { id: 'problems', position: { referencePanel: 'canvas', direction: 'below' }, initialHeight: 180 },
];

export const LAYOUT_VERSION = 1;

export const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
