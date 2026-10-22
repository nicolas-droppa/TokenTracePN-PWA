import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const markerSvg = (body) =>
    `url('data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${body}</svg>`
    )}')`;

const severityColors = (theme) => ({
    error: theme.diagnostics?.error ?? '#f87171',
    warning: theme.diagnostics?.warning ?? '#fbbf24',
    info: theme.diagnostics?.info ?? theme.diagnostics?.active ?? '#38bdf8',
});

/**
 * Defines a custom theme for the CodeMirror editor based on the provided theme and dark mode setting.
 * @param {Object} theme - Object containing color definitions.
 * @param {boolean} isDark - Flag indicating if dark mode is enabled.
 * @returns {Array} CodeMirror extensions for custom theme.
 */
export const editorTheme = (theme, isDark) => {
    const textColor = theme.text.code || theme.text.label;
    const severity = severityColors(theme);

    const base = EditorView.theme(
        {
            '&': {
                height: '100%',
                fontSize: '12px',
                backgroundColor: theme.sidebar.inputBg,
                color: textColor,
            },
            '&.cm-focused': { outline: 'none' },
            '.cm-scroller': {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                lineHeight: '20px',
            },
            '.cm-content': { caretColor: textColor },
            '.cm-cursor, .cm-dropCursor': { borderLeftColor: textColor },
            '.cm-gutters': {
                backgroundColor: theme.sidebar.inputBg,
                color: theme.disabled.text,
                border: 'none',
                fontSize: '10px',
            },
            '.cm-gutter-lint .cm-gutterElement': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '20px',
                lineHeight: '1',
                paddingLeft: '0.4em',
                paddingRight: '0',
                paddingTop: '0',
                paddingBottom: '0',
            },
            '.cm-activeLine': { backgroundColor: theme.diagnostics?.activeBg },
            '.cm-activeLineGutter': {
                backgroundColor: theme.diagnostics?.activeBg,
                color: theme.diagnostics?.activeText,
            },

            '.cm-lintRange-error': {
                backgroundImage: 'none',
                textDecoration: `underline wavy ${severity.error}`,
            },
            '.cm-lintRange-warning': {
                backgroundImage: 'none',
                textDecoration: `underline wavy ${severity.warning}`,
            },
            '.cm-lintRange-info': {
                backgroundImage: 'none',
                textDecoration: `underline wavy ${severity.info}`,
            },

            '.cm-lint-marker': {
                width: '1em',
                height: '1em',
            },
            '.cm-lint-marker-error': {
                content: markerSvg(`<circle cx="20" cy="20" r="13" fill="${severity.error}"/>`),
            },
            '.cm-lint-marker-warning': {
                content: markerSvg(
                    `<path d="M20 7 L34 32 H6 Z" fill="${severity.warning}" stroke="${severity.warning}" stroke-width="4" stroke-linejoin="round"/>`
                ),
            },
            '.cm-lint-marker-info': {
                content: markerSvg(
                    `<circle cx="20" cy="20" r="9" fill="none" stroke="${severity.info}" stroke-width="5"/>`
                ),
            },

            '.cm-tooltip': {
                backgroundColor: theme.sidebar.inputBg,
                color: textColor,
                border: `1px solid ${theme.sidebar.border}`,
            },
        },
        { dark: isDark }
    );

    const highlight = HighlightStyle.define([
        { tag: t.keyword, color: theme.syntax.keyword },
        { tag: t.operator, color: theme.syntax.arrow },
        { tag: t.number, color: theme.syntax.number },
        { tag: t.string, color: theme.syntax.string },
        { tag: t.paren, color: theme.syntax.bracket },
        { tag: t.punctuation, color: theme.syntax.punctuation },
        { tag: t.comment, color: theme.syntax.comment, fontStyle: 'italic' },
        { tag: t.propertyName, color: theme.syntax.attributeKey },
        { tag: t.variableName, color: theme.syntax.identifier },
        { tag: t.invalid, color: theme.diagnostics?.errorText },

        { tag: t.tagName, color: theme.syntax.keyword },
        { tag: t.attributeName, color: theme.syntax.attributeKey },
        { tag: t.attributeValue, color: theme.syntax.string },
        { tag: t.angleBracket, color: theme.syntax.bracket },
    ]);

    return [base, syntaxHighlighting(highlight)];
};