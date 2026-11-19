import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../../constants/languages';
import { useSettingsStore, useTheme } from '../../../store/useSettingsStore';
import { MenuItem } from './MenuItem';

/**
 * Content of the Settings menu: list of languages to pick from.
 * @param {Function} onSelect - Called after a language is picked (closes the menu).
 */
export const LanguageMenu = ({ onSelect }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const language = useSettingsStore((s) => s.language);
    const setLanguage = useSettingsStore((s) => s.setLanguage);

    return (
        <>
            <div
                className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] font-semibold"
                style={{ color: theme.disabled.text }}
            >
                {t('language')}
            </div>

            {LANGUAGES.map(({ code, label }) => (
                <MenuItem
                    key={code}
                    label={label}
                    selected={code === language}
                    onClick={() => {
                        setLanguage(code);
                        onSelect();
                    }}
                />
            ))}
        </>
    );
};
