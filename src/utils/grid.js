import { CANVAS_CONFIG } from '../constants/layout';

const cellCenterOffset = CANVAS_CONFIG.GRID_SIZE_PX / 2;

/**
 * Converts a grid cell position to canvas coords.
 * counted upward from the origin.
 */
export function cellToCanvas({ x, y }) {
    return { x: x * CANVAS_CONFIG.GRID_SIZE_PX + cellCenterOffset, y: -(y * CANVAS_CONFIG.GRID_SIZE_PX + cellCenterOffset) };
}

/**
 * Converts canvas coords back to logical cell grid.
 * Y coord is flipped before flooring so values just above the
 * origin map to the correct cell, e.g. y = -1 -> cell y = 0.
 */
export function canvasToCell({ x, y }) {
    return { x: Math.floor(x / CANVAS_CONFIG.GRID_SIZE_PX), y: Math.floor((-y) / CANVAS_CONFIG.GRID_SIZE_PX)};
}