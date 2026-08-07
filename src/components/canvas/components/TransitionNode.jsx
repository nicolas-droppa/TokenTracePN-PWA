import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { useNodeConnecting } from '../../../hooks/useNodeConnecting';
import { THEMES } from '../../../theme';

export const TransitionNode = ({ transition, onMouseDown }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const { isConnectingSource, isInvalidTarget, containerProps } = useNodeConnecting(transition, onMouseDown);

  const { width, height } = theme.transition;

  const strokeColor = isInvalidTarget ? theme.disabled.stroke : theme.transition.stroke;
  const labelColor = isInvalidTarget ? theme.disabled.text : theme.text.label;
  
  return (
    <g transform={`translate(${transition.x}, ${transition.y})`} {...containerProps}>
      {/* Connecting Indicator */}
      {isConnectingSource && (
        <rect
          x={-width / 2 - 6}
          y={-height / 2 - 6}
          width={width + 12}
          height={height + 12}
          fill="none"
          stroke={theme.arc.stroke}
          strokeWidth="2"
          strokeDasharray="4 4"
          rx={theme.transition.rx + 2}
        />
      )}

      {/* Shape */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={theme.transition.fill}
        stroke={strokeColor}
        strokeWidth={theme.transition.strokeWidth}
        rx={theme.transition.rx}
      />

      {/* Label */}
      <text
        textAnchor="middle"
        y={height / 2 + 18}
        fill={labelColor}
        className="text-xs font-medium select-none"
      >
        {transition.label}
      </text>
    </g>
  );
};