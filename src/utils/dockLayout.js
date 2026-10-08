import { PANELS, DEFAULT_LAYOUT } from '../constants/workspace.js';

const titleOf = (id) => PANELS.find((panel) => panel.id === id)?.title ?? id;

/**
 * Adds a panel where DEFAULT_LAYOUT says.
 * @param {import('dockview-react').DockviewApi} api
 * @param {string} id - Panel id from PANELS.
 */
const addPanel = (api, id) => {
    const { position, initialWidth, initialHeight } = DEFAULT_LAYOUT.find((entry) => entry.id === id) ?? {};
    const hasReference = position && api.getPanel(position.referencePanel);

    return api.addPanel({
        id,
        component: id,
        title: titleOf(id),
        renderer: 'always', // keep the DOM when the tab is hidden (CodeMirror history, canvas zoom)
        ...(hasReference && { position }),
        ...(initialWidth && { initialWidth }),
        ...(initialHeight && { initialHeight }),
    });
};

/**
 * Applies default layout.
 * @param {import('dockview-react').DockviewApi} api
 */
export const applyDefaultLayout = (api) => {
    api.clear();
    DEFAULT_LAYOUT.forEach(({ id }) => addPanel(api, id));
    api.getPanel(DEFAULT_LAYOUT[0].id)?.api.setActive();
};

/**
 * Reveals a panel - focuses or reopens it.
 * @param {import('dockview-react').DockviewApi} api
 * @param {string} id - Panel id from PANELS.
 */
export const revealPanel = (api, id) => {
    const panel = api.getPanel(id);
    if (panel) panel.api.setActive();
    else addPanel(api, id);
};
