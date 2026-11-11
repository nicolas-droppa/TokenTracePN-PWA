import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../../store/useSettingsStore';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { toLatex, toArray } from '../../../core/analysis/matrixExport';
import { notify } from '../../notifications/notify.jsx';
import { NOTIFY_STATUS, NOTIFY_TOPIC } from '../../../constants/notifications';
import { MATRIX_COPY_FORMATS } from '../../../constants/matrices';
import { MenuItem } from '../../ui/MenuItem';

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

    const { copy } = useCopyToClipboard();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    const handleSelect = async (format) => {
        const content = format === 'array' ? toArray(matrix) : toLatex(matrix, format);
        const formatLabel = MATRIX_COPY_FORMATS.find((item) => item.id === format)?.label ?? format;

        const success = await copy(content);

        if (success) {
            notify({
                status: NOTIFY_STATUS.SUCCESS,
                topic: NOTIFY_TOPIC.COPY,
                title: 'Matrix copied',
                message: `Copied as ${formatLabel}.`,
            });
        } else {
            notify({
                status: NOTIFY_STATUS.ERROR,
                topic: NOTIFY_TOPIC.COPY,
                title: 'Copy failed',
                message: 'Failed to copy matrix',
            });
        }

        setIsOpen(false);
    };

    return (
        <section
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md"
            style={{ backgroundColor: theme.sidebar.bg }}
        >
            <div className="flex items-center justify-between">
                <h3
                    className="px-2.5 py-2 text-xs font-bold uppercase tracking-wide"
                    style={{ color: theme.text.label }}
                >
                    {title}
                </h3>
                
                <div className="relative px-2" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer hover:bg-white/10"
                        style={{ color: theme.text.label }}
                    >
                        <span>Copy</span>
                    </button>

                    {isOpen && (
                        <div
                            className="absolute right-2 mt-1 min-w-[170px] rounded-md border shadow-lg z-50 py-1 text-[11px]"
                            style={{
                                backgroundColor: theme.sidebar.bg,
                                borderColor: theme.sidebar.border,
                                color: theme.text.label,
                            }}
                        >
                            {MATRIX_COPY_FORMATS.map(({ id, symbol, label }) => (
                                <MenuItem
                                    key={id}
                                    label={label}
                                    symbol={symbol}
                                    onSelect={() => handleSelect(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
    const hasEdge = Number.isFinite(value);
    const isZero = value === 0;
    const displayValue = hasEdge ? value : '∞';

    return (
        <td
            className={`${CELL} font-mono`}
            style={{
                color: hasEdge ? (isZero ? theme.disabled.text : theme.text.code) : theme.disabled.text,
                backgroundColor: hasEdge ? (isZero ? 'transparent' : `${theme.text.label}14`) : 'transparent',
            }}
        >
            {displayValue}
        </td>
    );
};