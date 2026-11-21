import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/useSettingsStore';
import { THEMES } from '../../theme';
import { useCodeEditor } from '../../hooks/editor/useCodeEditor';

export const CodeEditorPanel = ({ code, setCode, language, setLanguage }) => {
    const { t } = useTranslation('codeEditor');
    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;
    const isDark = String(activeThemeKey || 'dark').toLowerCase().includes('dark');

    const { hostRef } = useCodeEditor({ code, setCode, language, theme, isDark });

    return (
        <div
            className="flex flex-col h-full transition-colors duration-200"
            style={{ backgroundColor: theme.sidebar.inputBg }}
        >
            <div
                className="flex items-center justify-between px-4 py-2 border-b text-xs font-semibold"
                style={{ borderColor: theme.sidebar.border, color: theme.text.label, backgroundColor: theme.sidebar.bg }}
            >
                <span>{t('code')}</span>
                <div className="text-[10px] uppercase" style={{ color: theme.disabled.text }}>
                    <label htmlFor="code-language" className="sr-only">{t('codeLanguage')}</label>
                    <select
                        id="code-language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                            backgroundColor: theme.sidebar.inputBg,
                            color: theme.disabled.text,
                            border: `1px solid ${theme.sidebar.border}`,
                        }}
                    >
                        <option value="dpn">{t('dpn')}</option>
                        <option value="dot">{t('dot')}</option>
                    </select>
                </div>
            </div>

            <div ref={hostRef} className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: 120 }} />
        </div>
    );
};

export default CodeEditorPanel;
