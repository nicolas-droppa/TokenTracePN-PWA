import React, { useState, useEffect } from 'react';
import * as dpnParser from '../../core/parsers/dpnParser';

export const CodeCheckerPanel = ({ errors = [], theme = {}, code = '', language = 'dpn' }) => {
    const [errorsState, setErrorsState] = useState(errors || []);

    useEffect(() => {
        if (language !== 'dpn') {
            setErrorsState([]);
            return;
        }

        const id = setTimeout(() => {
            try {
                const parseFn = dpnParser.parse || (dpnParser.default && dpnParser.default.parse);
                if (!parseFn) {
                    setErrorsState([{ message: 'Parser not available' }]);
                    return;
                }

                const { model, errors: parsedErrors } = parseFn(code) || {};
                setErrorsState(parsedErrors || []);
                console.log('DPN parse model:', model);
                console.log('DPN parse errors:', parsedErrors);
            } catch (err) {
                setErrorsState([{ message: String(err) }]);
                console.error(err);
            }
        }, 450);

        return () => clearTimeout(id);
    }, [code, language]);

    const displayErrors = errorsState || [];
    return (
        <div
            className="px-3 py-2 text-xs"
            style={{ color: (theme && theme.text && theme.text.label) || '#111' }}
        >
            <div className="flex items-center justify-start gap-2 mb-2">
                <strong>Code Checker</strong>
                <span className="text-[11px]" style={{ color: (theme && theme.disabled && theme.disabled.text) || '#666' }}>{displayErrors.length} issue(s)</span>
            </div>

            <div className="max-h-40 overflow-auto text-[11px]" style={{ color: (theme && theme.disabled && theme.disabled.text) || '#666' }}>
                {displayErrors.length === 0 ? (
                    <div className="text-[11px]">No issues</div>
                ) : (
                    displayErrors.map((err, idx) => {
                        const msg = (err && (err.message || err.msg)) || String(err);
                        const line = err && err.line ? ` (line ${err.line})` : '';
                        return (
                            <div key={idx} className="py-1 border-b last:border-b-0" style={{ borderColor: (theme && theme.sidebar && theme.sidebar.border) || '#eee' }}>
                                <div style={{ color: (theme && theme.diagnostics && theme.diagnostics.errorText) || '#f87171' }}>{msg}{line}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CodeCheckerPanel;
