import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { useLabStore, selectLabStatus } from '../../../store/useLabStore';
import { labStatusColor } from '../../../utils/labStatusColor';

/**
 * Chip that opens another lab (used for missing requirements).
 * @param {Object} props
 * @param {Object} props.lab - Lab to open.
 */
export const LabLink = ({ lab }) => {
    const theme = useTheme();
    const status = useLabStore(selectLabStatus(lab));
    const openLab = useLabStore((s) => s.openLab);

    return (
        <button
            type="button"
            onClick={() => openLab(lab.id)}
            className="inline-flex h-[22px] cursor-pointer items-center gap-1.5 rounded-full border pl-2 pr-1 text-[11px] transition-colors hover:bg-[var(--hover)]"
            style={{
                borderColor: theme.sidebar.border,
                color: theme.text.code,
                '--hover': `${theme.text.label}14`,
            }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: labStatusColor(status, theme) }} />
            {lab.title}
            <span aria-hidden="true" style={{ color: theme.text.label }}></span>
        </button>
    );
};
