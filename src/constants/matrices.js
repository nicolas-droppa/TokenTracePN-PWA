import { ARC_TYPE } from './net';

export const MATRIX_COPY_FORMATS = [
    { id: 'bmatrix', symbol: '[ ]', label: 'bmatrix' },
    { id: 'pmatrix', symbol: '( )', label: 'pmatrix' },
    { id: 'vmatrix', symbol: '| |', label: 'vmatrix' },
    { id: 'matrix',  symbol: '·',   label: 'matrix (raw)' },
    { id: 'array',   symbol: '[ ]', label: 'JS Array' },
];

export const MATRIX_FORMAT = {
    BMATRIX: 'bmatrix',
    PMATRIX: 'pmatrix',
    VMATRIX: 'vmatrix',
    MATRIX: 'matrix',
    ARRAY: 'array',
};

export const PLACE_SIDE = {
    SOURCE: 'source',
    TARGET: 'target',
};

export const ARC_DIRECTION = {
    PLACE_TO_TRANSITION: 'placeToTransition',
    TRANSITION_TO_PLACE: 'transitionToPlace',
};

export const MATRIX_VIEWS = [
    { key: 'input',     arcType: ARC_TYPE.REGULAR,   direction: ARC_DIRECTION.PLACE_TO_TRANSITION },
    { key: 'output',    arcType: ARC_TYPE.REGULAR,   direction: ARC_DIRECTION.TRANSITION_TO_PLACE },
    { key: 'read',      arcType: ARC_TYPE.READ,      direction: ARC_DIRECTION.PLACE_TO_TRANSITION },
    { key: 'inhibitor', arcType: ARC_TYPE.INHIBITOR, direction: ARC_DIRECTION.PLACE_TO_TRANSITION },
    { key: 'reset',     arcType: ARC_TYPE.RESET,     direction: ARC_DIRECTION.PLACE_TO_TRANSITION },
];
