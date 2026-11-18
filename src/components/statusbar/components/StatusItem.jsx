import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';

/**
 * Compact status bar item with an optional tooltip and click action.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.label - Displayed content.
 * @param {string} [props.title] - Optional native tooltip.
 * @param {Function} [props.onClick] - Optional click handler.
 */
export const StatusItem = ({ label, title, onClick }) => {
    const theme = useTheme();
    const className = 'inline-flex items-center text-[11px] leading-none';
    const style = { color: theme.text.label };

    if (!onClick) {
        return <span className={className} style={style} title={title}>{label}</span>;
    }

    return (
        <button
            type="button"
            className={`${className} cursor-pointer rounded px-1 py-0.5 transition-colors duration-150 hover:bg-[var(--hover)]`}
            title={title}
            onClick={onClick}
            style={{
                ...style,
                '--hover': `${theme.text.label}14`,
            }}
        >
            {label}
        </button>
    );
};
