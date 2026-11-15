import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createNetSlice } from './slices/netSlice';
import { createEditorSlice } from './slices/editorSlice';
import { createSimulationSlice } from './slices/simulationSlice';
import { createCodeSlice } from './slices/codeSlice';
import { netFromCode } from '../core/parsers/dpn';

/**
 * Main application store, composed from slices.
 *
 * netSlice:        places, transitions, arcs and their editing actions
 * editorSlice:     active tool, selection, arc-connecting state
 * simulationSlice: mode, marking, history, firing transitions
 * codeSlice:       source code and its language
 */
export const usePetriStore = create(
    persist((...args) => ({
        ...createNetSlice(...args),
        ...createEditorSlice(...args),
        ...createSimulationSlice(...args),
        ...createCodeSlice(...args),
    }), {
        name: 'ttpn-net',
        version: 1,
        partialize: (state) => ({ code: state.code, language: state.language }),
        onRehydrateStorage: () => (state) => {
            if (!state || state.language !== 'dpn' || !state.code) return;

            const { net } = netFromCode(state.code);
            if (net) {
                state.setNet(net);
            }
        },
    })
);
