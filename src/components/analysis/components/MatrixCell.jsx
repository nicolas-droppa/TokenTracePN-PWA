import React, { useRef, useState } from 'react';
import { useDraft } from '../../../hooks/useDraft';
import { MATRIX_ARROW_STEPS } from '../../../constants/interaction';
import { CELL, toDraft, cellValue, parseCellDraft, focusCell } from '../helpers/matrixCell';

/**
 * One matrix cell: static value, reset checkbox or editable input.
 * @param {Object} props
 * @param {number} props.value - Matrix value, Infinity for no inhibitor.
 * @param {boolean} props.editable
 * @param {boolean} props.isReset - Reset matrix uses a checkbox.
 * @param {number} props.rowIndex
 * @param {number} props.columnIndex
 * @param {(weight: number) => void} props.onCommit
 * @param {Object} props.theme
 */
export const MatrixCell = ({ value, editable, isReset, rowIndex, columnIndex, onCommit, theme }) => {
    if (!editable) return <StaticCell value={value} theme={theme} />;
    if (isReset) return <ResetCell value={value} onCommit={onCommit} theme={theme} />;

    return (
        <EditableCell
            value={value}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            onCommit={onCommit}
            theme={theme}
        />
    );
};

const StaticCell = ({ value, theme }) => {
    const isEmpty = cellValue(value) === 0;

    return (
        <td
            className={`${CELL} font-mono`}
            style={{
                color: isEmpty ? theme.disabled.text : theme.text.code,
                backgroundColor: isEmpty ? 'transparent' : `${theme.text.label}14`,
            }}
        >
            {toDraft(value)}
        </td>
    );
};

const ResetCell = ({ value, onCommit, theme }) => (
    <td className={`${CELL} font-mono`} style={{ backgroundColor: `${theme.text.label}14` }}>
        <label className="flex items-center justify-center">
            <input
                type="checkbox"
                checked={value === 1}
                onChange={(event) => onCommit(event.target.checked ? 1 : 0)}
                className="m-0 block size-3.5 cursor-pointer"
                style={{ accentColor: theme.place.stroke }}
                aria-label="Reset arc"
            />
        </label>
    </td>
);

const EditableCell = ({ value, rowIndex, columnIndex, onCommit, theme }) => {
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const commit = (text) => {
        const next = parseCellDraft(text);
        if (next === null || next === cellValue(value)) return;
        onCommit(next);
    };

    const moveFocus = (event) => {
        const step = MATRIX_ARROW_STEPS[event.key];
        if (!step) return;

        event.preventDefault();
        focusCell(inputRef.current?.closest('table'), rowIndex + step[0], columnIndex + step[1]);
    };

    const { draft, inputProps } = useDraft({ value, format: toDraft, onCommit: commit, onKeyDown: moveFocus });
    const isEmpty = draft === '0' || draft === '∞';

    const handleFocus = () => {
        setIsFocused(true);
        requestAnimationFrame(() => inputRef.current?.select());
    };

    const handleBlur = (event) => {
        setIsFocused(false);
        inputProps.onBlur(event);
    };

    return (
        <td
            className={`${CELL} font-mono transition-colors`}
            style={{
                backgroundColor: isFocused ? theme.diagnostics.activeBg : `${theme.text.label}14`,
                boxShadow: isFocused ? `inset 0 0 0 1px ${theme.diagnostics.active}` : 'none',
            }}
        >
            <input
                ref={inputRef}
                {...inputProps}
                type="text"
                inputMode="numeric"
                data-row={rowIndex}
                data-column={columnIndex}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-6 bg-transparent p-0 text-center outline-none"
                style={{ color: isEmpty ? theme.disabled.text : theme.text.code }}
                aria-label="Matrix value"
            />
        </td>
    );
};
