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
 * Creates a matrix filled with a default value.
 * @param {number} rows
 * @param {number} cols
 * @param {any} fillValue
 * @returns {any[][]} - Matrix filled with the requested value.
 */
export const zeros = (rows, cols, fillValue = 0) => {
    const matrix = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(fillValue);
        }
        matrix.push(row);
    }

    return matrix;
};
