import { useState } from 'react';
import { TOOLS, MOUSE_BUTTON, CANVAS_ACTION } from '../../constants/tools';
import {
    shouldStartPanning,
    isCanvasBackgroundClick,
    getElementFromEvent,
    resolveBackgroundClickAction,
    resolveContextMenuAction,
} from './helpers/canvasInteractions';

/**
 * Mouse handling on the canvas: adding nodes, selection, deleting and dragging nodes.
 */
export const useCanvasInteractions = ({
    selectedTool,
    addPlace,
    addTransition,
    moveNode,
    getCanvasCoordinates,
    startPanning,
    setSelectedTool,
    cancelConnecting,
    select,
    deleteElement,
}) => {
    const [dragPosition, setDragPosition] = useState(null);
    const [draggingNodeId, setDraggingNodeId] = useState(null);

    const handleMouseDown = (e) => {
        if (e.button === MOUSE_BUTTON.RIGHT) return;

        if (shouldStartPanning(e.button, e.shiftKey, selectedTool)) {
            startPanning(e.clientX, e.clientY);
            return;
        }

        if (!isCanvasBackgroundClick(e.target)) return;

        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
        const action = resolveBackgroundClickAction(selectedTool);

        switch (action.type) {
            case CANVAS_ACTION.ADD_PLACE:
                addPlace(x, y);
                break;
            case CANVAS_ACTION.ADD_TRANSITION:
                addTransition(x, y);
                break;
            case CANVAS_ACTION.CLEAR_SELECTION:
                select(null);
                break;
            default:
                break;
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();

        const element = getElementFromEvent(e.target);
        const action = resolveContextMenuAction(selectedTool, element);

        switch (action.type) {
            case CANVAS_ACTION.RESET_TOOL:
                cancelConnecting?.();
                setSelectedTool(TOOLS.SELECT);
                break;
            case CANVAS_ACTION.DELETE_ELEMENT:
                deleteElement(action.id);
                break;
            default:
                break;
        }
    };

    const startDraggingNode = (nodeId) => {
        if (selectedTool !== TOOLS.SELECT) return;
        setDraggingNodeId(nodeId);
    };

    const handleMouseMove = (clientX, clientY) => {
        if (!draggingNodeId) return;
        const { x, y } = getCanvasCoordinates(clientX, clientY);
        setDragPosition({ id: draggingNodeId, x, y });
    };

    const stopDraggingNode = () => {
        if (dragPosition) moveNode(dragPosition.id, dragPosition.x, dragPosition.y);
        setDraggingNodeId(null);
        setDragPosition(null);
    };

    return {
        dragPosition,
        handleMouseDown,
        handleContextMenu,
        handleMouseMove,
        startDraggingNode,
        stopDraggingNode,
    };
};
