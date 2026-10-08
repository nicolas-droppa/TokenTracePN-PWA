import { useState } from 'react';
import { usePetriStore } from '../../store/usePetriStore.js';
import { TOOL_ORDER } from '../../constants/toolbar.js';
import { TOOL_SHORTCUTS, TOOLBAR_SHORTCUTS } from '../../constants/shortcuts.js';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts.js';

/**
 * State and actions of the canvas toolbar + keyboard shortcuts.
 * @returns {{
 *   selectedTool: string,
 *   currentId: string,
 *   isRunning: boolean,
 *   isCollapsed: boolean,
 *   selectTool: Function,
 *   stepTool: Function,
 *   toggleCollapsed: Function,
 * }}
 */
export const useToolbarControls = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const selectedTool = usePetriStore((s) => s.selectedTool);
    const selectTool = usePetriStore((s) => s.setSelectedTool);
    const isRunning = usePetriStore((s) => s.mode === 'run');

    const currentId = TOOL_ORDER.includes(selectedTool) ? selectedTool : TOOL_ORDER[0];

    const stepTool = (direction) => {
        const index = Math.max(TOOL_ORDER.indexOf(usePetriStore.getState().selectedTool), 0);
        selectTool(TOOL_ORDER[(index + direction + TOOL_ORDER.length) % TOOL_ORDER.length]);
    };

    const toggleCollapsed = () => setIsCollapsed((prev) => !prev);

    useKeyboardShortcuts([
        ...TOOL_ORDER.map((id) => ({
            codes: TOOL_SHORTCUTS[id],
            handler: () => selectTool(id),
            enabled: !isRunning,
        })),
        { codes: TOOLBAR_SHORTCUTS.previousTool, handler: () => stepTool(-1), enabled: !isRunning, repeat: true },
        { codes: TOOLBAR_SHORTCUTS.nextTool, handler: () => stepTool(1), enabled: !isRunning, repeat: true },
        { codes: TOOLBAR_SHORTCUTS.toggleCollapse, handler: toggleCollapsed },
    ]);

    return { selectedTool, currentId, isRunning, isCollapsed, selectTool, stepTool, toggleCollapsed };
};
