import { useState } from 'react';

export const useCanvasInteractions = ({
    selectedTool,
    addPlace,
    addTransition,
    updateNodePosition,
    getCanvasCoordinates,
    startPanning,
}) => {
    const [draggingNodeId, setDraggingNodeId] = useState(null);

    const handleMouseDown = (e) => {
        if (e.button === 1 || e.shiftKey || selectedTool === 'pan') {
            startPanning(e.clientX, e.clientY);
            return;
        }

        if (e.target.tagName === 'svg' || e.target.id === 'grid-bg') {
            const coords = getCanvasCoordinates(e.clientX, e.clientY);
            if (selectedTool === 'place') addPlace(coords.x, coords.y);
            if (selectedTool === 'transition') addTransition(coords.x, coords.y);
        }
    };

    const handleMouseMove = (clientX, clientY) => {
        if (draggingNodeId) {
            const coords = getCanvasCoordinates(clientX, clientY);
            updateNodePosition(draggingNodeId, coords.x, coords.y);
        }
    };

    const startDraggingNode = (nodeId) => {
        setDraggingNodeId(nodeId);
    };

    const stopDraggingNode = () => {
        setDraggingNodeId(null);
    };

    return {
        draggingNodeId,
        handleMouseDown,
        handleMouseMove,
        startDraggingNode,
        stopDraggingNode,
    };
};