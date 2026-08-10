import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { usePetriStore } from '../../store/usePetriStore';
import { THEMES } from '../../theme';
import { SIDEBAR_CONFIG } from '../../constants/layout';
import { CodeEditorPanel } from './CodeEditorPanel';
import { ElementInspector } from './ElementInspector';

export const Sidebar = () => {
    const activeThemeKey = usePetriStore((state) => state.activeTheme);
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
                    defaultSize={SIDEBAR_CONFIG.CODE_PANEL_DEFAULT_SIZE_PERCENT}
                    minSize={SIDEBAR_CONFIG.MIN_PANEL_SIZE_PX}
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <CodeEditorPanel />
                </Panel>

                {/* Separator */}
                <Separator
                    className="h-1.5 w-full transition-colors cursor-row-resize flex items-center justify-center shrink-0 group"
                    style={{ backgroundColor: theme.sidebar.resizeHandle }}
                >
                    <div
                        className="w-8 h-0.5 rounded-full transition-colors group-hover:bg-sky-500"
                        style={{ backgroundColor: theme.disabled.stroke }}
                    />
                </Separator>

                {/* Inspector */}
                <Panel
                    defaultSize={SIDEBAR_CONFIG.INSPECTOR_PANEL_DEFAULT_SIZE_PERCENT}
                    minSize={SIDEBAR_CONFIG.MIN_PANEL_SIZE_PX}
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <ElementInspector />
                </Panel>
            </Group>
        </aside>
    );
};