import { create } from 'zustand';
import { PANELS } from '../constants/workspace.js';
import { applyDefaultLayout, revealPanel } from '../utils/dockLayout.js';

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
     * Restores to default. 
     */
    resetLayout: () => {
        const { dockApi } = get();
        if (dockApi) applyDefaultLayout(dockApi);
        else set({ mobilePanel: PANELS[0].id });
    },
}));
