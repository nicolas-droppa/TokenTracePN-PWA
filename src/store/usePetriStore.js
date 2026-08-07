import { create } from 'zustand';
import { createPlace, createTransition, createArc } from '../core/models';
import { fireTransition, isValidArc } from '../core/petriEngine';
import { THEMES } from '../theme';

/**
 * @typedef {Object} PetriStore
 * @property {Array<Object>} places - List of all places in the network.
 * @property {Array<Object>} transitions - List of all transitions in the network.
 * @property {Array<Object>} arcs - List of all arcs connecting nodes.
 * @property {string} selectedTool - Currently active toolbar tool ('select' | 'place' | 'transition' | 'arc').
 * @property {Object|null} selectedElement - Currently selected node or arc for editing.
 */
export const usePetriStore = create((set, get) => ({
    // STATE

    places: [],
    transitions: [],
    arcs: [],
    selectedTool: 'select',
    selectedElement: null,
    activeTheme: 'dark',

    connectingSourceId: null,

    // ACTIONS
    
    /**
     * Begins the process of connecting a source node to a target.
     * @param {string} sourceId - 
     */
    startConnecting: (sourceId) => set({ connectingSourceId: sourceId }),

    /**
     * Cancels the current connection process, resetting the connecting source ID.
     */
    cancelConnecting: () => set({ connectingSourceId: null }),

    /**
     * Completes the connection process to a target node and creates an arc.
     * @param {string} targetId - ID of the target node.
     */
    finishConnecting: (targetId) => {
        const { connectingSourceId, addArc } = get();

        if (connectingSourceId) {
        // Zavolá tvoju existujúcu addArc akciu
        addArc(connectingSourceId, targetId);
        // Po vytvorení (alebo neúspešnej validácii) zrušíme prechodný stav
        set({ connectingSourceId: null });
        }
    },

    /**
     * Sets the active theme for the application.
     * @param {string} themeId - The identifier of the theme.
     */
    setTheme: (themeId) => set({ activeTheme: themeId }),

    /**
     * Selects the current theme object based on the activeTheme state.
     * @returns {Object} The theme object corresponding to the active theme.
     */
    getTheme: () => THEMES[get().activeTheme] || THEMES.dark,
    
    /**
     * Sets the active editing tool.
     * @param {string} tool - The tool identifier ('select', 'place', 'transition', 'arc').
     */
    setSelectedTool: (tool) => set({ selectedTool: tool }),

    /**
     * Sets the currently selected element in the UI.
     * @param {Object|null} element - The element object or null to deselect.
     */
    setSelectedElement: (element) => set({ selectedElement: element }),

    /**
     * Creates and adds a new place to the store.
     * @param {number} x - The x-coordinate on canvas.
     * @param {number} y - The y-coordinate on canvas.
     */
    addPlace: (x, y) => {
        const newPlace = createPlace(x, y, `P${get().places.length + 1}`);
        set((state) => ({ places: [...state.places, newPlace] }));
    },

    /**
     * Creates and adds a new transition to the store.
     * @param {number} x - The x-coordinate on canvas.
     * @param {number} y - The y-coordinate on canvas.
     */
    addTransition: (x, y) => {
        const newTransition = createTransition(x, y, `T${get().transitions.length + 1}`);
        set((state) => ({ transitions: [...state.transitions, newTransition] }));
    },

    /**
     * Creates and adds a new arc connecting two elements if valid.
     * @param {string} sourceId - The source element ID.
     * @param {string} targetId - The target element ID.
     */
    addArc: (sourceId, targetId) => {
        const { places, transitions } = get();

        if (!isValidArc(sourceId, targetId, places, transitions)) return

        const newArc = createArc(sourceId, targetId);
        set((state) => ({ arcs: [...state.arcs, newArc] }));
    },

    /**
     * Updates the (x, y) coordinates of a specific place or transition.
     * @param {string} id - The ID of the node being moved.
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */
    updateNodePosition: (id, x, y) => {
        set((state) => ({
        places: state.places.map((p) => (p.id === id ? { ...p, x, y } : p)),
        transitions: state.transitions.map((t) => (t.id === id ? { ...t, x, y } : t)),
        }));
    },

    /**
     * Attempts to fire a transition by ID and updates places if successful.
     * @param {string} transitionId - The ID of the transition to fire.
     */
    fire: (transitionId) => {
        const { places, arcs } = get();
        const updatedPlaces = fireTransition(transitionId, places, arcs);
        set({ places: updatedPlaces });
    },
}));