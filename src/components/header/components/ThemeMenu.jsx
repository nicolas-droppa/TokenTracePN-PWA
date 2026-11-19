import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, useTheme } from '../../../store/useSettingsStore';
import { THEMES } from '../../../theme';
import { MenuItem } from './MenuItem';

/**
 * Content of the Settings menu: list of themes to pick from.
 * @param {Function} onSelect - Called after a theme is picked (closes the menu).
 */
export const ThemeMenu = ({ onSelect }) => {
    const { t } = useTranslation('header');
    const theme = useTheme();
    const activeTheme = useSettingsStore((s) => s.activeTheme);
    const setTheme = useSettingsStore((s) => s.setTheme);

    return (
        <>
            <div
                className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] font-semibold"
                style={{ color: theme.disabled.text }}
            >
                {t('menus.theme')}
            </div>

            {Object.entries(THEMES).map(([themeKey, { label }]) => (
                <MenuItem
                    key={themeKey}
                    label={label}
                    selected={themeKey === activeTheme}
                    onClick={() => {
                        setTheme(themeKey);
                        onSelect();
                    }}
                />
            ))}
        </>
    );
};
