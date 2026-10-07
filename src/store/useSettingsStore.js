import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../theme';

export const useSettingsStore = create(
    persist(
        (set) => ({
            activeTheme: 'dark',
            setTheme: (activeTheme) => set({ activeTheme }),
        }),
        { name: 'petri-settings' }
    )
);

export const useTheme = () => useSettingsStore((s) => THEMES[s.activeTheme] ?? THEMES.dark);