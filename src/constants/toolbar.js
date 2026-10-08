import { TOOLS } from './tools.js';

/**
 * Canvas toolbar content, top to bottom.
 */
export const TOOL_GROUPS = [
    [
        { id: TOOLS.SELECT, label: 'Select', icon: '/icons/tools/select.svg' },
        { id: TOOLS.PAN, label: 'Pan', icon: '/icons/tools/pan.svg' },
    ],
    [
        { id: TOOLS.PLACE, label: 'Place', icon: '/icons/tools/place.svg' },
        { id: TOOLS.TRANSITION, label: 'Transition', icon: '/icons/tools/transition.svg' },
    ],
    [
        { id: TOOLS.ARC, label: 'Regular arc', icon: '/icons/tools/arc_regular.svg' },
        { id: TOOLS.READ, label: 'Read arc', icon: '/icons/tools/arc_read.svg' },
        { id: TOOLS.INHIBITOR, label: 'Inhibitor arc', icon: '/icons/tools/arc_inhibitor.svg' },
        { id: TOOLS.RESET, label: 'Reset arc', icon: '/icons/tools/arc_reset.svg' },
    ],
];

// E/Q stepping helper for cycling
export const TOOL_ORDER = TOOL_GROUPS.flat().map((tool) => tool.id);
