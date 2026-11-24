/**
 * Workspace (dockview) configuration.
 */

/** Panel ids, titles come from locales (workspace:panels.<id>). */
export const PANELS = [
    { id: 'canvas' },
    { id: 'code' },
    { id: 'problems' },
    { id: 'matrices' },
    { id: 'lab' },
];

export const DEFAULT_LAYOUT = [
    { id: 'canvas' },
    { id: 'code', position: { referencePanel: 'canvas', direction: 'left' }, initialWidth: 320 },
    { id: 'problems', position: { referencePanel: 'code', direction: 'below' }, initialHeight: 180 },
    { id: 'matrices', position: { referencePanel: 'canvas', direction: 'below' } },
    { id: 'lab', position: { direction: 'right' }, initialWidth: 420, openByDefault: false },
];

export const LAYOUT_VERSION = 4;

export const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
