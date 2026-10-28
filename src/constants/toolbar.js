import { TOOLS } from './tools.js';

const TOOL_ICONS = `${import.meta.env.BASE_URL}icons/tools/`;

/**
 * Canvas toolbar content, top to bottom.
 */
export const TOOL_GROUPS = [
    [
        { id: TOOLS.SELECT, label: 'Select', icon: `${TOOL_ICONS}select.svg` },
        { id: TOOLS.PAN, label: 'Pan', icon: `${TOOL_ICONS}pan.svg` },
    ],
    [
        { id: TOOLS.PLACE, label: 'Place', icon: `${TOOL_ICONS}place.svg` },
        { id: TOOLS.TRANSITION, label: 'Transition', icon: `${TOOL_ICONS}transition.svg` },
    ],
    [
        { id: TOOLS.ARC, label: 'Regular arc', icon: `${TOOL_ICONS}arc_regular.svg` },
        { id: TOOLS.READ, label: 'Read arc', icon: `${TOOL_ICONS}arc_read.svg` },
        { id: TOOLS.INHIBITOR, label: 'Inhibitor arc', icon: `${TOOL_ICONS}arc_inhibitor.svg` },
        { id: TOOLS.RESET, label: 'Reset arc', icon: `${TOOL_ICONS}arc_reset.svg` },
    ],
];

// E/Q stepping helper for cycling
export const TOOL_ORDER = TOOL_GROUPS.flat().map((tool) => tool.id);