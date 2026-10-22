import { findElement } from '../../core/models';

/**
 * Editor UI state: active tool, selection and arc-connecting process.
 * @param {Function} set - Zustand set.
 * @param {Function} get - Zustand get.
 */
export const createEditorSlice = (set, get) => ({
    selectedTool: 'select',
    selectedId: null,
    connectingSourceId: null,

    /**
     * Sets the active editing tool.
     * @param {string} tool - The tool identifier ('select', 'place', 'transition', 'regular', …).
     */
    setSelectedTool: (tool) => set({ selectedTool: tool }),

    /**
     * Selects an element, or clears the selection.
     * @param {string|null} id
     */
    select: (id) => set({ selectedId: id ?? null }),

    /**
     * Begins the process of connecting a source node to a target.
     * @param {string} sourceId - ID of the source node.
     */
    startConnecting: (sourceId) => set({ connectingSourceId: sourceId }),

    /**
     * Cancels the current connection process.
     */
    cancelConnecting: () => set({ connectingSourceId: null }),

    /**
     * Completes the connection process to a target node and creates an arc.
     * @param {string} targetId - ID of the target node.
     */
    finishConnecting: (targetId) => {
        const { connectingSourceId, addArc } = get();
        if (!connectingSourceId) return;

        addArc(connectingSourceId, targetId); // net slice
        set({ connectingSourceId: null });
    },
});

export const selectSelectedElement = (state) => findElement(state, state.selectedId);
