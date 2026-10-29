import { CANVAS_CONFIG } from '../../../constants/layout';

/**
 * Gets the appropriate label step for the given zoom.
 * min step: CANVAS_CONFIG.RULER_STEPS[0]
 * min spacing: CANVAS_CONFIG.RULER_MINIMAL_SPACING_PX
 * @param {number} zoom - Current zoom level.
 * @returns {number} - Label step.
 */
export const getLabelStep = (zoom) => {
    const cellSize = CANVAS_CONFIG.GRID_SIZE_PX * zoom;
    const rulerSteps = CANVAS_CONFIG.RULER_STEPS;
    const minSpacing = CANVAS_CONFIG.RULER_MINIMAL_SPACING_PX;

    for (const step of rulerSteps) {
        if (step * cellSize >= minSpacing) return step;
    }

    return rulerSteps[rulerSteps.length - 1];
};
