import React, { useState } from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';

export const CodeEditorPanel = () => {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;
    const [language, setLanguage] = useState('create');

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
                <div className="text-[10px] uppercase" style={{ color: theme.disabled.text }}>
                    <label htmlFor="code-language" className="sr-only">Code language</label>
                    <select
                        id="code-language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            color: theme.disabled.text,
                            border: `1px solid ${theme.sidebar.border}`
                        }}
                    >
                        <option value="dpn">DPN (Fast prototype)</option>
                        <option value="pnml">PNML (XML)</option>
                        <option value="plc">PLC</option>
                    </select>
                </div>
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