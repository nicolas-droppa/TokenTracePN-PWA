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

    setSelectedTool: (tool) => set({ selectedTool: tool }),

    select: (id) => set({ selectedId: id ?? null }),

    startConnecting: (sourceId) => set({ connectingSourceId: sourceId }),

    cancelConnecting: () => set({ connectingSourceId: null }),

    finishConnecting: (targetId) => {
        const { connectingSourceId, addArc } = get();
        if (!connectingSourceId) return;

        addArc(connectingSourceId, targetId);
        set({ connectingSourceId: null });
    },
});

export const selectSelectedElement = (state) => findElement(state, state.selectedId);
