import { TOOLS, MOUSE_BUTTON, CANVAS_ACTION } from '../../../constants/tools.js';

/**
 * @param {number} button
 * @param {boolean} isShiftPressed
 * @param {string} selectedTool
 * @returns {boolean}
 */
export const shouldStartPanning = (button, isShiftPressed, selectedTool) => {
    if (button === MOUSE_BUTTON.MIDDLE) return true;
    if (button !== MOUSE_BUTTON.LEFT) return false;
    return isShiftPressed || selectedTool === TOOLS.PAN;
};

/**
 * @param {EventTarget} target
 * @returns {boolean}
 */
export const isCanvasBackgroundClick = (target) =>
    target.tagName === 'svg' || target.dataset?.canvasBackground !== undefined;

/**
 * Extracts the Petri net element under the pointer.
 * @param {EventTarget} target
 * @returns {{ id: string, type: string } | null}
 */
export const getElementFromEvent = (target) => {
    const el = target.closest?.('[data-element-id]');
    if (!el) return null;
    return { id: el.dataset.elementId, type: el.dataset.elementType };
};

/**
 * Decides what a left click on empty canvas means. Does not execute anything.
 * @param {string} selectedTool
 * @returns {{ type: string }}
 */
export const resolveBackgroundClickAction = (selectedTool) => {
    switch (selectedTool) {
        case TOOLS.PLACE:      return { type: CANVAS_ACTION.ADD_PLACE };
        case TOOLS.TRANSITION: return { type: CANVAS_ACTION.ADD_TRANSITION };
        case TOOLS.SELECT:     return { type: CANVAS_ACTION.CLEAR_SELECTION };
        default:               return { type: CANVAS_ACTION.NONE };
    }
};

/**
 * Right click: resets the active tool, or deletes an element in select mode.
 * @param {string} selectedTool
 * @param {{ id: string } | null} element
 * @returns {{ type: string, id?: string }}
 */
export const resolveContextMenuAction = (selectedTool, element) => {
    if (selectedTool !== TOOLS.SELECT) return { type: CANVAS_ACTION.RESET_TOOL };
    if (element) return { type: CANVAS_ACTION.DELETE_ELEMENT, id: element.id };
    return { type: CANVAS_ACTION.NONE };
};