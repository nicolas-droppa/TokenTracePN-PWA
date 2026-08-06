import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { THEMES } from '../../../theme';

/**
 * ArcEdge component for rendering an arc connection.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.arc - The arc object data.
 * @param {Object} props.sourceNode - The source node object (Place or Transition).
 * @param {Object} props.targetNode - The target node object (Place or Transition).
 * @returns {JSX.Element|null} SVG group element or null if nodes missing.
 */
export const ArcEdge = ({ arc, sourceNode, targetNode }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  if (!sourceNode || !targetNode) return null;

  const markerId = `arrow-${arc.id}`;

  return (
    <g>
      <defs>
        {/* Arrowhead */}
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

      <line
        x1={sourceNode.x}
        y1={sourceNode.y}
        x2={targetNode.x}
        y2={targetNode.y}
        stroke={theme.arc.stroke}
        strokeWidth={theme.arc.strokeWidth}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
};