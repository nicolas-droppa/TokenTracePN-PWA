import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import { CANVAS_CONFIG } from '../../constants/layout';
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
        updateNodePosition 
    } = usePetriStore();

    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

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
    } = useCanvasInteractions({ selectedTool, setSelectedTool, cancelConnecting, addPlace, addTransition, updateNodePosition, getCanvasCoordinates, startPanning });

    return (
        <svg
            ref={svgRef}
            style={{ width: '100%', height: '100%', display: 'block', backgroundColor: theme.bg }}
            className={`select-none overflow-hidden ${
                isPanning ? 'cursor-grabbing' : 'cursor-crosshair'
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
                    x={-CANVAS_CONFIG.PANEL_BOUNDS_PX / 2} 
                    y={-CANVAS_CONFIG.PANEL_BOUNDS_PX / 2} 
                    width={CANVAS_CONFIG.PANEL_BOUNDS_PX} 
                    height={CANVAS_CONFIG.PANEL_BOUNDS_PX} 
                    fill="url(#grid)" 
                />

                {arcs.map((arc) => {
                    const sourceNode = places.find((p) => p.id === arc.source) || transitions.find((t) => t.id === arc.source);
                    const targetNode = places.find((p) => p.id === arc.target) || transitions.find((t) => t.id === arc.target);
                    return <ArcEdge key={arc.id} arc={arc} sourceNode={sourceNode} targetNode={targetNode} />;
                })}

                {places.map((place) => (
                    <PlaceNode
                        key={place.id}
                        place={place}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                e.stopPropagation();
                                startDraggingNode(place.id);
                            }
                        }}
                    />
                ))}

                {transitions.map((trans) => (
                    <TransitionNode
                        key={trans.id}
                        transition={trans}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                e.stopPropagation();
                                startDraggingNode(trans.id);
                            }
                        }}
                    />
                ))}
            </g>
        </svg>
    );
};