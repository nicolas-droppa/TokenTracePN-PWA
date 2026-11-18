import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../theme';

export const useSettingsStore = create(
    persist(
        (set) => ({
            activeTheme: 'dark',
            setTheme: (activeTheme) => set({ activeTheme }),

            workspaceLayout: null,
            setWorkspaceLayout: (workspaceLayout) => set({ workspaceLayout }),

            hiddenMatrices: [],
            toggleMatrix: (key) =>
                set((state) => ({
                    hiddenMatrices: state.hiddenMatrices.includes(key)
                        ? state.hiddenMatrices.filter((k) => k !== key)
                        : [...state.hiddenMatrices, key],
                })),

            matrixCopyFormat: 'array',
            setMatrixCopyFormat: (matrixCopyFormat) => set({ matrixCopyFormat }),
        }),
        {
            name: 'petri-settings',
            partialize: (state) => ({
                activeTheme: state.activeTheme,
                workspaceLayout: state.workspaceLayout,
                hiddenMatrices: state.hiddenMatrices,
                matrixCopyFormat: state.matrixCopyFormat,
            }),
        }
    )
);

export const useTheme = () => useSettingsStore((s) => THEMES[s.activeTheme] ?? THEMES.dark);
