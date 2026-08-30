import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import { CANVAS_CONFIG } from '../../constants/layout';
import { MOUSE_BUTTON } from '../../constants/tools';
import { getEnabledTransitions } from '../../core/petriEngine';
import { useCanvasPanZoom } from '../../hooks/canvas/useCanvasPanZoom';
import { useCanvasInteractions } from '../../hooks/canvas/useCanvasInteractions';
import { PlaceNode } from './components/PlaceNode';
import { TransitionNode } from './components/TransitionNode';
import { ArcEdge } from './components/ArcEdge';

export const PetriCanvas = () => {
    const {
        places,
        transitions,
        arcs,
        selectedTool,
        setSelectedTool,
        cancelConnecting,
        addPlace,
        addTransition,
        updateNodePosition,
        setSelectedElement,
        deleteElement,
        mode,
        marking,
        fire,
    } = usePetriStore();

    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    const isRunning = mode === 'run';

    const enabledIds = React.useMemo(
        () =>
            isRunning
                ? new Set(getEnabledTransitions({ transitions, arcs }, marking))
                : null,
        [isRunning, transitions, arcs, marking]
    );

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

    const {
        handleMouseDown,
        handleContextMenu,
        handleMouseMove,
        startDraggingNode,
        stopDraggingNode,
    } = useCanvasInteractions({ mode, selectedTool, setSelectedTool, cancelConnecting, addPlace, addTransition, updateNodePosition, getCanvasCoordinates, startPanning, setSelectedElement, deleteElement });

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
                        tokens={isRunning ? marking?.[place.id] ?? 0 : place.initialTokens}
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
        </svg>
    );
};