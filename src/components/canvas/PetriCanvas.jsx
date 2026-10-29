import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { THEMES } from '../../theme';
import { CANVAS_CONFIG } from '../../constants/layout';
import { MOUSE_BUTTON } from '../../constants/tools';
import { getEnabledTransitions } from '../../core/petriEngine';
import { useCanvasPanZoom } from '../../hooks/canvas/useCanvasPanZoom';
import { useCanvasInteractions } from '../../hooks/canvas/useCanvasInteractions';
import { PlaceNode } from './components/PlaceNode';
import { TransitionNode } from './components/TransitionNode';
import { ArcEdge } from './components/ArcEdge';
import { cellToCanvas } from '../../utils/grid';
import { useElementSize } from '../../hooks/useElementSize';
import { CanvasRulers } from './components/CanvasRulers';

export const PetriCanvas = () => {
    // One selector per value - the canvas re-renders only when one of these changes
    const storedPlaces = usePetriStore((s) => s.places);
    const storedTransitions = usePetriStore((s) => s.transitions);
    const arcs = usePetriStore((s) => s.arcs);
    const selectedTool = usePetriStore((s) => s.selectedTool);
    const setSelectedTool = usePetriStore((s) => s.setSelectedTool);
    const cancelConnecting = usePetriStore((s) => s.cancelConnecting);
    const addPlace = usePetriStore((s) => s.addPlace);
    const addTransition = usePetriStore((s) => s.addTransition);
    const moveNode = usePetriStore((s) => s.moveNode);
    const select = usePetriStore((s) => s.select);
    const deleteElement = usePetriStore((s) => s.deleteElement);
    const mode = usePetriStore((s) => s.mode);
    const marking = usePetriStore((s) => s.marking);
    const fire = usePetriStore((s) => s.fire);

    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    const isRunning = mode === 'run';


    const {
        svgRef,
        zoom,
        pan,
        isPanning,
        getCanvasCoordinates,
        startPanning,
        updatePanning,
        stopPanning,
    } = useCanvasPanZoom(selectedTool);

    const { width, height } = useElementSize(svgRef);

    const {
        dragPosition,
        handleMouseDown,
        handleContextMenu,
        handleMouseMove,
        startDraggingNode,
        stopDraggingNode,
    } = useCanvasInteractions({ selectedTool, setSelectedTool, cancelConnecting, addPlace, addTransition, moveNode, getCanvasCoordinates, startPanning, select, deleteElement });

    // While dragging, the dragged node is drawn at its preview position (not yet in the store)
    const places = React.useMemo(
        () => toCanvasPositions(withDragPosition(storedPlaces, dragPosition)),
        [storedPlaces, dragPosition]
    );
    const transitions = React.useMemo(
        () => toCanvasPositions(withDragPosition(storedTransitions, dragPosition)),
        [storedTransitions, dragPosition]
    );

    const enabledIds = React.useMemo(
        () =>
            isRunning
                ? new Set(getEnabledTransitions({ transitions: storedTransitions, arcs }, marking))
                : null,
        [isRunning, storedTransitions, arcs, marking]
    );

    const handleNodeMouseDown = (nodeId) => (e) => {
        if (isRunning) return;
        if (e.button !== MOUSE_BUTTON.LEFT) return;
        e.stopPropagation();
        startDraggingNode(nodeId);
    };

    return (
        <svg
            ref={svgRef}
            style={{ width: '100%', height: '100%', display: 'block', backgroundColor: theme.bg }}
            className={`select-none overflow-hidden ${
                isPanning ? 'cursor-grabbing' : isRunning ? 'cursor-default' : 'cursor-crosshair'
            }`}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
            onMouseMove={(e) => {
                updatePanning(e.clientX, e.clientY);
                handleMouseMove(e.clientX, e.clientY);
            }}
            onMouseUp={() => {
                stopPanning();
                stopDraggingNode();
            }}
            onMouseLeave={() => {
                stopPanning();
                stopDraggingNode();
            }}
        >
            <defs>
                <pattern
                    id="grid"
                    width={CANVAS_CONFIG.GRID_SIZE_PX}
                    height={CANVAS_CONFIG.GRID_SIZE_PX}
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d={`M ${CANVAS_CONFIG.GRID_SIZE_PX} 0 L 0 0 0 ${CANVAS_CONFIG.GRID_SIZE_PX}`}
                        fill="none"
                        stroke={theme.grid}
                        strokeWidth="1"
                    />
                </pattern>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <rect
                    id="grid-bg"
                    data-canvas-background
                    x={-CANVAS_CONFIG.PANEL_BOUNDS_PX / 2}
                    y={-CANVAS_CONFIG.PANEL_BOUNDS_PX / 2}
                    width={CANVAS_CONFIG.PANEL_BOUNDS_PX}
                    height={CANVAS_CONFIG.PANEL_BOUNDS_PX}
                    fill="url(#grid)"
                />

                {arcs.map((arc) => {
                    const sourceNode =
                        places.find((p) => p.id === arc.source) ||
                        transitions.find((t) => t.id === arc.source);
                    const targetNode =
                        places.find((p) => p.id === arc.target) ||
                        transitions.find((t) => t.id === arc.target);
                    return (
                        <ArcEdge
                            key={arc.id}
                            arc={arc}
                            sourceNode={sourceNode}
                            targetNode={targetNode}
                        />
                    );
                })}

                {places.map((place) => (
                    <PlaceNode
                        key={place.id}
                        place={place}
                        tokens={isRunning ? marking?.[place.id] ?? 0 : place.tokens}
                        onMouseDown={handleNodeMouseDown(place.id)}
                    />
                ))}

                {transitions.map((trans) => (
                    <TransitionNode
                        key={trans.id}
                        transition={trans}
                        isRunning={isRunning}
                        isEnabled={enabledIds?.has(trans.id) ?? false}
                        onFire={() => fire(trans.id)}
                        onMouseDown={handleNodeMouseDown(trans.id)}
                    />
                ))}
            </g>
            <CanvasRulers width={width} height={height} pan={pan} zoom={zoom} />
        </svg>
    );
};

/** 
 * Returns the nodes with the dragged one moved to its preview position. 
 */
const withDragPosition = (nodes, dragPosition) =>
    dragPosition
        ? nodes.map((node) => (node.id === dragPosition.id ? { ...node, x: dragPosition.x, y: dragPosition.y } : node))
        : nodes;

/**
 * Converts the nodes to canvas coords from cell coords to canvas px coords.
 * @param {Array} nodes - The list of nodes.
 * @returns {Array} - The list of nodes with canvas coordinates.
 */
const toCanvasPositions = (nodes) => nodes.map((node) => ({ ...node, ...cellToCanvas(node) }));

