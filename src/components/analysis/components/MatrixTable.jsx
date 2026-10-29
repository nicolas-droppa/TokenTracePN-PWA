import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';

const CELL = 'min-w-[44px] whitespace-nowrap px-2.5 py-2 text-center';
const STICKY_TOP = 'sticky top-0 z-10';
const STICKY_LEFT = 'sticky left-0 z-10';
const STICKY_CORNER = 'sticky left-0 top-0 z-20';

/**
 * Matrix with sticky headers
 * @param {Object} props
 * @param {string} props.title
 * @param {{ id: string, label: string }[]} props.rows - Row headers, in matrix order.
 * @param {{ id: string, label: string }[]} props.columns - Column headers, in matrix order.
 * @param {number[][]} props.matrix
 * @param {{ ref: Function, onScroll: Function }} [props.scroll] - Optional synced scrolling.
 */
export const MatrixTable = ({ title, rows, columns, matrix, scroll }) => {
    const theme = useTheme();
    const headerStyle = { backgroundColor: theme.sidebar.bg, color: theme.text.label };

    return (
        <section
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md"
            style={{ backgroundColor: theme.sidebar.bg }}
        >
            <h3
                className="px-2.5 py-2 text-xs font-bold uppercase tracking-wide"
                style={{ color: theme.text.label }}
            >
                {title}
            </h3>

            <div ref={scroll?.ref} onScroll={scroll?.onScroll} className="min-h-0 flex-1 overflow-auto">
                <table className="min-w-max border-collapse text-xs" style={{ color: theme.text.code }}>
                    <thead>
                        <tr>
                            <th className={`${CELL} ${STICKY_CORNER}`} style={headerStyle} />
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    scope="col"
                                    title={column.id}
                                    className={`${CELL} ${STICKY_TOP}`}
                                    style={headerStyle}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {matrix.map((values, rowIndex) => {
                            const row = rows[rowIndex];

                            return (
                                <tr key={row.id}>
                                    <th
                                        scope="row"
                                        title={row.id}
                                        className={`${CELL} ${STICKY_LEFT} text-left`}
                                        style={headerStyle}
                                    >
                                        {row.label}
                                    </th>
                                    {values.map((value, columnIndex) => (
                                        <ValueCell key={columns[columnIndex].id} value={value} theme={theme} />
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

/**
 * A single matrix value.
 */
const ValueCell = ({ value, theme }) => {
    const isZero = value === 0;

    return (
        <td
            className={`${CELL} font-mono`}
            style={{
                color: isZero ? theme.disabled.text : theme.text.code,
                backgroundColor: isZero ? 'transparent' : `${theme.text.label}14`,
            }}
        >
            {value}
        </td>
    );
};