import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ANALYSIS_TASK_STATUS } from '../constants/analysis';

/**
 * Student progress in analysis tasks: open task, written code, solved tasks.
 */
export const useAnalysisStore = create(
    persist(
        (set) => ({
            activeTaskId: null,
            codeByTask: {},
            solvedTasks: [],

            toggleTask: (taskId) =>
                set((state) => ({ activeTaskId: state.activeTaskId === taskId ? null : taskId })),

            setTaskCode: (taskId, code) =>
                set((state) => ({ codeByTask: { ...state.codeByTask, [taskId]: code } })),

            markSolved: (taskId) =>
                set((state) =>
                    state.solvedTasks.includes(taskId)
                        ? state
                        : { solvedTasks: [...state.solvedTasks, taskId] }
                ),

            resetTask: (taskId) =>
                set((state) => {
                    const { [taskId]: _removed, ...rest } = state.codeByTask;
                    return { codeByTask: rest };
                }),
        }),
        {
            name: 'ttpn-analysis',
            version: 1,
            migrate: (persistedState) => {
                const state = persistedState ?? {};
                return {
                    codeByTask: state.codeByTask ?? {},
                    solvedTasks: state.solvedTasks ?? state.unlockedTasks ?? [],
                };
            },
            partialize: (state) => ({
                codeByTask: state.codeByTask,
                solvedTasks: state.solvedTasks,
            }),
        }
    )
);

/** Ids from task.requires that are not solved yet. */
export const missingRequirements = (task, solvedTasks) =>
    (task.requires ?? []).filter((id) => !solvedTasks.includes(id));

/**
 * Status of one task.
 * Solved stays solved (progress is never taken away), then locked by requirements,
 * then in progress when the code differs from the template.
 */
export const selectTaskStatus = (task) => (state) => {
    if (state.solvedTasks.includes(task.id)) return ANALYSIS_TASK_STATUS.SOLVED;
    if (missingRequirements(task, state.solvedTasks).length > 0) return ANALYSIS_TASK_STATUS.LOCKED;

    const code = state.codeByTask[task.id];
    if (code !== undefined && code !== task.template) return ANALYSIS_TASK_STATUS.IN_PROGRESS;

    return ANALYSIS_TASK_STATUS.TODO;
};
