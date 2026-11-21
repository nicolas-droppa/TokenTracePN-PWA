import i18n from '../i18n';
import { DEFAULT_LAYOUT } from '../constants/workspace.js';

const titleOf = (id) => i18n.t(`workspace:panels.${id}`);

/**
 * Adds a panel where DEFAULT_LAYOUT says.
 * @param {import('dockview-react').DockviewApi} api
 * @param {string} id - Panel id from PANELS.
 */
const addPanel = (api, id) => {
    const { position, initialWidth, initialHeight } = DEFAULT_LAYOUT.find((entry) => entry.id === id) ?? {};
    const hasReference = position && (!position.referencePanel || api.getPanel(position.referencePanel));

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
 * Re-translates tab titles (restored layouts keep the title from the time they were saved).
 * @param {import('dockview-react').DockviewApi} api
 */
export const translatePanelTitles = (api) => {
    api.panels.forEach((panel) => panel.api.setTitle(titleOf(panel.id)));
};

/**
 * Applies default layout.
 * @param {import('dockview-react').DockviewApi} api
 */
export const applyDefaultLayout = (api) => {
    api.clear();
    DEFAULT_LAYOUT
        .filter(({ openByDefault = true }) => openByDefault)
        .forEach(({ id }) => addPanel(api, id));
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

/**
 * Closes a panel if it is open in dockview.
 * @param {import('dockview-react').DockviewApi} api
 * @param {string} id - Panel id from PANELS.
 */
export const closePanel = (api, id) => {
    const panel = api.getPanel(id);
    if (panel) panel.api.close();
};

/**
 * Columns with these panels are not pinned: canvas takes the free space...
 */
const FLEXIBLE_PANELS = ['canvas', 'lab'];

const horizontalRange = (group) => {
    const { left, right } = group.element.getBoundingClientRect();
    return { left, right };
};

const overlaps = (a, b) => a.left < b.right - 1 && b.left < a.right - 1;

/**
 * Widths of the groups that should keep their size: groups that are not in the same column
 * as the canvas or the lab (e.g. code + problems on the left).
 * @param {import('dockview-react').DockviewApi} api
 * @returns {Record<string, number>} group id -> width in px
 */
export const pinnedWidths = (api) => {
    const flexible = api.groups
        .filter((group) => group.panels.some((panel) => FLEXIBLE_PANELS.includes(panel.id)))
        .map(horizontalRange);

    return Object.fromEntries(
        api.groups
            .filter((group) => !flexible.some((range) => overlaps(range, horizontalRange(group))))
            .filter((group) => group.api.width > 0)
            .map((group) => [group.id, group.api.width])
    );
};

/**
 * Restores group widths after dockview redistributed them (it splits space evenly on add/remove).
 * @param {import('dockview-react').DockviewApi} api
 * @param {Record<string, number>} widths - From pinnedWidths.
 */
export const restoreWidths = (api, widths) => {
    api.groups.forEach((group) => {
        const width = widths[group.id];
        if (width && group.api.width !== width) group.api.setSize({ width });
    });
};
