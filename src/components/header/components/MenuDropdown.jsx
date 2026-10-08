import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';

/**
 * Menu button with a dropdown panel.
 * @param {string} label - Button text.
 * @param {boolean} isOpen - Whether the panel is visible.
 * @param {Function} onToggle - Called when the button is clicked.
 * @param {React.ReactNode} children - Panel content (MenuItem, ThemeMenu, ...).
 */
export const MenuDropdown = ({ label, isOpen, onToggle, children }) => {
    const theme = useTheme();

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer"
                style={{
                    backgroundColor: isOpen ? `${theme.place.stroke}18` : 'transparent',
                    color: isOpen ? theme.text.token : theme.text.label,
                }}
            >
                <span>{label}</span>
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div
                    role="menu"
                    className="absolute left-0 mt-1 min-w-[180px] rounded-md border shadow-xl z-50 py-1"
                    style={{
                        backgroundColor: theme.sidebar.bg,
                        borderColor: theme.sidebar.border,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
