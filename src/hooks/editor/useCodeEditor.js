import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { forceLinting, lintGutter } from '@codemirror/lint';
import { useSettingsStore } from '../../store/useSettingsStore';
import { baseExtensions } from './helpers/editorSetup';
import { editorTheme } from './helpers/editorTheme';
import { languageExtensions } from './helpers/languageExtensions';

export const useCodeEditor = ({ code, setCode, language, theme, isDark }) => {
    const hostRef = useRef(null);
    const viewRef = useRef(null);
    const uiLanguage = useSettingsStore((s) => s.language);

    const setCodeRef = useRef(setCode);
    setCodeRef.current = setCode;

    const compartmentsRef = useRef(null);
    if (!compartmentsRef.current) {
        compartmentsRef.current = { lang: new Compartment(), theme: new Compartment() };
    }

    useEffect(() => {
        const { lang, theme: themeComp } = compartmentsRef.current;

        const view = new EditorView({
            parent: hostRef.current,
            state: EditorState.create({
                doc: code ?? '',
                extensions: [
                    ...baseExtensions(),
                    lintGutter(),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) setCodeRef.current?.(update.state.doc.toString());
                    }),
                    lang.of(languageExtensions(language)),
                    themeComp.of(editorTheme(theme, isDark)),
                ],
            }),
        });

        viewRef.current = view;
        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, []);

    // Listen for code change from outside the editor.
    useEffect(() => {
        const view = viewRef.current;
        if (!view) return;
        const current = view.state.doc.toString();
        const next = code ?? '';
        if (next !== current) view.dispatch({ changes: minimalChange(current, next) });
    }, [code]);

    // Listen for language change
    useEffect(() => {
        viewRef.current?.dispatch({
            effects: compartmentsRef.current.lang.reconfigure(languageExtensions(language)),
        });
    }, [language]);

    // Re-lint so the messages switch to the new UI language
    useEffect(() => {
        if (viewRef.current) forceLinting(viewRef.current);
    }, [uiLanguage]);

    // Listen for theme change
    useEffect(() => {
        viewRef.current?.dispatch({
            effects: compartmentsRef.current.theme.reconfigure(editorTheme(theme, isDark)),
        });
    }, [theme, isDark]);

    return { hostRef, viewRef };
};

/**
 * The smallest single replacement that turns before to after
 * (skips the common start and end of both texts).
 */
const minimalChange = (before, after) => {
    let start = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;

    let endBefore = before.length;
    let endAfter = after.length;
    while (endBefore > start && endAfter > start && before[endBefore - 1] === after[endAfter - 1]) {
        endBefore--;
        endAfter--;
    }

    return { from: start, to: endBefore, insert: after.slice(start, endAfter) };
};
