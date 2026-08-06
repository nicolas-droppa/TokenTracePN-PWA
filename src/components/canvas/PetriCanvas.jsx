import React, { useState, useRef } from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import { PlaceNode } from './components/PlaceNode';
import { TransitionNode } from './components/TransitionNode';
import { ArcEdge } from './components/ArcEdge';

export const PetriCanvas = () => {
  const { places, transitions, arcs, selectedTool, addPlace, addTransition, updateNodePosition } = usePetriStore();
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const svgRef = useRef(null);

  const getCanvasCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(0.2, prev * zoomFactor), 3));
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.shiftKey || selectedTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (e.target.tagName === 'svg' || e.target.id === 'grid-bg') {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      if (selectedTool === 'place') addPlace(coords.x, coords.y);
      if (selectedTool === 'transition') addTransition(coords.x, coords.y);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (draggingNodeId) {
      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      updateNodePosition(draggingNodeId, coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  return (
    <svg
      ref={svgRef}
      style={{ width: '100%', height: '100%', display: 'block', backgroundColor: theme.bg }}
      className={`select-none overflow-hidden ${
        isPanning ? 'cursor-grabbing' : 'cursor-crosshair'
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <defs>
        <pattern
          id="grid"
          width={40 * zoom}
          height={40 * zoom}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${pan.x}, ${pan.y})`}
        >
          <path
            d={`M ${40 * zoom} 0 L 0 0 0 ${40 * zoom}`}
            fill="none"
            stroke={theme.grid}
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect id="grid-bg" width="100%" height="100%" fill="url(#grid)" />

      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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
              e.stopPropagation();
              setDraggingNodeId(place.id);
            }}
          />
        ))}

        {transitions.map((trans) => (
          <TransitionNode
            key={trans.id}
            transition={trans}
            onMouseDown={(e) => {
              e.stopPropagation();
              setDraggingNodeId(trans.id);
            }}
          />
        ))}
      </g>
    </svg>
  );
};