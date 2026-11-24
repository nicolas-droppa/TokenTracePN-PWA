import { useEffect } from 'react';

/**
 * Puts theme colors on <html> as CSS variables, for global CSS that cannot read theme
 * @param {Object} theme - Active theme.
 */
export const useThemeCssVars = (theme) => {
    useEffect(() => {
        const root = document.documentElement.style;
        root.setProperty('--tt-scrollbar-thumb', `${theme.text.label}2e`);
        root.setProperty('--tt-scrollbar-thumb-hover', `${theme.text.label}73`);
        root.setProperty('--tt-scrollbar-thumb-active', `${theme.text.label}a6`);
    }, [theme]);
};
