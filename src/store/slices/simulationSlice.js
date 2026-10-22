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

    startSimulation: () =>
        set((state) => ({
            mode: 'run',
            marking: buildInitialMarking(state.places),
            history: [],
            selectedTool: TOOLS.SELECT,
            selectedId: null,
            connectingSourceId: null,
        })),

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
