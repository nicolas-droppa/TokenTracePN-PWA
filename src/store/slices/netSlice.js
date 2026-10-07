import { createPlace, createTransition, createArc } from '../../core/models';
import { isValidArc } from '../../core/petriEngine';

/**
 * Petri net model: places, transitions, arcs and actions that edit them.
 * @param {Function} set - Zustand set.
 * @param {Function} get - Zustand get.
 */
export const createNetSlice = (set, get) => ({
    places: [],
    transitions: [],
    arcs: [],
    counters: { place: 0, transition: 0 },

    /**
     * Creates and adds a new place to the store.
     * @param {number} x - The x-coordinate on canvas.
     * @param {number} y - The y-coordinate on canvas.
     */
    addPlace: (x, y) =>
        set((state) => {
            const n = state.counters.place + 1;
            return {
                places: [...state.places, createPlace(x, y, `P${n}`)],
                counters: { ...state.counters, place: n },
            };
        }),

    /**
     * Creates and adds a new transition to the store.
     * @param {number} x - The x-coordinate on canvas.
     * @param {number} y - The y-coordinate on canvas.
     */
    addTransition: (x, y) =>
        set((state) => {
            const n = state.counters.transition + 1;
            return {
                transitions: [...state.transitions, createTransition(x, y, `T${n}`)],
                counters: { ...state.counters, transition: n },
            };
        }),

    /**
     * Creates and adds a new arc connecting two elements if valid.
     * @param {string} sourceId - The source element ID.
     * @param {string} targetId - The target element ID.
     */
    addArc: (sourceId, targetId) => {
        const { places, transitions, arcs } = get();

        if (!isValidArc(sourceId, targetId, places, transitions)) return;

        const exists = arcs.some((a) => a.source === sourceId && a.target === targetId);
        if (exists) return;

        set((state) => ({ arcs: [...state.arcs, createArc(sourceId, targetId)] }));
    },

    /**
     * Updates the (x, y) coordinates of a specific place or transition.
     * @param {string} id - The ID of the node being moved.
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */
    updateNodePosition: (id, x, y) =>
        set((state) => ({
            places: state.places.map((p) => (p.id === id ? { ...p, x, y } : p)),
            transitions: state.transitions.map((t) => (t.id === id ? { ...t, x, y } : t)),
        })),

    /**
     * Function for any store element update.
     * @param {string} id - The ID of the element to update.
     * @param {Object} updatedData - Partial object containing updated properties (e.g., { tokens: 3 }).
     */
    updateElement: (id, updatedData) =>
        set((state) => {
            const update = (el) => (el.id === id ? { ...el, ...updatedData } : el);

            return {
                places: state.places.map(update),
                transitions: state.transitions.map(update),
                arcs: state.arcs.map(update),
                // editor slice – keep the selected copy in sync
                selectedElement:
                    state.selectedElement?.id === id
                        ? { ...state.selectedElement, ...updatedData }
                        : state.selectedElement,
            };
        }),

    /**
     * Removes a place, transition or arc. Deleting a node also removes
     * every incident arc.
     * @param {string} id - The ID of the element to delete.
     */
    deleteElement: (id) =>
        set((state) => {
            const isArc = state.arcs.some((a) => a.id === id);

            // editor slice – drop references to the deleted element
            const editor = {
                selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
                connectingSourceId: state.connectingSourceId === id ? null : state.connectingSourceId,
            };

            if (isArc) {
                return { ...editor, arcs: state.arcs.filter((a) => a.id !== id) };
            }

            return {
                ...editor,
                places: state.places.filter((p) => p.id !== id),
                transitions: state.transitions.filter((t) => t.id !== id),
                arcs: state.arcs.filter((a) => a.source !== id && a.target !== id),
            };
        }),
});
