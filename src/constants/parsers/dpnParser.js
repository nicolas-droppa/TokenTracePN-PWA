/**
 * Constants for the DPN parser.
 * @file src/constants/parsers/dpnParser.js
 */
export const KEYWORDS = new Set(['place', 'transition', 'arc']);
export const PUNCTUATION = {
    '(': 'LPAREN',
    ')': 'RPAREN',
    ':': 'COLON',
    ',': 'COMMA',
    ';': 'SEMI'
};