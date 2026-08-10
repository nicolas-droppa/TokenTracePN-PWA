import React, { useState, useRef, useEffect } from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const Header = () => {
    const { activeTheme, setTheme } = usePetriStore();
    const theme = THEMES[activeTheme] || THEMES.dark;
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsThemeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header
            className="h-12 w-full flex items-center justify-between px-4 border-b shrink-0 select-none transition-colors duration-200"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <div className="flex items-center space-x-3">
                <span className="font-bold text-sm tracking-wide" style={{ color: theme.text.token }}>
                    TokenTrace<span style={{ color: theme.place.stroke }}>PN</span>
                </span>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsThemeOpen((prev) => !prev)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-2 border transition-all cursor-pointer"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            borderColor: theme.sidebar.inputBorder,
                            color: theme.text.label,
                        }}
                    >
                        <span>Theme: <strong style={{ color: theme.text.token }}>{theme.label}</strong></span>
                        <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isThemeOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isThemeOpen && (
                        <div
                            className="absolute right-0 mt-1 w-44 rounded-md border shadow-xl z-50 py-1"
                            style={{
                                backgroundColor: theme.sidebar.bg,
                                borderColor: theme.sidebar.border,
                            }}
                        >
                            {Object.keys(THEMES).map((themeKey) => {
                                const isSelected = activeTheme === themeKey;
                                return (
                                    <button
                                        key={themeKey}
                                        onClick={() => {
                                            setTheme(themeKey);
                                            setIsThemeOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer"
                                        style={{
                                            color: isSelected ? theme.place.stroke : theme.text.label,
                                            backgroundColor: isSelected ? `${theme.place.stroke}15` : 'transparent',
                                        }}
                                    >
                                        <span>{THEMES[themeKey].label}</span>
                                        {isSelected && (
                                            <span 
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: theme.place.stroke }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};