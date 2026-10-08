/**
 * Turns the first key code of a shortcut into the text shown in UI.
 * 'Digit3' -> '3', 'KeyC' -> 'C', 'Numpad3' -> 'Num 3'.
 * @param {string[]} [codes] - KeyboardEvent.code values.
 * @returns {string} Label, empty if no shortcut.
 */
export const shortcutLabel = (codes) => {
    const [code] = codes ?? [];
    if (!code) return '';
    return code.replace(/^(Digit|Key)/, '').replace(/^Numpad/, 'Num ');
};

/**
 * Appends the shortcut to tooltip text.
 * @param {string} label - Tooltip text.
 * @param {string[]} [codes] - KeyboardEvent.code values.
 * @returns {string}
 */
export const withShortcut = (label, codes) => {
    const shortcut = shortcutLabel(codes);
    return shortcut ? `${label} (${shortcut})` : label;
};
