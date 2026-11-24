import { LAB_STATUS } from '../constants/labs';

/**
 * Theme color of a lab status (dot in the lab bar and the lab panel header).
 * @param {string} status - Value from LAB_STATUS.
 * @param {Object} theme - Active theme.
 * @returns {string} CSS color.
 */
export const labStatusColor = (status, theme) => {
    if (status === LAB_STATUS.SOLVED) return theme.status.run;
    if (status === LAB_STATUS.IN_PROGRESS) return theme.diagnostics.warning;
    if (status === LAB_STATUS.TODO) return theme.diagnostics.active;
    return theme.disabled.text;
};
