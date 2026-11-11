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

export const MATRIX_VIEWS = [
    { key: 'input',     title: 'Input (I)' },
    { key: 'output',    title: 'Output (O)' },
    { key: 'read',      title: 'Read (R)' },
    { key: 'inhibitor', title: 'Inhibitor (H)' },
    { key: 'reset',     title: 'Reset (Rst)' },
];
