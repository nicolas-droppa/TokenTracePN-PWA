import React, { useEffect, useRef } from 'react';
import { DockviewReact, themeDark, themeLight } from 'dockview-react';
import { useSettingsStore, useTheme } from '../../store/useSettingsStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { useLabStore } from '../../store/useLabStore';
import { LAYOUT_VERSION } from '../../constants/workspace';
import { applyDefaultLayout, pinnedWidths, restoreWidths, translatePanelTitles } from '../../utils/dockLayout';
import { PANEL_COMPONENTS } from './panelComponents';
import './dockviewTheme.css';

const SAVE_DELAY_MS = 300;

/** App theme -> CSS variables read by dockviewTheme.css. */
const dockThemeVars = (theme) => ({
    '--tt-panel-bg': theme.sidebar.bg,
    '--tt-tabbar-bg': theme.bg,
    '--tt-tab-active-bg': theme.sidebar.bg,
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
    const language = useSettingsStore((s) => s.language);
    const dockApi = useWorkspaceStore((s) => s.dockApi);
    const setDockApi = useWorkspaceStore((s) => s.setDockApi);
    const apiRef = useRef(null);
    const cleanupRef = useRef(null);

    /** Store listeners, returns their cleanup. */
    const subscribe = (api) => {
        let widths = pinnedWidths(api);
        let timer;

        const layoutSub = api.onDidLayoutChange(() => {
            // Remember widths the user set (by dragging), so they survive opening/closing the lab
            widths = pinnedWidths(api);

            // Save the layout after the user stops interacting
            clearTimeout(timer);
            timer = setTimeout(() => {
                useSettingsStore.getState().setWorkspaceLayout({ version: LAYOUT_VERSION, layout: api.toJSON() });
            }, SAVE_DELAY_MS);
        });

        // Dockview splits space evenly when a column comes or goes -> put the other columns back
        const addSub = api.onDidAddPanel((panel) => {
            if (panel.id === 'lab') restoreWidths(api, widths);
        });

        const removeSub = api.onDidRemovePanel((panel) => {
            if (panel.id !== 'lab') return;
            useLabStore.getState().closeLab(); // closing the lab panel closes the lab

            // The event comes before dockview removes the column -> restore once it is gone
            const saved = widths;
            queueMicrotask(() => restoreWidths(api, saved));
        });

        return () => {
            clearTimeout(timer);
            layoutSub.dispose();
            addSub.dispose();
            removeSub.dispose();
        };
    };

    const handleReady = ({ api }) => {
        cleanupRef.current?.();

        if (!restoreLayout(api)) applyDefaultLayout(api);
        translatePanelTitles(api);

        // Active lab is persisted, the restored layout may not contain the lab panel
        if (!api.getPanel('lab')) useLabStore.getState().closeLab();

        apiRef.current = api;
        setDockApi(api);
        cleanupRef.current = subscribe(api);
    };

    // Tab titles follow the selected language
    useEffect(() => {
        if (dockApi) translatePanelTitles(dockApi);
    }, [dockApi, language]);

    // StrictMode (dev) unmounts and mounts again without a new onReady -> reconnect the same api
    useEffect(() => {
        if (apiRef.current && !cleanupRef.current) {
            setDockApi(apiRef.current);
            cleanupRef.current = subscribe(apiRef.current);
        }

        return () => {
            cleanupRef.current?.();
            cleanupRef.current = null;
            setDockApi(null);
        };
    }, [setDockApi]);

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
