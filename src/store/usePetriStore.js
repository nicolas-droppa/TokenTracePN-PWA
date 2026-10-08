import { create } from 'zustand';
import { createNetSlice } from './slices/netSlice';
import { createEditorSlice } from './slices/editorSlice';
import { createSimulationSlice } from './slices/simulationSlice';
import { createCodeSlice } from './slices/codeSlice';

/**
 * Main application store, composed from slices.
 *
 * netSlice:        places, transitions, arcs and their editing actions
 * editorSlice:     active tool, selection, arc-connecting state
 * simulationSlice: mode, marking, history, firing transitions
 * codeSlice:       source code and its language
 */
export const usePetriStore = create((...args) => ({
    ...createNetSlice(...args),
    ...createEditorSlice(...args),
    ...createSimulationSlice(...args),
    ...createCodeSlice(...args),
}));
