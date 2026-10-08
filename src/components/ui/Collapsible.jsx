import React from 'react';

/**
 * Animates its content between full height and zero.
 * @param {boolean} open - content is visible?.
 * @param {React.ReactNode} children - Content to show or hide.
 */
export const Collapsible = ({ open, children }) => (
    <div
        className="grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
        aria-hidden={!open}
    >
        <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
);
