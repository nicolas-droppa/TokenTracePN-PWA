import React from 'react';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useNodeConnecting } from '../../../hooks/canvas/useNodeConnecting';
import { displayName } from '../../../core/models';
import { THEMES } from '../../../theme';
import { NODE_CONFIG } from '../../../constants/layout';

/**
 * Renders a single place.
 *
 * @param {Object} props
 * @param {Object} props.place - The place object.
 * @param {number} props.tokens - Token count to display.
 * @param {Function} props.onMouseDown - Drag start handler.
 */
export const PlaceNode = ({ place, tokens = 0, onMouseDown }) => {
  const activeThemeKey = useSettingsStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const { isConnectingSource, isInvalidTarget, containerProps } = useNodeConnecting(place, onMouseDown);

  const strokeColor = isInvalidTarget ? theme.disabled.stroke : theme.place.stroke;
  const labelColor = isInvalidTarget ? theme.disabled.text : theme.text.label;

  return (
    <g transform={`translate(${place.x}, ${place.y})`} {...containerProps}>
      {/* Connecting Indicator */}
      {isConnectingSource && (
        <circle
          r={NODE_CONFIG.PLACE_RADIUS_PX + 6}
          fill="none"
          stroke={theme.arc.stroke}
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-spin-slow"
        />
      )}

      {/* Shape */}
      <circle
        r={NODE_CONFIG.PLACE_RADIUS_PX}
        fill={theme.place.fill}
        stroke={strokeColor}
        strokeWidth={NODE_CONFIG.STROKE_WIDTH_PX}
      />

      {/* Tokens */}
      {tokens > 0 && (
        <text
          textAnchor="middle"
          dy="5"
          fill={isInvalidTarget ? '#4b5563' : theme.text.token}
          className="font-bold text-sm select-none"
          pointerEvents="none"
        >
          {tokens}
        </text>
      )}

      {/* Label */}
      <text
        textAnchor="middle"
        y={NODE_CONFIG.PLACE_RADIUS_PX + 17}
        fill={labelColor}
        className="text-xs font-medium select-none"
        pointerEvents="none"
      >
        {displayName(place)}
      </text>
    </g>
  );
};
