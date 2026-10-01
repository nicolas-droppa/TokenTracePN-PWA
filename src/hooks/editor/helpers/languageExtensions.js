import { xml } from '@codemirror/lang-xml';
import { dpnLanguage } from './dpnLanguage';
import { dpnLinter } from './dpnLinter';

/**
* Extensions for CodeMirror editor based on the selected language.
* @param {string} language - Programming language (e.g., 'dpn', 'pnml').
* @returns {Array} CodeMirror extensions for the specified language.
*/
export const languageExtensions = (language) => {
    switch (language) {
        case 'dpn':
            return [dpnLanguage, dpnLinter];
        case 'pnml':
            return [xml()];
        default:
            return [];
    }
};
