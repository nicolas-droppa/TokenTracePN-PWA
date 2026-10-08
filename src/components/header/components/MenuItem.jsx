import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';

/**
 * One row in a dropdown menu.
 * @param {string} label - Row text.
 * @param {Function} onClick - Called when the row is clicked.
 * @param {boolean} [disabled] - Greyed out and not clickable.
 * @param {boolean} [selected] - Highlighted with a dot (e.g. active theme).
 */
export const MenuItem = ({ label, onClick, disabled = false, selected = false }) => {
    const theme = useTheme();
    const color = disabled ? theme.disabled.text : selected ? theme.place.stroke : theme.text.label;

    return (
        <button
            role="menuitem"
            onClick={onClick}
            disabled={disabled}
            className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
            style={{
                color,
                backgroundColor: selected ? `${theme.place.stroke}15` : 'transparent',
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
        >
            <span>{label}</span>
            {selected && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.place.stroke }} />
            )}
        </button>
    );
};
