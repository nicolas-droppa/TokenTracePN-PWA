import { ARC_TYPE } from './net.js';

/**
 * Tool identifiers for the canvas toolbar.
 */
export const TOOLS = {
    SELECT: 'select',
    PAN: 'pan',
    PLACE: 'place',
    TRANSITION: 'transition',
    ARC: 'regular',
    INHIBITOR: 'inhibitor',
    RESET: 'reset',
    READ: 'read',
};

export const MOUSE_BUTTON = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
};

export const CANVAS_ACTION = {
    ADD_PLACE: 'ADD_PLACE',
    ADD_TRANSITION: 'ADD_TRANSITION',
    CLEAR_SELECTION: 'CLEAR_SELECTION',
    DELETE_ELEMENT: 'DELETE_ELEMENT',
    RESET_TOOL: 'RESET_TOOL',
    NONE: 'NONE',
};

export const TOOL_ARC_TYPE = {
    [TOOLS.ARC]: ARC_TYPE.REGULAR,
    [TOOLS.READ]: ARC_TYPE.READ,
    [TOOLS.INHIBITOR]: ARC_TYPE.INHIBITOR,
    [TOOLS.RESET]: ARC_TYPE.RESET,
};