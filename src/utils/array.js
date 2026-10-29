/**
 * Includes <from, to> in the range.
 * @param {number} from - Start
 * @param {number} to - End
 * @returns {number[]} - The range of numbers from `from` to `to`
 */
export function range(from, to) {
    const result = [];

    for (let i = from; i <= to; i++) {
        result.push(i);
    }

    return result;
}

/**
 * Creates a matrix filled with 0s.
 * @param {number} rows 
 * @param {number} cols 
 * @returns {number[][]} - Matrix filled with 0s.
 */
export const zeros = (rows, cols) => {
    const matrix = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(0);
        }
        matrix.push(row);
    }

    return matrix;
};