import { useState } from 'react';
import {
    shouldStartPanning,
    isCanvasBackgroundClick,
    handleCanvasClickAction,
    resetCanvasTool,
} from './helpers/canvasInteractions';

export const useCanvasInteractions = ({
    selectedTool,
    addPlace,
    addTransition,
    updateNodePosition,
    getCanvasCoordinates,
    startPanning,
    setSelectedTool,
    cancelConnecting,
}) => {
    const [draggingNodeId, setDraggingNodeId] = useState(null);

    const handleMouseDown = (e) => {
        // Pravé tlačidlo rieši handleContextMenu
        if (e.button === 2) return;

        // 1. Panning
        if (shouldStartPanning(e.button, e.shiftKey, selectedTool)) {
            startPanning(e.clientX, e.clientY);
            return;
        }

        // 2. Pridávanie elementov na pozadie
        if (isCanvasBackgroundClick(e.target)) {
            const coords = getCanvasCoordinates(e.clientX, e.clientY);
            handleCanvasClickAction({ selectedTool, coords, addPlace, addTransition });
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        resetCanvasTool(setSelectedTool, cancelConnecting);
    };

    const handleMouseMove = (clientX, clientY) => {
        if (draggingNodeId) {
            const coords = getCanvasCoordinates(clientX, clientY);
            updateNodePosition(draggingNodeId, coords.x, coords.y);
        }
    };

    return {
        draggingNodeId,
        handleMouseDown,
        handleContextMenu,
        handleMouseMove,
        startDraggingNode: setDraggingNodeId,
        stopDraggingNode: () => setDraggingNodeId(null),
    };
};