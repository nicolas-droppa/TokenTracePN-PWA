import { CANVAS_CONFIG } from '../../../constants/layout';
import { canvasToCell } from '../../../utils/grid';

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
    return screenToCanvas(
        {
            x: clientX - rect.left,
            y: clientY - rect.top,
        },
        pan,
        zoom
    );
};

/**
 * Calculates the initial pan position based on height of the SVG element.
 * @param {number} height - The height of the SVG element.
 * @returns {Object} - Calculated initial pan position.
 */
export const calculateInitialPan = (height) => {
    return {
        x: CANVAS_CONFIG.ORIGIN_MARGIN_PX,
        y: height / 2 + CANVAS_CONFIG.ORIGIN_MARGIN_PX,
    };
};

/**
 * Converts canvas coordinates to screen coordinates.
 * @param {Object} point - Canvas coords.
 * @param {number} point.x - x-coord.
 * @param {number} point.y - y-coord.
 * @param {Object} pan - Current pan position.
 * @param {number} zoom - Current zoom level.
 * @returns {Object} - Screen coords (pixels in svg).
 */
export const canvasToScreen = ({ x, y }, pan, zoom) => {
    return {
        x: x * zoom + pan.x,
        y: y * zoom + pan.y,
    };
};

/**
 * Converts screen coordinates to canvas coordinates.
 * @param {Object} point - Screen coords.
 * @param {number} point.x - x-coord.
 * @param {number} point.y - y-coord.
 * @param {Object} pan - Current pan position.
 * @param {number} zoom - Current zoom level.
 * @returns {Object} - Canvas coords.
 */
export const screenToCanvas = ({ x, y }, pan, zoom) => {
    return {
        x: (x - pan.x) / zoom,
        y: (y - pan.y) / zoom,
    };
};

/**
 * Computes the logical grid cell bounds currently visible in the viewport.
 * Converts the screen pixel bounds to canvas coords, then to cell coords (only for cells without rulers).
 * @param {number} width - Viewport width in screen pixels.
 * @param {number} height - Viewport height in screen pixels.
 * @param {Object} pan - Current pan offset.
 * @param {number} zoom - Current zoom level.
 * @returns {{ minX: number, maxX: number, minY: number, maxY: number }}
 */
export const getVisibleCells = (width, height, pan, zoom) => {
    const rulerThickness = CANVAS_CONFIG.RULER_THICKNESS_PX;
    
    const topLeft = canvasToCell(screenToCanvas({ x: 0, y: 0 }, pan, zoom));
    const bottomRight = canvasToCell(screenToCanvas({ x: width - rulerThickness, y: height - rulerThickness }, pan, zoom));

    const minX = topLeft.x;
    const maxX = bottomRight.x;
    const minY = bottomRight.y;
    const maxY = topLeft.y;

    return { minX, maxX, minY, maxY };
};
