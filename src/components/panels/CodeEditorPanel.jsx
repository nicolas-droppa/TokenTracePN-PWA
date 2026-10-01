import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import * as dpnParser from '../../core/parsers/dpnParser';

export const CodeEditorPanel = ({ code, setCode, language, setLanguage }) => {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;
    const textareaRef = useRef(null);
    const linesRef = useRef(null);
    const highlightRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeLineNumber, setActiveLineNumber] = useState(1);
    const [visibleErrorLineNumbers, setVisibleErrorLineNumbers] = useState(new Set());
    const lastValidatedLineRef = useRef(1);
    const LINE_HEIGHT = 20;

    const parsedErrorLineNumbers = useMemo(() => {
        if (language !== 'dpn' || !code) return new Set();

        try {
            const result = dpnParser.parse(code);
            const errorLines = Array.isArray(result?.errors)
                ? result.errors
                    .map((err) => Number(err?.line))
                    .filter((line) => Number.isFinite(line))
                : [];
            return new Set(errorLines);
        } catch {
            return new Set();
        }
    }, [code, language]);

    useEffect(() => {
        setVisibleErrorLineNumbers(new Set());
    }, [code, language]);

    const escapeHtml = (value) =>
        value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    const highlightLine = (sourceLine) => {
        const pattern = /(\/\/.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(place|transition|arc)\b|->|\b\d+\b|\(|\)|:|,|;|\b[a-zA-Z_][a-zA-Z0-9_]*\b)/gm;
        let result = '';
        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(sourceLine)) !== null) {
            result += escapeHtml(sourceLine.slice(lastIndex, match.index));

            const token = match[0];
            const safeToken = escapeHtml(token);
            let color = theme.syntax.identifier;

            if (/^(place|transition|arc)$/i.test(token)) color = theme.syntax.keyword;
            else if (/^->$/.test(token)) color = theme.syntax.arrow;
            else if (/^\d+$/.test(token)) color = theme.syntax.number;
            else if (/^(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*')$/.test(token)) color = theme.syntax.string;
            else if (/^(\(|\))$/.test(token)) color = theme.syntax.bracket;
            else if (/^(:|,|;)$/.test(token)) color = theme.syntax.punctuation;
            else if (/^\/\//.test(token)) color = theme.syntax.comment;
            else if (/^(?:w|x|y|m|t|l|r|n|s|a|b|c|d|e|f|g|h|i|j|k|q|u|v|z)$/i.test(token)) color = theme.syntax.attributeKey;

            result += `<span style="color:${color}">${safeToken}</span>`;
            lastIndex = match.index + token.length;
        }

        result += escapeHtml(sourceLine.slice(lastIndex));
        return result || '&nbsp;';
    };

    const buildHighlightedCode = (source) => {
        if (!source) return '';

        return String(source)
            .split('\n')
            .map((line) => highlightLine(line))
            .join('\n');
    };

    const syncActiveLineFromCaret = (caretPosition) => {
        const safeCaret = Number.isFinite(caretPosition) ? caretPosition : 0;
        const beforeCaret = code.slice(0, safeCaret);
        const nextLineNumber = beforeCaret.split('\n').length;

        setActiveLineNumber(nextLineNumber);

        if (nextLineNumber !== lastValidatedLineRef.current) {
            setVisibleErrorLineNumbers(parsedErrorLineNumbers);
            lastValidatedLineRef.current = nextLineNumber;
        }
    };

    const handleEditorBlur = () => {
        setVisibleErrorLineNumbers(parsedErrorLineNumbers);
        lastValidatedLineRef.current = activeLineNumber;
    };

    const errorLineOverlay = useMemo(() => {
        if (!code) return [];

        return String(code).split('\n').map((_, index) => ({
            lineNumber: index + 1,
            isErrorLine: visibleErrorLineNumbers.has(index + 1),
            isActiveLine: activeLineNumber === index + 1,
        }));
    }, [code, visibleErrorLineNumbers, activeLineNumber]);

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
        setScrollLeft(e.target.scrollLeft);

        if (linesRef.current) linesRef.current.scrollTop = e.target.scrollTop;
        if (highlightRef.current) {
            highlightRef.current.scrollTop = e.target.scrollTop;
            highlightRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    return (
        <div
            className="flex flex-col h-full transition-colors duration-200"
            style={{ backgroundColor: theme.sidebar.inputBg }}
        >
            <div
                className="flex items-center justify-between px-4 py-2 border-b text-xs font-semibold"
                style={{
                    borderColor: theme.sidebar.border,
                    color: theme.text.label,
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
                            border: `1px solid ${theme.sidebar.border}`,
                        }}
                    >
                        <option value="dpn">DPN (Fast prototype)</option>
                        <option value="pnml">PNML (XML)</option>
                        <option value="plc">PLC</option>
                    </select>
                </div>
            </div>

            <div
                className="flex-1 p-3 font-mono text-xs overflow-auto flex flex-col"
                style={{ color: theme.disabled.text }}
            >
                <div className="flex h-full" style={{ minHeight: 120 }}>
                    <div
                        ref={linesRef}
                        className="pr-3 text-[10px] text-right select-none"
                        style={{
                            color: theme.disabled.text,
                            lineHeight: `${LINE_HEIGHT}px`,
                            height: '100%',
                            overflowY: 'hidden',
                            paddingBottom: 2,
                            paddingRight: 8,
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                        }}
                    >
                        {String(code || '').split('\n').map((_, i) => {
                            const lineNumber = i + 1;
                            const isErrorLine = visibleErrorLineNumbers.has(lineNumber);
                            const isActiveLine = activeLineNumber === lineNumber;

                            return (
                                <div
                                    key={i}
                                    className="px-1 rounded-sm"
                                    style={{
                                        height: `${LINE_HEIGHT}px`,
                                        lineHeight: `${LINE_HEIGHT}px`,
                                        color: isErrorLine ? theme.diagnostics?.errorText : isActiveLine ? theme.diagnostics?.activeText : theme.disabled.text,
                                        backgroundColor: isErrorLine ? theme.diagnostics?.errorBg : isActiveLine ? theme.diagnostics?.activeBg : 'transparent',
                                        borderLeft: isErrorLine
                                            ? `2px solid ${theme.diagnostics?.lineBorder || '#f87171'}`
                                            : isActiveLine
                                                ? `2px solid ${theme.diagnostics?.activeLineBorder || '#38bdf8'}`
                                                : '2px solid transparent',
                                    }}
                                >
                                    {lineNumber}
                                </div>
                            );
                        })}
                    </div>

                    <div className="relative flex-1 overflow-hidden" style={{ minWidth: 0 }}>
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                zIndex: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: `${Math.max(String(code || '').split('\n').length, 1) * LINE_HEIGHT}px`,
                                    transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
                                }}
                            >
                                {errorLineOverlay.map(({ lineNumber, isErrorLine, isActiveLine }) => {
                                    const backgroundColor = isErrorLine
                                        ? theme.diagnostics?.errorBg
                                        : isActiveLine
                                            ? theme.diagnostics?.activeBg
                                            : 'transparent';

                                    const borderColor = isErrorLine
                                        ? theme.diagnostics?.lineBorder || '#f87171'
                                        : isActiveLine
                                            ? theme.diagnostics?.activeLineBorder || '#38bdf8'
                                            : 'transparent';

                                    return (
                                        <div
                                            key={lineNumber}
                                            style={{
                                                position: 'absolute',
                                                top: `${(lineNumber - 1) * LINE_HEIGHT}px`,
                                                left: 0,
                                                right: 0,
                                                height: `${LINE_HEIGHT}px`,
                                                lineHeight: `${LINE_HEIGHT}px`,
                                                backgroundColor,
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <pre
                            ref={highlightRef}
                            aria-hidden="true"
                            className="absolute inset-0 m-0 font-mono text-xs leading-5 pointer-events-none"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 1,
                                backgroundColor: 'transparent',
                                color: theme.text.code || theme.text.label,
                                margin: 0,
                                padding: 0,
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                            }}
                            dangerouslySetInnerHTML={{ __html: buildHighlightedCode(code) || '&nbsp;' }}
                        />

                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                syncActiveLineFromCaret(e.target.selectionStart);
                            }}
                            onClick={(e) => syncActiveLineFromCaret(e.target.selectionStart)}
                            onKeyUp={(e) => syncActiveLineFromCaret(e.target.selectionStart)}
                            onSelect={(e) => syncActiveLineFromCaret(e.target.selectionStart)}
                            onBlur={handleEditorBlur}
                            onFocus={() => {
                                setVisibleErrorLineNumbers(new Set());
                                lastValidatedLineRef.current = activeLineNumber;
                            }}
                            onScroll={handleScroll}
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoComplete="off"
                            className="absolute inset-0 z-10 w-full h-full resize-none bg-transparent outline-none text-xs font-mono leading-5"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 10,
                                backgroundColor: 'transparent',
                                color: 'transparent',
                                caretColor: theme.text.code || theme.text.label,
                                border: 'none',
                                overflowY: 'auto',
                                overflowX: 'auto',
                                whiteSpace: 'pre',
                                lineHeight: `${LINE_HEIGHT}px`,
                                padding: 0,
                                resize: 'none',
                                WebkitTextFillColor: 'transparent',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};