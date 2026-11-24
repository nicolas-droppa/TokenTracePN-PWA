import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { LabIcon, LAB_UI_ICONS } from './LabIcon';

/**
 * Lab icon in a bordered square (lab bar and lab panel header look the same).
 * @param {Object} props
 * @param {Object} props.lab - Lab from the registry.
 * @param {number} [props.size=40] - Box size in px.
 * @param {number} [props.iconSize=24] - Icon size in px.
 * @param {boolean} [props.isActive=false] - Accent border and tint.
 * @param {boolean} [props.isLocked=false] - Dimmed icon with a small lock.
 * @param {string} [props.className]
 */
export const LabIconBox = ({ lab, size = 40, iconSize = 24, isActive = false, isLocked = false, className = '' }) => {
    const theme = useTheme();

    return (
        <span
            className={`relative flex shrink-0 items-center justify-center rounded-md border transition-colors duration-150 ${
                isActive ? '' : 'group-hover:border-[var(--hover-border)]'
            } ${className}`}
            style={{
                width: size,
                height: size,
                borderColor: isActive ? `${theme.place.stroke}88` : theme.sidebar.border,
                '--hover-border': `${theme.text.label}55`,
                backgroundColor: isActive ? `${theme.place.stroke}14` : 'transparent',
            }}
        >
            <LabIcon
                src={lab.icon}
                size={iconSize}
                className={`transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : isLocked ? 'opacity-40' : 'opacity-75 group-hover:opacity-100'
                }`}
            />

            {isLocked && (
                <span
                    className="absolute -bottom-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.sidebar.bg }}
                >
                    <LabIcon src={LAB_UI_ICONS.lock} size={11} className="opacity-80" />
                </span>
            )}
        </span>
    );
};
