import React from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { THEMES } from '../../theme';
import { CodeCheckerPanel } from '../panels/CodeCheckerPanel';

export const BottomBar = ({ code = '', language = 'dpn' }) => {
    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    return (
        <div
            className="h-full flex flex-col"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderTop: `1px solid ${theme.sidebar.border}`,
            }}
        >
            <div className="flex-1 min-h-0 overflow-hidden">
                <CodeCheckerPanel theme={theme} code={code} language={language} />
            </div>
        </div>
    );
};

export default BottomBar;
