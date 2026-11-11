/**
 * Converts a matrix into LaTeX form.
 * @param {Array<Array<any>>} matrix - Marix
 * @param {'matrix' | 'bmatrix' | 'pmatrix' | 'vmatrix'} [type='matrix']
 * @returns {string} The formatted LaTeX matrix.
 */
export function toLatex(matrix, type = 'matrix') {
    const matrixStart = `\\begin{${type}}`;
    const matrixEnd = `\\end{${type}}`;

    const matrixBody = buildLatexMatrixBody(matrix);

    return `${matrixStart}\n${matrixBody}\n${matrixEnd}`;
}

function buildLatexMatrixBody(matrix) {
    if (!matrix || matrix.length === 0) return "";

    const rows = [];

    for (let i = 0; i < matrix.length; i++) {
        const rowCells = [];
        for (let j = 0; j < matrix[i].length; j++) {
            rowCells.push(formatLatexCell(matrix[i][j]));
        }

        rows.push(rowCells.join(' & '));
    }

    return rows.join(' \\\\\n');
}

function formatLatexCell(value) {
    if (typeof value === 'number') {
        if (value === Infinity) return '\\infty';
        if (value === -Infinity) return '-\\infty';
        if (Number.isNaN(value)) return 'NaN';
    }

    return value;
}

function formatArrayCell(value) {
    if (typeof value === 'number') {
        if (value === Infinity) return 'Infinity';
        if (value === -Infinity) return '-Infinity';
        if (Number.isNaN(value)) return 'NaN';
    }

    return value;
}

/**
 * Prints out a matrix.
 * @param {Array<Array<any>>} matrix - Matrix
 * @returns {string} A string representation of 2D array.
 */
export function toArray(matrix) {
    if (!matrix || matrix.length === 0) return '[]';

    const rows = matrix.map((row) => `    [${row.map((value) => formatArrayCell(value)).join(', ')}]`);
    return `[\n${rows.join(',\n')}\n]`;
}