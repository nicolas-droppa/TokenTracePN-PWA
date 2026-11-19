import React from 'react';
import { useTheme } from '../../store/useSettingsStore';
import { useAnalysisStore } from '../../store/useAnalysisStore';
import { APP_LAYOUT } from '../../constants/layout';
import { TASKS } from '../../tasks/taskRegistry';
import { AnalysisItem } from './components/AnalysisItem';

/**
 * Right-side bar with one icon per analysis task.
 */
export const AnalysisBar = () => {
    const theme = useTheme();
    const activeTaskId = useAnalysisStore((s) => s.activeTaskId);
    const toggleTask = useAnalysisStore((s) => s.toggleTask);

    return (
        <aside
            className="hidden shrink-0 flex-col items-center gap-1 border-l py-2 sm:flex"
            style={{
                width: APP_LAYOUT.ANALYSIS_BAR_WIDTH_PX,
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            {TASKS.map((task) => (
                <AnalysisItem
                    key={task.id}
                    task={task}
                    isActive={activeTaskId === task.id}
                    onClick={() => toggleTask(task.id)}
                />
            ))}
        </aside>
    );
};