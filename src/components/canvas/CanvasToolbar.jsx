import React from 'react';
import { useTheme } from '../../store/useSettingsStore.js';
import { TOOL_GROUPS } from '../../constants/toolbar.js';
import { TOOL_SHORTCUTS, TOOLBAR_SHORTCUTS } from '../../constants/shortcuts.js';
import { shortcutLabel, withShortcut } from '../../utils/keyboard.js';
import { useToolbarControls } from '../../hooks/canvas/useToolbarControls.js';
import { Collapsible } from '../ui/Collapsible.jsx';
import { ToolButton } from './components/ToolButton.jsx';
import { ToolbarButton } from './components/ToolbarButton.jsx';
import { ToolbarDivider } from './components/ToolbarDivider.jsx';

const CollapseIcon = ({ isCollapsed }) => (
    <svg
        className={`h-3.5 w-3.5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M7 11l5-5 5 5M7 18l5-5 5 5" />
    </svg>
);

export const CanvasToolbar = () => {
    const theme = useTheme();
    const { selectedTool, currentId, isRunning, isCollapsed, selectTool, stepTool, toggleCollapsed } =
        useToolbarControls();

    return (
        <div
            className="absolute left-4 top-4 z-10 flex max-h-[calc(100%-2rem)] w-16 select-none flex-col overflow-y-auto rounded-lg border p-1.5 shadow-lg backdrop-blur-md transition-colors duration-200"
            style={{
                backgroundColor: `${theme.sidebar.bg}cc`,
                borderColor: theme.sidebar.border,
            }}
        >
            {TOOL_GROUPS.map((group, groupIndex) => (
                <React.Fragment key={group[0].id}>
                    {groupIndex > 0 && (
                        <Collapsible open={!isCollapsed}>
                            <ToolbarDivider />
                        </Collapsible>
                    )}

                    {group.map((tool) => {
                        const isVisible = !isCollapsed || tool.id === currentId;

                        return (
                            <Collapsible key={tool.id} open={isVisible}>
                                <div className="py-0.5">
                                    <ToolButton
                                        tool={tool}
                                        shortcut={shortcutLabel(TOOL_SHORTCUTS[tool.id])}
                                        isActive={!isRunning && selectedTool === tool.id}
                                        disabled={isRunning}
                                        focusable={isVisible}
                                        onSelect={() => selectTool(tool.id)}
                                    />
                                </div>
                            </Collapsible>
                        );
                    })}
                </React.Fragment>
            ))}

            <Collapsible open={!isCollapsed}>
                <ToolbarDivider />
            </Collapsible>

            <Collapsible open={isCollapsed}>
                <div className="flex gap-1 py-0.5">
                    <ToolbarButton
                        className="flex-1"
                        onClick={() => stepTool(-1)}
                        disabled={isRunning}
                        tabIndex={isCollapsed ? 0 : -1}
                        title={withShortcut('Previous tool', TOOLBAR_SHORTCUTS.previousTool)}
                        aria-keyshortcuts={shortcutLabel(TOOLBAR_SHORTCUTS.previousTool)}
                    >
                        ↑
                    </ToolbarButton>
                    <ToolbarButton
                        className="flex-1"
                        onClick={() => stepTool(1)}
                        disabled={isRunning}
                        tabIndex={isCollapsed ? 0 : -1}
                        title={withShortcut('Next tool', TOOLBAR_SHORTCUTS.nextTool)}
                        aria-keyshortcuts={shortcutLabel(TOOLBAR_SHORTCUTS.nextTool)}
                    >
                        ↓
                    </ToolbarButton>
                </div>
            </Collapsible>

            <ToolbarButton
                className="mt-0.5 w-full shrink-0"
                onClick={toggleCollapsed}
                title={withShortcut(isCollapsed ? 'Expand toolbar' : 'Collapse toolbar', TOOLBAR_SHORTCUTS.toggleCollapse)}
                aria-keyshortcuts={shortcutLabel(TOOLBAR_SHORTCUTS.toggleCollapse)}
                aria-expanded={!isCollapsed}
            >
                <CollapseIcon isCollapsed={isCollapsed} />
            </ToolbarButton>
        </div>
    );
};
