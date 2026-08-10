import React from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const CodeEditorPanel = () => {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    return (
        <div 
            className="flex flex-col h-full transition-colors duration-200"
            style={{ backgroundColor: theme.sidebar.inputBg }}
        >
            <div 
                className="flex items-center justify-between px-4 py-2 border-b text-xs font-semibold"
                style={{ 
                    borderColor: theme.sidebar.border,
                    color: theme.text.label 
                }}
            >
                <span>CODE</span>
                <span 
                    className="text-[10px] uppercase"
                    style={{ color: theme.disabled.text }}
                >
                    DROPDOWN {/* TODO: Dropdown for language selection */}
                </span>
            </div>
            
            <div 
                className="flex-1 p-3 font-mono text-xs overflow-auto"
                style={{ color: theme.disabled.text }}
            >
                <p>// place p1;</p>
                <p>// transition t1;</p>
                <p>// t1 - p1;</p>
            </div>
        </div>
    );
};