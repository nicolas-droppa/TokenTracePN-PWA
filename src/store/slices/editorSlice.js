import { findElement } from '../../core/models';

/**
 * Editor UI state: active tool, selection and arc-connecting process.
 * @param {Function} set - Zustand set.
 * @param {Function} get - Zustand get.
 */
export const createEditorSlice = (set, get) => ({
    selectedTool: 'select',
    selectedId: null,
    inspectedId: null,
    connectingSourceId: null,

    setSelectedTool: (tool) => set({ selectedTool: tool }),

    select: (id) => set({ selectedId: id ?? null }),

    /**
     * Opens the inspector for a given element and selects it.
     * @param {string} id - ID of the element to inspect.
     */
    openInspector: (id) => set({ inspectedId: id, selectedId: id }),

    closeInspector: () => set({ inspectedId: null }),

    startConnecting: (sourceId) => set({ connectingSourceId: sourceId }),

    cancelConnecting: () => set({ connectingSourceId: null }),

    finishConnecting: (targetId, arcType) => {
        const { connectingSourceId, addArc } = get();
        if (!connectingSourceId) return;

        addArc(connectingSourceId, targetId, arcType);
        set({ connectingSourceId: null });
    },
});

export const selectSelectedElement = (state) => findElement(state, state.selectedId);

export const selectInspectedElement = (state) => findElement(state, state.inspectedId);
