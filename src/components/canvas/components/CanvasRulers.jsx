import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { CANVAS_CONFIG } from '../../../constants/layout';
import { range } from '../../../utils/array';
import { getVisibleCells, canvasToScreen } from '../../../hooks/canvas/helpers/canvasPanZoom';
import { cellToCanvas } from '../../../utils/grid';
import { getLabelStep } from '../../../hooks/canvas/helpers/canvasRulers';

const rulerThickness = CANVAS_CONFIG.RULER_THICKNESS_PX;
const fontSize = 11;

export const CanvasRulers = ({ width = 0, height = 0, pan, zoom }) => {
    const theme = useTheme();

    if (width === 0 || height === 0) return null;

    const { minX, maxX, minY, maxY } = getVisibleCells(width, height, pan, zoom);
    const step = getLabelStep(zoom);
    const columns = range(minX, maxX).filter((col) => col % step === 0);
    const rows = range(minY, maxY).filter((row) => row % step === 0);

    return (
        <g>
            <Ruler orientation="horizontal" height={height} width={width} theme={theme}/>
            <Ruler orientation="vertical" height={height} width={width} theme={theme}/>

            {columns.map((col) => (
                <text
                    key={`col-${col}`}
                    x={ columnScreenX(col, pan, zoom) }
                    y={ height - rulerThickness / 2 }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={ fontSize }
                    fill={ col === 0 ? theme.rulers.accent : col % 5 === 0 ? theme.rulers.text : theme.rulers.tick }
                >
                    {col}
                </text>
            ))}

            {rows.map((row) => (
                <text
                    key={`row-${row}`}
                    x={ width - rulerThickness / 2 }
                    y={ rowScreenY(row, pan, zoom) }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={ fontSize }
                    fill={ row === 0 ? theme.rulers.accent : row % 5 === 0 ? theme.rulers.text : theme.rulers.tick }
                >
                    {row}
                </text>
            ))}

            <RulerConnector height={height} width={width} theme={theme}/>
        </g>
    );
};

const Ruler = ({ orientation, height, width, theme }) => {
    const isHorizontal = orientation === 'horizontal';

    return (
        <rect
            x={ isHorizontal ? 0 : width - rulerThickness }
            y={ isHorizontal ? height - rulerThickness : 0 }
            height={ isHorizontal ? rulerThickness : height - rulerThickness }
            width={ isHorizontal ? width - rulerThickness : rulerThickness }
            fill={`${theme.rulers.bg}e6`}
        />
    );
};

const RulerConnector = ({ height, width, theme }) => {
    return (
        <rect
            x={ width - rulerThickness }
            y={ height - rulerThickness }
            height={ rulerThickness }
            width={ rulerThickness }
            fill={`${theme.rulers.bg}e6`}
        />
    );
};

const columnScreenX = (col, pan, zoom) => {
    return canvasToScreen(cellToCanvas({ x: col, y: 0 }), pan, zoom).x
}

const rowScreenY = (row, pan, zoom) => {
    return canvasToScreen(cellToCanvas({ x: 0, y: row }), pan, zoom).y
}