import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { THEMES } from '../../../theme';

/**
 * PlaceNode component for rendering a place.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.place - The place object data.
 * @param {Function} props.onMouseDown - Mouse down handler for drag start.
 * @returns {JSX.Element} SVG group representing the Place.
 */
export const PlaceNode = ({ place, onMouseDown }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  return (
    <g
      transform={`translate(${place.x}, ${place.y})`}
      className="cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
    >
      {/* Shape */}
      <circle
        r={theme.place.radius}
        fill={theme.place.fill}
        stroke={theme.place.stroke}
        strokeWidth={theme.place.strokeWidth}
      />

      {/* Tokens */}
      {place.tokens > 0 && (
        <text
          textAnchor="middle"
          dy="5"
          fill={theme.text.token}
          className="font-bold text-sm select-none"
        >
          {place.tokens}
        </text>
      )}

      {/* Label */}
      <text
        textAnchor="middle"
        y={theme.place.radius + 17}
        fill={theme.text.label}
        className="text-xs font-medium select-none"
      >
        {place.label}
      </text>
    </g>
  );
};