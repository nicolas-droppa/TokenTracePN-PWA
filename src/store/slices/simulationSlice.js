import { fire as fireTransition, buildInitialMarking } from '../../core/petriEngine';
import { TOOLS } from '../../constants/tools';

/**
 * Simulation state: mode, current marking and firing history.
 * @param {Function} set - Zustand set.
 * @param {Function} get - Zustand get.
 */
export const createSimulationSlice = (set, get) => ({
    mode: 'edit',
    marking: null,
    history: [],

    /**
     * Enters simulation mode and initializes the marking and history.
     * Resets the editor so nothing can be edited while running.
     */
    startSimulation: () =>
        set((state) => ({
            mode: 'run',
            marking: buildInitialMarking(state.places),
            history: [],
            selectedTool: TOOLS.SELECT,
            selectedElement: null,
            connectingSourceId: null,
        })),

    /**
     * Returns to edit mode, discarding the current marking and history.
     */
    stopSimulation: () => set({ mode: 'edit', marking: null, history: [] }),

    /**
     * Fires a transition if it is enabled.
     * @param {string} transitionId - ID of the transition to fire.
     */
    fire: (transitionId) =>
        set((state) => {
            const net = { transitions: state.transitions, arcs: state.arcs };
            const next = fireTransition(net, state.marking, transitionId);
            if (!next) return {};

            return {
                marking: next,
                history: [...state.history, { transitionId, marking: state.marking }],
            };
        }),
});
