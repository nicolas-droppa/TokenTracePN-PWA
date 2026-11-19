import React from 'react';
import { useTheme } from '../../../store/useSettingsStore';
import { ANALYSIS_TASK_STATUS } from '../../../constants/analysis';
import { useAnalysisStore, selectTaskStatus, missingRequirements } from '../../../store/useAnalysisStore';
import { getTask } from '../../../tasks/taskRegistry';

const STATUS_LABELS = {
    [ANALYSIS_TASK_STATUS.LOCKED]: 'Locked',
    [ANALYSIS_TASK_STATUS.TODO]: 'To do',
    [ANALYSIS_TASK_STATUS.IN_PROGRESS]: 'In progress',
    [ANALYSIS_TASK_STATUS.SOLVED]: 'Solved',
};

const getStatusColor = (status, theme) => {
    if (status === ANALYSIS_TASK_STATUS.SOLVED) return theme.status.run;
    if (status === ANALYSIS_TASK_STATUS.IN_PROGRESS) return theme.diagnostics.warning;
    if (status === ANALYSIS_TASK_STATUS.TODO) return theme.diagnostics.active;
    return theme.disabled.text;
};

/**
 * One icon in the analysis task bar.
 * @param {Object} props - Component props.
 * @param {Object} props.task - Analysis task with id, title, icon and description.
 * @param {boolean} props.isActive - Whether the task is currently active.
 * @param {Function} props.onClick - Click handler.
 */
export const AnalysisItem = ({ task, isActive = false, onClick }) => {
    const theme = useTheme();
    const status = useAnalysisStore(selectTaskStatus(task));
    const solvedTasks = useAnalysisStore((s) => s.solvedTasks);
    const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS[ANALYSIS_TASK_STATUS.LOCKED];

    let tooltip = `${task.title} [${statusLabel}]\n${task.description}`;
    if (status === ANALYSIS_TASK_STATUS.LOCKED) {
        const missing = missingRequirements(task, solvedTasks).map((id) => getTask(id)?.title ?? id);
        tooltip = `${task.title} [Locked]\nRequires: ${missing.join(', ')}`;
    }

    return (
        <button
            type="button"
            title={tooltip}
            aria-label={`${task.title}, ${statusLabel}`}
            aria-pressed={isActive}
            onClick={onClick}
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded transition-colors hover:bg-[var(--hover)]"
            style={{
                '--hover': `${theme.text.label}14`,
                backgroundColor: isActive ? `${theme.place.stroke}18` : 'transparent',
                color: status === ANALYSIS_TASK_STATUS.LOCKED ? theme.disabled.text : theme.text.label,
                opacity: status === ANALYSIS_TASK_STATUS.LOCKED ? 0.65 : 1,
                outline: isActive ? `1px solid ${theme.place.stroke}` : 'none',
            }}
        >
            <span
                className="flex h-10 w-10 items-center justify-center rounded-md border text-[11px] font-semibold"
                style={{ borderColor: isActive ? theme.place.stroke : theme.sidebar.border }}
            >
                {task.icon}
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
