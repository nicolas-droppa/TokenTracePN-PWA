import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useSettingsStore } from '../../store/useSettingsStore';
import { THEMES } from '../../theme';
import { LAYOUT_CONFIG } from '../../constants/layout';
import { PanelDivider } from './PanelDivider';
import { CodeEditorPanel } from '../panels/CodeEditorPanel';
import { ElementInspector } from '../panels/ElementInspector';

export const Sidebar = ({ code, setCode, language, setLanguage }) => {
    const activeThemeKey = useSettingsStore((state) => state.activeTheme);
    const theme = THEMES[activeThemeKey] || THEMES.dark;

    return (
        <aside
            className="w-80 h-full flex flex-col shrink-0 select-none border-r transition-colors duration-200"
            style={{
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            <Group 
                orientation="vertical" 
                style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {/* Code Editor */}
                <Panel
                    defaultSize={LAYOUT_CONFIG.CODE_PANEL_DEFAULT_SIZE_PERCENT}
                    minSize={LAYOUT_CONFIG.MIN_PANEL_SIZE_PX}
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <CodeEditorPanel code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
                </Panel>

                {/* Separator */}
                <Separator
                    className="w-full transition-colors cursor-row-resize flex items-center justify-center shrink-0 group"
                    style={{
                        backgroundColor: theme.sidebar.resizeHandle,
                        height: '0.375rem',
                    }}
                >
                    <PanelDivider
                        theme={theme}
                        height="0.375rem"
                        cursor="row-resize"
                        innerBarWidth="2rem"
                        innerBarHeight="0.125rem"
                        style={{ backgroundColor: 'transparent' }}
                    />
                </Separator>

                {/* Inspector */}
                <Panel
                    defaultSize={LAYOUT_CONFIG.INSPECTOR_PANEL_DEFAULT_SIZE_PERCENT}
                    minSize={LAYOUT_CONFIG.MIN_PANEL_SIZE_PX}
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <ElementInspector />
                </Panel>
            </Group>
        </aside>
    );
};