import { useCallback, useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { baseExtensions } from './helpers/editorSetup';
import { editorTheme } from './helpers/editorTheme';

const readOnlyExtensions = (readOnly) => [
    EditorState.readOnly.of(readOnly),
    EditorView.editable.of(!readOnly),
];

/**
 * CodeMirror hook for Python lab solutions.
 * @param {Object} options
 * @param {string} [options.initialCode=''] - Initial document text on mount.
 * @param {boolean} [options.readOnly=false] - Locks editing without recreating the editor.
 * @param {(code: string) => void} [options.onChange] - Called whenever document changes.
 * @param {Object} options.theme - Active theme object.
 * @param {boolean} [options.isDark=true] - Whether the theme is dark.
 * @returns {{ containerRef: React.RefObject<HTMLDivElement|null>, setCode: (text: string) => void }}
 */
export const usePythonEditor = ({
    initialCode = '',
    readOnly = false,
    onChange,
    theme,
    isDark = true,
}) => {
    const containerRef = useRef(null);
    const viewRef = useRef(null);

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const readOnlyRef = useRef(readOnly);
    readOnlyRef.current = readOnly;

    const compartmentsRef = useRef(null);
    if (!compartmentsRef.current) {
        compartmentsRef.current = {
            theme: new Compartment(),
            readOnly: new Compartment(),
        };
    }

    useEffect(() => {
        if (!containerRef.current) return;

        const { theme: themeComp, readOnly: readOnlyComp } = compartmentsRef.current;

        const view = new EditorView({
            parent: containerRef.current,
            state: EditorState.create({
                doc: initialCode ?? '',
                extensions: [
                    ...baseExtensions(),
                    python(),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            onChangeRef.current?.(update.state.doc.toString());
                        }
                    }),
                    themeComp.of(editorTheme(theme, isDark)),
                    readOnlyComp.of(readOnlyExtensions(readOnlyRef.current)),
                ],
            }),
        });

        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, []);

    // Listen for theme change
    useEffect(() => {
        viewRef.current?.dispatch({
            effects: compartmentsRef.current.theme.reconfigure(editorTheme(theme, isDark)),
        });
    }, [theme, isDark]);

    // Listen for readOnly change
    useEffect(() => {
        viewRef.current?.dispatch({
            effects: compartmentsRef.current.readOnly.reconfigure(readOnlyExtensions(readOnly)),
        });
    }, [readOnly]);

    const setCode = useCallback((text) => {
        const view = viewRef.current;
        if (!view) return;

        const next = text ?? '';
        const current = view.state.doc.toString();
        if (next === current) return;

        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: next },
        });
    }, []);

    return { containerRef, setCode };
};
