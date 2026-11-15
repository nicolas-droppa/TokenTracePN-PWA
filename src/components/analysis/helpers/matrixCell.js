export const CELL = 'min-w-[32px] w-[32px] whitespace-nowrap px-1.5 py-2 text-center';

/**
 * Matrix value -> input text, Infinity (no inhibitor) as ∞.
 */
export const toDraft = (value) => (Number.isFinite(value) ? String(value) : '∞');

/**
 * Matrix value as a weight, ∞ means no arc = 0.
 */
export const cellValue = (value) => (Number.isFinite(value) ? value : 0);

/**
 * Input text -> weight. Empty or ∞ means no arc (0), invalid input returns null.
 * @param {string} text
 * @returns {number|null}
 */
export const parseCellDraft = (text) => {
    const trimmed = text.trim();
    if (trimmed === '' || trimmed === '∞') return 0;

    const number = Number(trimmed);
    return Number.isInteger(number) && number >= 0 ? number : null;
};

/**
 * Focuses and selects the input of a cell in the same table, if it exists.
 * @param {HTMLTableElement|null} table
 * @param {number} row
 * @param {number} column
 */
export const focusCell = (table, row, column) => {
    const input = table?.querySelector(`input[data-row="${row}"][data-column="${column}"]`);
    if (!input) return;

    input.focus();
    input.select();
};