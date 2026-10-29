/**
 * Workspace (dockview) configuration.
 */

export const PANELS = [
    { id: 'canvas', title: 'Canvas' },
    { id: 'code', title: 'Code' },
    { id: 'inspector', title: 'Inspector' },
    { id: 'problems', title: 'Problems' },
    { id: 'matrices', title: 'Matrices' }
];

export const DEFAULT_LAYOUT = [
    { id: 'canvas' },
    { id: 'code', position: { referencePanel: 'canvas', direction: 'left' }, initialWidth: 320 },
    { id: 'problems', position: { referencePanel: 'code', direction: 'below' }, initialHeight: 180 },
    { id: 'matrices', position: { referencePanel: 'canvas', direction: 'below' } },
];

export const LAYOUT_VERSION = 2;

export const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
