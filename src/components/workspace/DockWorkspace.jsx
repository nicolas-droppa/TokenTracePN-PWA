import React, { useEffect, useRef } from 'react';
import { DockviewReact, themeDark, themeLight } from 'dockview-react';
import { useSettingsStore, useTheme } from '../../store/useSettingsStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { LAYOUT_VERSION } from '../../constants/workspace';
import { applyDefaultLayout } from '../../utils/dockLayout';
import { PANEL_COMPONENTS } from './panelComponents';
import './dockviewTheme.css';

const SAVE_DELAY_MS = 300;

/** App theme -> CSS variables read by dockviewTheme.css. */
const dockThemeVars = (theme) => ({
    '--tt-panel-bg': theme.sidebar.bg,
    '--tt-tabbar-bg': theme.sidebar.bg,
    '--tt-tab-active-bg': theme.bg,
    '--tt-border': theme.sidebar.border,
    '--tt-text-strong': theme.text.token,
    '--tt-text': theme.text.label,
    '--tt-text-muted': theme.disabled.text,
    '--tt-accent': theme.place.stroke,
    '--tt-accent-soft': `${theme.place.stroke}33`,
});

/** Restores the saved layout. */
const restoreLayout = (api) => {
    const saved = useSettingsStore.getState().workspaceLayout;
    if (saved?.version !== LAYOUT_VERSION) return false;

    try {
        api.fromJSON(saved.layout);
        return api.panels.length > 0;
    } catch {
        return false;
    }
};

/**
 * Desktop/tablet workspace.
 */
export const DockWorkspace = () => {
    const theme = useTheme();
    const activeTheme = useSettingsStore((s) => s.activeTheme);
    const setDockApi = useWorkspaceStore((s) => s.setDockApi);
    const cleanupRef = useRef(null);

    const handleReady = ({ api }) => {
        cleanupRef.current?.();

        if (!restoreLayout(api)) applyDefaultLayout(api);
        setDockApi(api);

        // Save the layout after the user stops interacting
        let timer;
        const subscription = api.onDidLayoutChange(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                useSettingsStore.getState().setWorkspaceLayout({ version: LAYOUT_VERSION, layout: api.toJSON() });
            }, SAVE_DELAY_MS);
        });

        cleanupRef.current = () => {
            clearTimeout(timer);
            subscription.dispose();
        };
    };

    useEffect(
        () => () => {
            cleanupRef.current?.();
            setDockApi(null);
        },
        [setDockApi]
    );

    return (
        <div className="tt-dock h-full w-full" style={dockThemeVars(theme)}>
            <DockviewReact
                components={PANEL_COMPONENTS}
                onReady={handleReady}
                theme={activeTheme === 'light' ? themeLight : themeDark}
            />
        </div>
    );
};
