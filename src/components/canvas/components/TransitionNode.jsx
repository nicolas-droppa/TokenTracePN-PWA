import React from 'react';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useNodeConnecting } from '../../../hooks/canvas/useNodeConnecting';
import { THEMES } from '../../../theme';

/**
 * Renders a single transition. In run mode an enabled transition is filled
 * and clickable; firing it flashes briefly as feedback.
 *
 * @param {Object} props
 * @param {Object} props.transition - The transition object.
 * @param {boolean} props.isRunning - Whether simulation is active.
 * @param {boolean} props.isEnabled - Whether transition can fire.
 * @param {Function} props.onFire - Fires the transition.
 * @param {Function} props.onMouseDown - Drag start handler.
 */
export const TransitionNode = ({
  transition,
  isRunning = false,
  isEnabled = false,
  onFire,
  onMouseDown,
}) => {
  const activeThemeKey = useSettingsStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;

  const [isFlashing, setIsFlashing] = React.useState(false);

  const { isConnectingSource, isInvalidTarget, containerProps } = useNodeConnecting(transition, onMouseDown);

  const { width, height } = theme.transition;

  const isFireable = isRunning && isEnabled;
  const isDisabled = isInvalidTarget || (isRunning && !isEnabled);

  const strokeColor = isDisabled ? theme.disabled.stroke : theme.transition.stroke;
  const labelColor = isDisabled ? theme.disabled.text : theme.text.label;

  const handleClick = (e) => {
    if (!isRunning) {
      containerProps.onClick(e);
      return;
    }
    e.stopPropagation();
    if (!isEnabled) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 140);
    onFire?.();
  };

  const cursorClass = isRunning
    ? isEnabled
      ? 'cursor-pointer'
      : 'cursor-not-allowed'
    : undefined;

  return (
    <g
      transform={`translate(${transition.x}, ${transition.y})`}
      {...containerProps}
      onClick={handleClick}
      className={cursorClass ?? containerProps.className}
    >
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
          pointerEvents="none"
        />
      )}

      {/* Shape */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={theme.transition.fill}
        stroke={isFlashing ? theme.text.token : strokeColor}
        strokeWidth={theme.transition.strokeWidth}
        rx={theme.transition.rx}
        transform={`scale(${isFlashing ? 0.9 : 1})`}
        style={{
          transformOrigin: 'center',
          transformBox: 'fill-box',
          transition: isFlashing
            ? 'transform 100ms ease-out'
            : 'transform 100ms ease-out, stroke 120ms ease-out',
        }}
      />

      {/* Label */}
      <text
        textAnchor="middle"
        y={height / 2 + 18}
        fill={labelColor}
        className="text-xs font-medium select-none"
        pointerEvents="none"
      >
        {transition.label}
      </text>
    </g>
  );
};