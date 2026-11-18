import React, { useRef, useState } from 'react';
import { useSettingsStore, useTheme } from '../../../store/useSettingsStore';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { toLatex, toArray } from '../../../core/analysis/matrixExport';
import { notify } from '../../notifications/notify.jsx';
import { NOTIFY_STATUS, NOTIFY_TOPIC } from '../../../constants/notifications';
import { MATRIX_COPY_FORMATS } from '../../../constants/matrices';
import { MenuItem } from '../../ui/MenuItem';

/**
 * Copy button with a menu of export formats (LaTeX variants, JS array).
 * @param {Object} props
 * @param {number[][]} props.matrix
 */
export const MatrixCopyMenu = ({ matrix }) => {
    const theme = useTheme();
    const matrixCopyFormat = useSettingsStore((state) => state.matrixCopyFormat);
    const setMatrixCopyFormat = useSettingsStore((state) => state.setMatrixCopyFormat);
    const { copy } = useCopyToClipboard();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleSelect = async (format) => {
        const content = format === 'array' ? toArray(matrix) : toLatex(matrix, format);
        const label = MATRIX_COPY_FORMATS.find((item) => item.id === format)?.label ?? format;
        const success = await copy(content);

        notify(
            success
                ? { status: NOTIFY_STATUS.SUCCESS, topic: NOTIFY_TOPIC.COPY, title: 'Matrix copied', message: `Copied as ${label}.` }
                : { status: NOTIFY_STATUS.ERROR, topic: NOTIFY_TOPIC.COPY, title: 'Copy failed', message: 'Failed to copy matrix.' }
        );

        if (success) {
            setMatrixCopyFormat(format);
        }

        setIsOpen(false);
    };

    useClickOutside(menuRef, () => isOpen && setIsOpen(false));

    return (
        <div className="relative px-2" ref={menuRef}>
            <div
                className="flex items-stretch overflow-hidden rounded-md border"
                style={{ borderColor: `${theme.text.label}30` }}
            >
                <button
                    type="button"
                    onClick={() => handleSelect(matrixCopyFormat)}
                    title={`Copy as ${matrixCopyFormat}`}
                    aria-label={`Copy as ${matrixCopyFormat}`}
                    className="cursor-pointer px-2 py-1 text-[11px] font-medium transition-colors hover:bg-[var(--hover)]"
                    style={{ color: theme.text.label, '--hover': `${theme.text.label}14` }}
                >
                    Copy
                </button>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Choose matrix copy format"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    className="cursor-pointer border-l px-1.5 py-1 text-[10px] transition-colors hover:bg-[var(--hover)]"
                    style={{ color: theme.text.label, borderColor: `${theme.text.label}30`, '--hover': `${theme.text.label}14` }}
                >
                    ▾
                </button>
            </div>

            {isOpen && (
                <div
                    role="menu"
                    className="absolute right-2 z-50 mt-1 min-w-[170px] rounded-md border py-1 text-[11px] shadow-lg"
                    style={{ backgroundColor: theme.sidebar.bg, borderColor: theme.sidebar.border }}
                >
                    {MATRIX_COPY_FORMATS.map(({ id, symbol, label }) => (
                        <MenuItem
                            key={id}
                            label={label}
                            symbol={symbol}
                            selected={id === matrixCopyFormat}
                            onSelect={() => {
                                setMatrixCopyFormat(id);
                                handleSelect(id);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};