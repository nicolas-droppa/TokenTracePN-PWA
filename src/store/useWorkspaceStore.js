import { create } from 'zustand';
import { PANELS } from '../constants/workspace.js';
import { applyDefaultLayout, closePanel, revealPanel } from '../utils/dockLayout.js';

/**
 * Workspace state store.
 */
export const useWorkspaceStore = create((set, get) => ({
    dockApi: null,
    mobilePanel: PANELS[0].id,

    setDockApi: (dockApi) => set({ dockApi }),

    /**
     * Shows a panel – focuses or reopens it on desktop, switches to it on mobile.
     * @param {string} id - Panel id from PANELS.
     */
    showPanel: (id) => {
        const { dockApi } = get();
        if (dockApi) revealPanel(dockApi, id);
        else set({ mobilePanel: id });
    },

    /**
     * Hides a panel – closes it on desktop, falls back to first panel on mobile.
     * @param {string} id - Panel id from PANELS.
     */
    hidePanel: (id) => {
        const { dockApi, mobilePanel } = get();
        if (dockApi) closePanel(dockApi, id);
        else if (mobilePanel === id) set({ mobilePanel: PANELS[0].id });
    },

    /** 
     * Restores to default. 
     */
    resetLayout: () => {
        const { dockApi } = get();
        if (dockApi) applyDefaultLayout(dockApi);
        else set({ mobilePanel: PANELS[0].id });
    },
}));
