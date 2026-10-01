/**
 * Constants for the DPN parser.
 */
export const KEYWORDS = new Set(['place', 'transition']);

export const PUNCTUATION = {
    '(': 'LPAREN',
    ')': 'RPAREN',
    ':': 'COLON',
    ',': 'COMMA',
    ';': 'SEMI',
};

export const ATTRIBUTE_SCHEMA = {
    place:      { tokens: 'nonNegativeInt', x: 'number', y: 'number', label: 'string' },
    transition: { x: 'number', y: 'number', label: 'string' },
    arc:        { weight: 'positiveInt', type: ['regular', 'inhibitor', 'reset', 'read'] },
};

export const ATTRIBUTE_ALIASES = {
    l: 'label',
    m: 'tokens',
    t: 'type',
    w: 'weight',
};

export const PLACE_TO_TRANSITION_ONLY = new Set(['inhibitor', 'reset', 'read']);
