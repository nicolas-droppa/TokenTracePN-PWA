/**
 * Keyboard shortcuts for tools and toolbar buttons.
 */
import { TOOLS } from './tools.js';

export const TOOL_SHORTCUTS = {
    [TOOLS.SELECT]: ['Digit1', 'Numpad1'],
    [TOOLS.PAN]: ['Digit2', 'Numpad2'],
    [TOOLS.PLACE]: ['Digit3', 'Numpad3'],
    [TOOLS.TRANSITION]: ['Digit4', 'Numpad4'],
    [TOOLS.ARC]: ['Digit5', 'Numpad5'],
    [TOOLS.READ]: ['Digit6', 'Numpad6'],
    [TOOLS.INHIBITOR]: ['Digit7', 'Numpad7'],
    [TOOLS.RESET]: ['Digit8', 'Numpad8'],
};

export const TOOLBAR_SHORTCUTS = {
    previousTool: ['KeyQ'],
    nextTool: ['KeyE'],
    toggleCollapse: ['KeyC'],
};
