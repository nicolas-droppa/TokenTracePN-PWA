import React from 'react';
import { useSettingsStore, useTheme } from '../../../store/useSettingsStore.js';

/**
 * Renders one tool button in canvas toolbar.
 * @param {{label: string, icon: string}} tool - Item from TOOL_GROUPS.
 * @param {string} [shortcut] - Key shown in the corner ('3').
 * @param {boolean} isActive - Currently selected tool.
 * @param {boolean} disabled - Simulation running.
 * @param {boolean} focusable - true | false
 * @param {Function} onSelect - Selects the tool.
 */
export const ToolButton = ({ tool, shortcut, isActive, disabled, focusable, onSelect }) => {
    const theme = useTheme();
    const activeTheme = useSettingsStore((s) => s.activeTheme);
    const iconFilter = activeTheme === 'light' ? 'none' : 'invert(1)';

    const dotVisibility = isActive ? 'opacity-100' : disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100';
    const iconVisibility = isActive || disabled ? 'opacity-100' : 'opacity-70 group-hover:opacity-100';
    const hintVisibility = isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100';

    let title = tool.label;
    if (disabled) title = 'Stop the simulation to edit';
    else if (shortcut) title = `${tool.label} (${shortcut})`;

    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            tabIndex={focusable ? 0 : -1}
            title={title}
            aria-label={tool.label}
            aria-keyshortcuts={shortcut || undefined}
            aria-pressed={isActive}
            className={`group flex h-9 w-full items-center gap-2 rounded-md px-2 transition-colors duration-150 ${
                disabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'
            }`}
            style={{
                position: 'relative',
                backgroundColor: isActive ? `${theme.place.stroke}18` : 'transparent',
            }}
        >
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-150 ${dotVisibility}`}
                style={{ backgroundColor: isActive ? theme.place.stroke : theme.disabled.text }}
            />

            <img
                src={tool.icon}
                alt=""
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 object-contain transition-opacity duration-150 ${iconVisibility}`}
                style={{ filter: iconFilter }}
            />

            {shortcut && (
                <span
                    aria-hidden="true"
                    className={`pointer-events-none font-mono transition-opacity duration-150 ${hintVisibility}`}
                    style={{
                        position: 'absolute',
                        right: 4,
                        bottom: 2,
                        fontSize: 8,
                        lineHeight: 1,
                        color: isActive ? theme.place.stroke : theme.disabled.text,
                    }}
                >
                    {shortcut}
                </span>
            )}
        </button>
    );
};
