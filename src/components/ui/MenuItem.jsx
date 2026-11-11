import React from 'react';
import { useTheme } from '../../store/useSettingsStore';

/**
 * A menu item component that can be selected or disabled.
 * @param {Object} props - Component props.
 * @param {string} props.label - The label of the menu item.
 * @param {string} [props.symbol] - Optional symbol to display near label.
 * @param {Function} props.onSelect - Function to call when the item is selected.
 * @param {boolean} [props.disabled=false] - Whether the item is disabled.
 * @param {boolean} [props.selected=false] - Whether the item is selected.
 */
export const MenuItem = ({ label, symbol = '', onSelect, disabled = false, selected = false }) => {
    const theme = useTheme();
    const textColor = disabled ? theme.disabled.text : selected ? theme.text.token : theme.text.label;
    const symbolColor = selected ? theme.place.stroke : theme.place.stroke;

    return (
        <button
            type="button"
            role="menuitem"
            onClick={disabled ? undefined : onSelect}
            disabled={disabled}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-[var(--hover)]"
            style={{
                opacity: disabled ? 0.65 : 1,
                '--bg': selected ? `${theme.place.stroke}15` : 'transparent',
                '--hover': `${theme.text.label}14`,
            }}
        >
            {symbol ? (
                <span className="w-6 shrink-0 text-center font-mono bg-[var(--bg)] enabled:hover:bg-[var(--hover)] disabled:cursor-not-allowed" style={{ color: symbolColor }}>
                    {symbol}
                </span>
            ) : null}
            <span style={{ color: textColor }}>{label}</span>
        </button>
    );
};