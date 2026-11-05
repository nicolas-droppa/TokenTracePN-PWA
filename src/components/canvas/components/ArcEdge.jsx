import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { THEMES } from '../../../theme';
import { ARC_CONFIG } from '../../../constants/layout';
import { useLongPress } from '../../../hooks/useLongPress';
import { edgePoint, controlPoint, curvePoint, normal } from '../../../utils/geometry';
import { ARC_MARKERS } from './ArcMarkers';

/**
 * ArcEdge component for rendering an arc connection between nodes with optional weight display.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.arc - The arc object data (contains id and weight).
 * @param {Object} props.sourceNode - The source node object (Place or Transition).
 * @param {Object} props.targetNode - The target node object (Place or Transition).
 * @returns {JSX.Element|null} SVG group element or null if nodes are missing.
 */
export const ArcEdge = ({ arc, sourceNode, targetNode, isCurved }) => {
  const activeThemeKey = useSettingsStore((state) => state.activeTheme);
  const theme = THEMES[activeThemeKey] || THEMES.dark;
  const select = usePetriStore((state) => state.select);
  const openInspector = usePetriStore((s) => s.openInspector);
  const isSelected = usePetriStore((state) => state.selectedId === arc.id);

  const longPress = useLongPress(() => openInspector(arc.id));

  if (!sourceNode || !targetNode) return null;

  const markerId = `arrow-${arc.id}`;

  const { midX, midY } = calculateMidpoint(sourceNode, targetNode);

  const strokeColor = isSelected ? theme.place.stroke : theme.arc.stroke;
  const strokeWidth = isSelected ? ARC_CONFIG.STROKE_WIDTH_PX + 1 : ARC_CONFIG.STROKE_WIDTH_PX;

  const handleClick = (e) => {
    e.stopPropagation();
    select(arc.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    openInspector(arc.id);
  };

  const control = controlPoint(sourceNode, targetNode, isCurved ? ARC_CONFIG.CURVE_OFFSET_PX : 0)

  const start = edgePoint(sourceNode, control);
  const end = edgePoint(targetNode, control);
  
  const Marker = ARC_MARKERS[arc.arcType];

  const pathData = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
  const curveMid = curvePoint(start, control, end);
  const unitVector = normal(sourceNode, targetNode);
  const labelPos = {
      x: curveMid.x + unitVector.x * ARC_CONFIG.WEIGHT_LABEL_OFFSET_PX,
      y: curveMid.y + unitVector.y * ARC_CONFIG.WEIGHT_LABEL_OFFSET_PX,
  };

  return (
    <g
      className="arc-edge"
      data-element-id={arc.id}
      data-element-type="arc"
    >
      <defs>
        {/* Arrowhead Marker */}
        <Marker id={markerId} color={strokeColor} backgroundColor={theme.bg} />
      </defs>

      {/* Hit Area (widens area) */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        pointerEvents="stroke"
        className="cursor-pointer"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        {...longPress}
      />

      {/* Connection Line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${markerId})`}
        pointerEvents="none"
      />

      {/* Arc Weight Label (renders only if weight > 1) */}
      {arc.weight > 1 && (
        <>
          <circle
            cx={labelPos.x}
            cy={labelPos.y}
            r="9"
            fill={theme.bg}
            pointerEvents="none"
          />
          <text
            x={labelPos.x}
            y={labelPos.y}
            dominantBaseline="middle"
            fill={strokeColor}
            fontSize="13"
            fontWeight="bold"
            textAnchor="middle"
            className="select-none"
            pointerEvents="none"
          >
            {arc.weight}
          </text>
        </>
      )}
    </g>
  );
};

// private

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
