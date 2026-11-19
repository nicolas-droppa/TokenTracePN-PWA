import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { LAB_STATUS } from '../../../constants/labs';
import { useLabStore, selectLabStatus, missingRequirements } from '../../../store/useLabStore';
import { getLab } from '../../../labs/labRegistry';

const STATUS_LABELS = {
    [LAB_STATUS.LOCKED]: 'Locked',
    [LAB_STATUS.TODO]: 'To do',
    [LAB_STATUS.IN_PROGRESS]: 'In progress',
    [LAB_STATUS.SOLVED]: 'Solved',
};

const getStatusColor = (status, theme) => {
    if (status === LAB_STATUS.SOLVED) return theme.status.run;
    if (status === LAB_STATUS.IN_PROGRESS) return theme.diagnostics.warning;
    if (status === LAB_STATUS.TODO) return theme.diagnostics.active;
    return theme.disabled.text;
};

/**
 * One icon in the lab bar.
 * @param {Object} props - Component props.
 * @param {Object} props.lab - Lab with id, title, icon and description.
 * @param {boolean} props.isActive - Whether the lab is currently active.
 * @param {Function} props.onClick - Click handler.
 */
export const LabBarItem = ({ lab, isActive = false, onClick }) => {
    const theme = useTheme();
    const status = useLabStore(selectLabStatus(lab));
    const solvedLabs = useLabStore((s) => s.solvedLabs);
    const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS[LAB_STATUS.LOCKED];

    let tooltip = `${lab.title} [${statusLabel}]\n${lab.description}`;
    if (status === LAB_STATUS.LOCKED) {
        const missing = missingRequirements(lab, solvedLabs).map((labId) => getLab(labId)?.title ?? labId);
        tooltip = `${lab.title} [Locked]\nRequires: ${missing.join(', ')}`;
    }

    return (
        <button
            type="button"
            title={tooltip}
            aria-label={`${lab.title}, ${statusLabel}`}
            aria-pressed={isActive}
            onClick={onClick}
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded transition-colors hover:bg-[var(--hover)]"
            style={{
                '--hover': `${theme.text.label}14`,
                backgroundColor: isActive ? `${theme.place.stroke}18` : 'transparent',
                color: status === LAB_STATUS.LOCKED ? theme.disabled.text : theme.text.label,
                opacity: status === LAB_STATUS.LOCKED ? 0.65 : 1,
                outline: isActive ? `1px solid ${theme.place.stroke}` : 'none',
            }}
        >
            <span
                className="flex h-10 w-10 items-center justify-center rounded-md border text-[11px] font-semibold"
                style={{ borderColor: isActive ? theme.place.stroke : theme.sidebar.border }}
            >
                {lab.icon}
            </span>
            <span
                className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full border"
                style={{
                    backgroundColor: getStatusColor(status, theme),
                    borderColor: theme.sidebar.bg,
                }}
                aria-hidden="true"
            />
        </button>
    );
};
