import { cellToCanvas } from '../../../utils/grid';
import { canvasToScreen } from './canvasPanZoom';
import { CANVAS_CONFIG, NODE_CONFIG } from '../../../constants/layout';

export const getAnchor = (element, { places = [], transitions = [] } = {}) => {
    if (!element) return null;

    if (typeof element.x === 'number' && typeof element.y === 'number') {
        return { x: element.x, y: element.y };
    }

    if (!element.source || !element.target) return null;

    const nodes = [...places, ...transitions];
    const sourceNode = nodes.find((node) => node.id === element.source);
    const targetNode = nodes.find((node) => node.id === element.target);

    if (!sourceNode || !targetNode) return null;

    return {
        x: (sourceNode.x + targetNode.x) / 2,
        y: (sourceNode.y + targetNode.y) / 2,
    };
};

const getNodeRadiusPx = (element) => {
    if (!element) return 0;
    if (element.type === 'arc') return 0;
    if (element.type === 'place') return NODE_CONFIG.PLACE_RADIUS_PX;
    if (element.type === 'transition') return NODE_CONFIG.TRANSITION_SIZE_PX / 2;
    return 0;
};

export const computePopupPosition = ({ element, anchor, popup, bounds, pan, zoom }) => {
    if (!anchor || !popup.width || !popup.height) return null;

    const canvasAnchor = cellToCanvas(anchor);
    const screenAnchor = canvasToScreen(canvasAnchor, pan, zoom);

    const anchorX = screenAnchor.x;
    const anchorY = screenAnchor.y;
    const popupWidth = popup.width;
    const popupHeight = popup.height;
    const nodeRadius = (getNodeRadiusPx(element) + CANVAS_CONFIG.POPUP_TO_ELEMENT_GAP_PX) * zoom;
    const border = CANVAS_CONFIG.POPUP_BORDER_PX;
    const usableMinX = border;
    const usableMaxX = Math.max(border, bounds.width - CANVAS_CONFIG.RULER_THICKNESS_PX - border);
    const usableMinY = border;
    const usableMaxY = Math.max(border, bounds.height - CANVAS_CONFIG.RULER_THICKNESS_PX - border);

    const candidates = [
        { side: 'up', left: anchorX - popupWidth / 2, top: anchorY - nodeRadius - popupHeight },
        { side: 'down', left: anchorX - popupWidth / 2, top: anchorY + nodeRadius },
    ];

    const fitsCandidate = (candidate) =>
        candidate.top >= usableMinY &&
        candidate.top + popupHeight <= usableMaxY &&
        ((candidate.side === 'up' && candidate.top + popupHeight <= anchorY - nodeRadius) ||
            (candidate.side === 'down' && candidate.top >= anchorY + nodeRadius));

    const spaceUp = anchorY - nodeRadius - usableMinY;
    const spaceDown = usableMaxY - (anchorY + nodeRadius);

    const chosen = candidates.find(fitsCandidate)
        ?? (spaceDown > spaceUp ? candidates[1] : candidates[0]);

    const left = Math.min(Math.max(chosen.left, usableMinX), Math.max(usableMinX, usableMaxX - popupWidth));
    const top = Math.min(Math.max(chosen.top, usableMinY), Math.max(usableMinY, usableMaxY - popupHeight));

    return { left, top, side: chosen.side };
};
