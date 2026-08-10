import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { useNodeConnecting } from '../../../hooks/canvas/useNodeConnecting';
import { THEMES } from '../../../theme';

export const PlaceNode = ({ place, onMouseDown }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const { isConnectingSource, isInvalidTarget, containerProps } = useNodeConnecting(place, onMouseDown);

  const strokeColor = isInvalidTarget ? theme.disabled.stroke : theme.place.stroke;
  const labelColor = isInvalidTarget ? theme.disabled.text : theme.text.label;

  return (
    <g transform={`translate(${place.x}, ${place.y})`} {...containerProps}>
      {/* Connecting Indicator */}
      {isConnectingSource && (
        <circle
          r={theme.place.radius + 6}
          fill="none"
          stroke={theme.arc.stroke}
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-spin-slow"
        />
      )}

      {/* Shape */}
      <circle
        r={theme.place.radius}
        fill={theme.place.fill}
        stroke={strokeColor}
        strokeWidth={theme.place.strokeWidth}
      />

      {/* Tokens */}
      {place.tokens > 0 && (
        <text
          textAnchor="middle"
          dy="5"
          fill={isInvalidTarget ? '#4b5563' : theme.text.token}
          className="font-bold text-sm select-none"
        >
          {place.tokens}
        </text>
      )}

      {/* Label */}
      <text
        textAnchor="middle"
        y={theme.place.radius + 17}
        fill={labelColor}
        className="text-xs font-medium select-none"
      >
        {place.label}
      </text>
    </g>
  );
};