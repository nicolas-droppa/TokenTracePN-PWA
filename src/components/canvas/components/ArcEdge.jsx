import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { THEMES } from '../../../theme';

/**
 * ArcEdge component for rendering an arc connection between nodes with optional weight display.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.arc - The arc object data (contains id and weight).
 * @param {Object} props.sourceNode - The source node object (Place or Transition).
 * @param {Object} props.targetNode - The target node object (Place or Transition).
 * @returns {JSX.Element|null} SVG group element or null if nodes are missing.
 */
export const ArcEdge = ({ arc, sourceNode, targetNode }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;
  const setSelectedElement = usePetriStore((state) => state.setSelectedElement);

  if (!sourceNode || !targetNode) return null;

  const markerId = `arrow-${arc.id}`;

  const { midX, midY } = calculateMidpoint(sourceNode, targetNode);

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElement(arc);
  };

  return (
    <g
      className="arc-edge"
      data-element-id={arc.id}
      data-element-type="arc"
    >
      <defs>
        {/* Arrowhead Marker */}
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="28"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.arc.stroke} />
        </marker>
      </defs>

      {/* Hit Area (widens area) */}
      <line
        x1={sourceNode.x}
        y1={sourceNode.y}
        x2={targetNode.x}
        y2={targetNode.y}
        stroke="transparent"
        strokeWidth={14}
        pointerEvents="stroke"
        className="cursor-pointer"
        onClick={handleClick}
      />

      {/* Connection Line */}
      <line
        x1={sourceNode.x}
        y1={sourceNode.y}
        x2={targetNode.x}
        y2={targetNode.y}
        stroke={theme.arc.stroke}
        strokeWidth={theme.arc.strokeWidth}
        markerEnd={`url(#${markerId})`}
        pointerEvents="none"
      />

      {/* Arc Weight Label (renders only if weight > 1) */}
      {arc.weight > 1 && (
        <text
          x={midX}
          y={midY - 6}
          fill={theme.arc.stroke}
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          className="select-none"
          pointerEvents="none"
        >
          {arc.weight}
        </text>
      )}
    </g>
  );
};

// PRIVATE

/**
 * Calculates the center midpoint between source and target nodes.
 *
 * @param {Object} source - Source node coordinates {x, y}.
 * @param {Object} target - Target node coordinates {x, y}.
 * @returns {{ midX: number, midY: number }}
 */
const calculateMidpoint = (source, target) => {
  return {
    midX: (source.x + target.x) / 2,
    midY: (source.y + target.y) / 2,
  };
};