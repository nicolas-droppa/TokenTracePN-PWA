/**
 * Constants for the DPN parser.
 */
import { ARC_TYPE, ARC_TYPES } from './net';

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
    arc:        { weight: 'positiveInt', type: ARC_TYPES },
};

export const ATTRIBUTE_ALIASES = {
    l: 'label',
    m: 'tokens',
    t: 'type',
    w: 'weight',
};

export const PLACE_TO_TRANSITION_ONLY = new Set([
    ARC_TYPE.INHIBITOR,
    ARC_TYPE.RESET,
    ARC_TYPE.READ,
]);

export const ATTRIBUTE_FIELDS = {
    arc: { type: 'arcType' },
};
