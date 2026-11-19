import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../theme';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';

/**
 * First browser language the app supports otherwise the default.
 */
const detectLanguage = () => {
    const preferred = navigator.languages ?? [navigator.language];
    const codes = preferred.map((lang) => lang?.slice(0, 2));
    return codes.find((code) => LANGUAGES.some((l) => l.code === code)) ?? DEFAULT_LANGUAGE;
};

export const useSettingsStore = create(
    persist(
        (set) => ({
            activeTheme: 'dark',
            setTheme: (activeTheme) => set({ activeTheme }),

            language: detectLanguage(),
            setLanguage: (language) => set({ language }),

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
                language: state.language,
                workspaceLayout: state.workspaceLayout,
                hiddenMatrices: state.hiddenMatrices,
                matrixCopyFormat: state.matrixCopyFormat,
            }),
        }
    )
);

export const useTheme = () => useSettingsStore((s) => THEMES[s.activeTheme] ?? THEMES.dark);
