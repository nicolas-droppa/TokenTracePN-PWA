import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { THEMES } from '../../../theme';

/**
 * TransitionNode component for rendering a transition.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.transition - The transition object data.
 * @param {Function} props.onMouseDown - Mouse down handler for drag start.
 * @returns {JSX.Element} SVG group representing the Transition.
 */
export const TransitionNode = ({ transition, onMouseDown }) => {
  const activeThemeKey = usePetriStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const width = theme.transition.width;
  const height = theme.transition.height;

  return (
    <g
      transform={`translate(${transition.x}, ${transition.y})`}
      className="cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={theme.transition.fill}
        stroke={theme.transition.stroke}
        strokeWidth={theme.transition.strokeWidth}
        rx={theme.transition.rx}
      />
      <text
        textAnchor="middle"
        y={height / 2 + 18}
        fill={theme.text.label}
        className="text-xs font-medium select-none"
      >
        {transition.label}
      </text>
    </g>
  );
};