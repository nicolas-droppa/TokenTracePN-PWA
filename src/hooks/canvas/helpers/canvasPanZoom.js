import { CANVAS_CONFIG } from '../../../constants/layout';

/**
 * Calculates the target zoom level based on the current zoom and the wheel delta.
 * @param {number} currentZoom - The current zoom level.
 * @param {number} deltaY - The wheel delta (positive for zoom out, negative for zoom in).
 * @returns {number} - Calculated target zoom level.
 */
export const calculateTargetZoom = (currentZoom, deltaY) => {
    const direction = deltaY < 0 ? 1 : -1;
    
    return direction > 0 
        ? Math.min(currentZoom * CANVAS_CONFIG.ZOOM.FACTOR, CANVAS_CONFIG.ZOOM.MAX) 
        : Math.max(currentZoom / CANVAS_CONFIG.ZOOM.FACTOR, CANVAS_CONFIG.ZOOM.MIN);
};

/**
 * Calculates the new pan position so that the point under the mouse remains in the same place after a zoom change.
 * @param {Object} params - Parameters for the calculation.
 * @param {number} params.mouseX - X-coordinate of mouse position.
 * @param {number} params.mouseY - Y-coordinate of mouse position.
 * @param {Object} params.currentPan - Current pan position.
 * @param {number} params.currentZoom - Current zoom level.
 * @param {number} params.targetZoom - Target zoom level.
 * @returns {Object} - Calculated new pan position.
 */
export const calculateZoomPan = ({ mouseX, mouseY, currentPan, currentZoom, targetZoom }) => {
    const canvasX = (mouseX - currentPan.x) / currentZoom;
    const canvasY = (mouseY - currentPan.y) / currentZoom;

    return {
        x: mouseX - canvasX * targetZoom,
        y: mouseY - canvasY * targetZoom,
    };
};

/**
 * Calculates the canvas coordinates based on the screen coordinates.
 * @param {number} clientX - The x-coordinate of the mouse position on the screen.
 * @param {number} clientY - The y-coordinate of the mouse position on the screen.
 * @param {HTMLElement} svgElement - The SVG element.
 * @param {Object} pan - Current pan position.
 * @param {number} zoom - Current zoom level.
 * @returns {Object} - Calculated canvas coords.
 */
export const screenToCanvasCoordinates = (clientX, clientY, svgElement, pan, zoom) => {
    if (!svgElement) return { x: 0, y: 0 };
    const rect = svgElement.getBoundingClientRect();
    
    return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
    };
};