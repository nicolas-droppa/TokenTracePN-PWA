import { StreamLanguage } from '@codemirror/language';
import { KEYWORDS } from '../../../constants/dpn.js';

/** 
 * Defines the DPN language for CodeMirror using StreamLanguage.
 * @returns {StreamLanguage} CodeMirror language extension for DPN.
 */
export const dpnLanguage = StreamLanguage.define({
    name: 'dpn',
    token(stream) {
        if (stream.eatSpace()) return null;

        if (stream.match('//')) {
            stream.skipToEnd();
            return 'comment';
        }
        if (stream.match('->')) return 'operator';
        if (stream.match(/^"(?:\\.|[^"])*"?/) || stream.match(/^'(?:\\.|[^'])*'?/)) return 'string';
        if (stream.match(/^\d+/)) return 'number';
        if (stream.match(/^[()]/)) return 'paren';
        if (stream.match(/^[:,;]/)) return 'punctuation';

        if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
            const word = stream.current();
            if (KEYWORDS.has(word)) return 'keyword';
            if (stream.match(/^\s*:/, false)) return 'propertyName';
            return 'variableName';
        }

        stream.next();
        return 'invalid';
    },
    languageData: {
        commentTokens: { line: '//' },
    },
});
