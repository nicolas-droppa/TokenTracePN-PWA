import { NODE_CONFIG } from '../constants/layout';

export const edgePoint = (node, toward) => {
    const dx = toward.x - node.x;
    const dy = toward.y - node.y;

    if (dx === 0 && dy === 0) return { x: node.x, y: node.y };

    let t = 0;

    if (node.type === 'place') t = NODE_CONFIG.PLACE_RADIUS_PX / Math.hypot(dx, dy);

    else if (node.type === 'transition') t = ( NODE_CONFIG.TRANSITION_SIZE_PX / 2 ) / Math.max(Math.abs(dx), Math.abs(dy));

    return { x: node.x + t * dx, y: node.y + t * dy };
};

export const controlPoint = (from, to, offset) => {
    const unitVector = normal(from, to);

    return {
        x: (from.x + to.x) / 2 + unitVector.x * offset,
        y: (from.y + to.y) / 2 + unitVector.y * offset,
    };
};

/**
 * Unit vector in direction (from -> to)
 */
export const normal = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length === 0) return { x: 0, y: 0 };
    return { x: -dy / length, y: dx / length };
};

/** 
 * Mid point on quadratic line
 */
export const curvePoint = (start, control, end) => ({
    x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x,
    y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y,
});