import React from 'react';
import { useTheme } from '../../store/useSettingsStore';
import { useLabStore } from '../../store/useLabStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { APP_LAYOUT } from '../../constants/layout';
import { LABS } from '../../labs/labRegistry';
import { LabBarItem } from './components/LabBarItem';

/**
 * Right-side bar with one icon per lab.
 */
export const LabBar = () => {
    const theme = useTheme();
    const activeLabId = useLabStore((s) => s.activeLabId);
    const toggleLab = useLabStore((s) => s.toggleLab);
    const showPanel = useWorkspaceStore((s) => s.showPanel);
    const hidePanel = useWorkspaceStore((s) => s.hidePanel);

    const handleToggleLab = (labId) => {
        const willClose = activeLabId === labId;
        toggleLab(labId);

        if (willClose) {
            hidePanel('lab');
        } else {
            showPanel('lab');
        }
    };

    return (
        <aside
            className="hidden shrink-0 flex-col items-center gap-1 border-l py-2 sm:flex"
            style={{
                width: APP_LAYOUT.LAB_BAR_WIDTH_PX,
                backgroundColor: theme.sidebar.bg,
                borderColor: theme.sidebar.border,
            }}
        >
            {LABS.map((lab) => (
                <LabBarItem
                    key={lab.id}
                    lab={lab}
                    isActive={activeLabId === lab.id}
                    onClick={() => handleToggleLab(lab.id)}
                />
            ))}
        </aside>
    );
};
