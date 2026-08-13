/**
 * Checks if panning should start based on the key pressed and the selected tool.
 * @param {number} button - Mouse button pressed (0 for left, 1 for middle, 2 for right).
 * @param {boolean} isShiftPressed - Whether the Shift key is pressed.
 * @param {string} selectedTool - Currently selected tool.
 * @returns {boolean} - True if panning should start, false otherwise.
 */
export const shouldStartPanning = (button, isShiftPressed, selectedTool) => {
    return button === 1 || isShiftPressed || selectedTool === 'pan';
};

/**
 * Checks if the click was on the canvas background.
 * @param {HTMLElement} target - Clicked element.
 * @returns {boolean} - True if the click was on the canvas background, false otherwise.
 */ 
export const isCanvasBackgroundClick = (target) => {
    return target.tagName === 'svg' || target.id === 'grid-bg';
};

/**
 * Applies the action based on the selected tool when clicking on the canvas background.
 * @param {Object} params - Parameters for the action.
 * @param {string} params.selectedTool - Currently selected tool.
 * @param {Object} params.coords - Coordinates of the click.
 * @param {Function} params.addPlace - Function to add a place.
 * @param {Function} params.addTransition - Function to add a transition.
 */
export const handleCanvasClickAction = ({ selectedTool, coords, addPlace, addTransition }) => {
    if (selectedTool === 'place') {
        addPlace(coords.x, coords.y);
    } else if (selectedTool === 'transition') {
        addTransition(coords.x, coords.y);
    }
};

/**
 * Resets the canvas tool and cancels any active connections.
 * @param {Function} setSelectedTool - The function to set the selected tool.
 * @param {Function} cancelConnecting - The function to cancel any active connections.
 */
export const resetCanvasTool = (setSelectedTool, cancelConnecting) => {
    if (cancelConnecting) cancelConnecting();
    if (setSelectedTool) setSelectedTool('select');
};