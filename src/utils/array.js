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