import { TOOLS } from './tools.js';

const TOOL_ICONS = `${import.meta.env.BASE_URL}icons/tools/`;

/**
 * Canvas toolbar content, top to bottom. Labels come from locales (canvas:toolbar.tools.<id>).
 */
export const TOOL_GROUPS = [
    [
        { id: TOOLS.SELECT, icon: `${TOOL_ICONS}select.svg` },
        { id: TOOLS.PAN, icon: `${TOOL_ICONS}pan.svg` },
    ],
    [
        { id: TOOLS.PLACE, icon: `${TOOL_ICONS}place.svg` },
        { id: TOOLS.TRANSITION, icon: `${TOOL_ICONS}transition.svg` },
    ],
    [
        { id: TOOLS.ARC, icon: `${TOOL_ICONS}arc_regular.svg` },
        { id: TOOLS.INHIBITOR, icon: `${TOOL_ICONS}arc_inhibitor.svg` },
        { id: TOOLS.READ, icon: `${TOOL_ICONS}arc_read.svg` },
        { id: TOOLS.RESET, icon: `${TOOL_ICONS}arc_reset.svg` },
    ],
];

// E/Q stepping helper for cycling
export const TOOL_ORDER = TOOL_GROUPS.flat().map((tool) => tool.id);