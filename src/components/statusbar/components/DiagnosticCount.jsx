import React from 'react';

/**
 * Colored dot and count for one diagnostic severity.
 * @param {Object} props - Component props.
 * @param {number} props.count - Diagnostic count.
 * @param {string} props.color - Theme color used when count is greater than zero.
 * @param {string} props.title - Native tooltip text.
 * @param {Object} props.theme - Active application theme.
 */
export const DiagnosticCount = ({ count, color, title, theme }) => (
    <span className="inline-flex items-center gap-1" title={title}>
        <span
            className="relative -top-px inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: count > 0 ? color : theme.disabled.text }}
        />
        <span>{count}</span>
    </span>
);
