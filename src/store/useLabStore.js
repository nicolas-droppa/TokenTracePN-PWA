import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LAB_STATUS } from '../constants/labs';

/**
 * Student progress in labs: open lab, written code, solved labs.
 */
export const useLabStore = create(
    persist(
        (set) => ({
            activeLabId: null,
            codeByLab: {},
            solvedLabs: [],

            toggleLab: (labId) =>
                set((state) => ({ activeLabId: state.activeLabId === labId ? null : labId })),

            openLab: (labId) => set({ activeLabId: labId }),

            closeLab: () => set({ activeLabId: null }),

            setLabCode: (labId, code) =>
                set((state) => ({ codeByLab: { ...state.codeByLab, [labId]: code } })),

            markSolved: (labId) =>
                set((state) =>
                    state.solvedLabs.includes(labId)
                        ? state
                        : { solvedLabs: [...state.solvedLabs, labId] }
                ),

            resetLab: (labId) =>
                set((state) => {
                    const { [labId]: _removed, ...rest } = state.codeByLab;
                    return { codeByLab: rest };
                }),
        }),
        {
            name: 'ttpn-analysis',
            version: 2,
            migrate: (persistedState) => {
                const state = persistedState ?? {};
                return {
                    codeByLab: state.codeByLab ?? state.codeByTask ?? {},
                    solvedLabs: state.solvedLabs
                        ?? state.solvedTasks
                        ?? state.unlockedTasks
                        ?? [],
                };
            },
            partialize: (state) => ({
                activeLabId: state.activeLabId,
                codeByLab: state.codeByLab,
                solvedLabs: state.solvedLabs,
            }),
        }
    )
);

/** Ids from lab.requires that are not solved yet. */
export const missingRequirements = (lab, solvedLabs) =>
    (lab.requires ?? []).filter((labId) => !solvedLabs.includes(labId));

/**
 * Status of one lab.
 * Solved stays solved (progress is never taken away), then locked by requirements,
 * then in progress when the code differs from the template.
 */
export const selectLabStatus = (lab) => (state) => {
    if (state.solvedLabs.includes(lab.id)) return LAB_STATUS.SOLVED;
    if (missingRequirements(lab, state.solvedLabs).length > 0) return LAB_STATUS.LOCKED;

    const code = state.codeByLab[lab.id];
    if (code !== undefined && code !== lab.template) return LAB_STATUS.IN_PROGRESS;

    return LAB_STATUS.TODO;
};
