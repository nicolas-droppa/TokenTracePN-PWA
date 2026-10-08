import React from 'react';
import { useTheme } from '../../store/useSettingsStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { PANELS } from '../../constants/workspace';
import { PANEL_COMPONENTS } from './panelComponents';

/**
 * Phone workspace - one panel at a time, switched by bottombar.
 */
export const MobileWorkspace = () => {
    const theme = useTheme();
    const activeId = useWorkspaceStore((s) => s.mobilePanel);
    const showPanel = useWorkspaceStore((s) => s.showPanel);

    return (
        <div className="flex h-full w-full flex-col">
            <div className="relative min-h-0 flex-1">
                {PANELS.map(({ id }) => {
                    const Panel = PANEL_COMPONENTS[id];
                    const isActive = id === activeId;

                    return (
                        <div key={id} className={`absolute inset-0 ${isActive ? '' : 'invisible'}`} aria-hidden={!isActive}>
                            <Panel />
                        </div>
                    );
                })}
            </div>

            <nav
                className="flex shrink-0 border-t"
                style={{ backgroundColor: theme.sidebar.bg, borderColor: theme.sidebar.border }}
            >
                {PANELS.map(({ id, title }) => {
                    const isActive = id === activeId;

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => showPanel(id)}
                            aria-current={isActive ? 'page' : undefined}
                            className="flex-1 cursor-pointer py-2.5 text-[11px] font-medium transition-colors duration-150"
                            style={{
                                color: isActive ? theme.place.stroke : theme.text.label,
                                boxShadow: isActive ? `inset 0 2px 0 ${theme.place.stroke}` : 'none',
                            }}
                        >
                            {title}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
