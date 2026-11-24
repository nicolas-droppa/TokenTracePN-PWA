import React from 'react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const LOCK_ICONS = `${import.meta.env.BASE_URL}icons/labs/`;

/** Icons shared by all labs (public/icons/labs). */
export const LAB_UI_ICONS = {
    lock: `${LOCK_ICONS}lock.svg`,
    lockOpen: `${LOCK_ICONS}lock-open.svg`,
};

/**
 * Black stroke SVG icon, inverted in dark themes (same as the canvas toolbar).
 * @param {Object} props
 * @param {string} props.src - Icon URL (lab.icon or LAB_UI_ICONS.*).
 * @param {number} [props.size=16] - Size in px.
 * @param {string} [props.className]
 */
export const LabIcon = ({ src, size = 16, className = '' }) => {
    const activeTheme = useSettingsStore((s) => s.activeTheme);
    if (!src) return null;

    return (
        <img
            src={src}
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            className={`shrink-0 object-contain ${className}`}
            style={{ filter: activeTheme === 'light' ? 'none' : 'invert(1)' }}
        />
    );
};
