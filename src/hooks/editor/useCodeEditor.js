import { useEffect, useRef } from 'react';
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLine,
    highlightActiveLineGutter,
    drawSelection,
} from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching } from '@codemirror/language';
import { lintGutter } from '@codemirror/lint';

import { languageExtensions } from './helpers/languageExtensions';
import { editorTheme } from './helpers/editorTheme';

export const useCodeEditor = ({ code, setCode, language, theme, isDark }) => {
    const hostRef = useRef(null);
    const viewRef = useRef(null);

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
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    highlightActiveLine(),
                    drawSelection(),
                    history(),
                    bracketMatching(),
                    lintGutter(),
                    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
                    EditorView.contentAttributes.of({
                        spellcheck: 'false',
                        autocorrect: 'off',
                        autocapitalize: 'off',
                    }),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) setCodeRef.current(update.state.doc.toString());
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
