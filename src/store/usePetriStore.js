import { create } from 'zustand';
import { createNetSlice } from './slices/netSlice';
import { createEditorSlice } from './slices/editorSlice';
import { createSimulationSlice } from './slices/simulationSlice';

/**
 * Main application store, composed from slices.
 *
 * netSlice:        places, transitions, arcs and their editing actions
 * editorSlice:     active tool, selection, arc-connecting state
 * simulationSlice: mode, marking, history, firing transitions
 */
export const usePetriStore = create((...args) => ({
    ...createNetSlice(...args),
    ...createEditorSlice(...args),
    ...createSimulationSlice(...args),
}));
