import React, { useState, useRef, useEffect } from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import * as dpnParser from '../../core/parsers/dpnParser';

export const CodeEditorPanel = () => {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;
    const [language, setLanguage] = useState('dpn');
    const defaultCode = `// place p1;
// transition t1;
// t1 - p1;
place p2(l: "p2", m: 10,x:7, y: 78);
place p3;
p3(l: "p2",x:500, y: 150);`;
    const [code, setCode] = useState(defaultCode);
    const textareaRef = useRef(null);
    const linesRef = useRef(null);
    const [parseErrors, setParseErrors] = useState([]);

    const handleScroll = (e) => {
        if (linesRef.current) linesRef.current.scrollTop = e.target.scrollTop;
    };

    useEffect(() => {
        if (language !== 'dpn') {
            setParseErrors([]);
            return;
        }

        const id = setTimeout(() => {
            try {
                const canParse = dpnParser.canParse || (dpnParser.default && dpnParser.default.canParse);
                const parseFn = dpnParser.parse || (dpnParser.default && dpnParser.default.parse);
                if (!canParse || !canParse(code)) {
                    setParseErrors([{ message: 'Input does not look like DPN format' }]);
                    return;
                }
                const { model, errors } = parseFn(code);
                setParseErrors(errors || []);
                console.log('DPN parse model:', model);
                console.log('DPN parse errors:', errors);
            } catch (err) {
                setParseErrors([{ message: String(err) }]);
                console.error(err);
            }
        }, 450);

        return () => clearTimeout(id);
    }, [code, language]);

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
                <div className="flex h-full" style={{ minHeight: 120 }}>
                    <div
                        ref={linesRef}
                        className="pr-3 text-[10px] text-right select-none"
                        style={{
                            color: theme.disabled.text,
                            lineHeight: '1.25rem',
                            height: '100%',
                            overflowY: 'hidden',
                            paddingTop: 2,
                            paddingBottom: 2,
                            paddingRight: 8,
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
                    >
                        {code.split('\n').map((_, i) => (
                            <div key={i} className="leading-5">{i + 1}</div>
                        ))}
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onScroll={handleScroll}
                        className="flex-1 w-full resize-none bg-transparent outline-none text-xs font-mono leading-5"
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.disabled.text,
                            border: 'none',
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};