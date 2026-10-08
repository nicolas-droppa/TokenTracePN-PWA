import React from 'react';
import { useTheme } from '../../../store/useSettingsStore.js';

/**
 * Render a button in the canvas toolbar.
 * @param {string} [className] - Css classes.
 * @param {object} props - React props.
 * @param {React.ReactNode} [children] - Button content.
 */
export const ToolbarButton = ({ className = '', children, ...props }) => {
    const theme = useTheme();

    return (
        <button
            type="button"
            className={`flex h-6 items-center justify-center rounded-md text-[10px] font-bold opacity-70 transition-opacity duration-150 enabled:cursor-pointer enabled:hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-35 ${className}`}
            style={{
                backgroundColor: theme.sidebar.inputBg,
                color: theme.text.label,
                border: `1px solid ${theme.sidebar.border}`,
            }}
            {...props}
        >
            {children}
        </button>
    );
};
