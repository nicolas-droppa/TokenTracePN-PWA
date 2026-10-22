import { findElement, nextNodeId } from '../../core/models';
import { applyCommand } from '../../core/netCommands';
import { applyCommandToCode } from '../../core/parsers/dpnEdits';

/**
 * The net part of the store state.
 * @param {Object} state - The store state.
 * @returns {Object} The net part of the store state.
 */
const netOf = (state) => ({ places: state.places, transitions: state.transitions, arcs: state.arcs });

/**
 * Editor references (selection, arc being drawn) that still point to an existing element.
 */
const editorRefs = (state, net) => ({
    selectedId: findElement(net, state.selectedId) ? state.selectedId : null,
    connectingSourceId: findElement(net, state.connectingSourceId) ? state.connectingSourceId : null,
});

/**
 * Petri net model: places, transitions, arcs and the commands that change them.
 * @param {Function} set - Zustand set.
 * @param {Function} get - Zustand get.
 */
export const createNetSlice = (set, get) => ({
    places: [],
    transitions: [],
    arcs: [],

    /**
     * Replaces the whole net at once (when the code is rebuilt into a net).
     * @param {import('../../core/models').Net} net
     */
    setNet: (net) =>
        set((state) => {
            if (state.mode === 'run') return {};
            return { ...net, ...editorRefs(state, net) };
        }),

    /**
     * Single entry point for every change of petri net made from the UI.
     * @param {import('../../core/netCommands').NetCommand} command
     */
    execute: (command) =>
        set((state) => {
            if (state.mode === 'run') return {};

            const current = netOf(state);
            const next = applyCommand(current, command);
            if (next === current) return {};

            if (state.language !== 'dpn') return { ...next, ...editorRefs(state, next) };

            const code = applyCommandToCode(state.code, command);
            if (code === null) return {};

            return { ...next, ...editorRefs(state, next), code };
        }),

    // wrappers - each one builds a command and executes it.

    addPlace: (x, y) => get().execute({ type: 'addPlace', id: nextNodeId('p', get()), x, y }),

    addTransition: (x, y) => get().execute({ type: 'addTransition', id: nextNodeId('t', get()), x, y }),

    addArc: (source, target, arcType = 'regular') => get().execute({ type: 'addArc', source, target, arcType }),

    moveNode: (id, x, y) => get().execute({ type: 'moveNode', id, x, y }),

    setAttribute: (id, key, value) => get().execute({ type: 'setAttribute', id, key, value }),

    deleteElement: (id) => get().execute({ type: 'deleteElement', id }),
});
