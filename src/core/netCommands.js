import { ATTRIBUTE_SCHEMA, PLACE_TO_TRANSITION_ONLY } from '../constants/dpn.js';
import { createPlace, createTransition, createArc, arcId, findElement } from './models.js';
import { matchesSchema, modelField } from './parsers/dpnSchema.js';
import { isValidArc } from './petriEngine.js';
import { ARC_TYPE } from '../constants/net';

/**
 * Commands made from users in UI, or from code in the editor.
 *
 * @typedef {(
 *   | { type: 'addPlace', id: string, x: number, y: number }
 *   | { type: 'addTransition', id: string, x: number, y: number }
 *   | { type: 'addArc', source: string, target: string, arcType?: string, weight?: number }
 *   | { type: 'updateArc', id: string, values: Object }
 *   | { type: 'moveNode', id: string, x: number, y: number }
 *   | { type: 'setAttribute', id: string, key: string, value: * }
 *   | { type: 'deleteElement', id: string }
 * )} NetCommand
 */

/**
 * Applies a command to the net.
 * @param {import('./models.js').Net} net
 * @param {NetCommand} command
 * @returns {import('./models.js').Net}
 */
export function applyCommand(net, command) {
    switch (command.type) {
        case 'addPlace':
            return addNode(net, 'places', createPlace({ ...command, x: round(command.x), y: round(command.y) }));
        case 'addTransition':
            return addNode(net, 'transitions', createTransition({ ...command, x: round(command.x), y: round(command.y) }));
        case 'addArc':
            return addArc(net, command);
        case 'updateArc':
            return updateArc(net, command);
        case 'moveNode':
            return updateNode(net, command.id, { x: round(command.x), y: round(command.y) });
        case 'setAttribute':
            return setAttribute(net, command);
        case 'deleteElement':
            return deleteElement(net, command.id);
        default:
            return net;
    }
}

// private

const round = (value) => Math.round(value);

function addNode(net, listName, node) {
    if (findElement(net, node.id)) return net; // name already taken
    return { ...net, [listName]: [...net[listName], node] };
}

function addArc(net, { source, target, arcType, weight }) {
    if (!isValidArc(source, target, net.places, net.transitions)) return net;
    if (findElement(net, arcId(source, target))) return net; // one arc per pair of nodes

    return { ...net, arcs: [...net.arcs, createArc({ source, target, arcType, weight })] };
}

function updateArc(net, { id, values }) {
    const arc = findElement(net, id);
    if (arc?.type !== 'arc') return net;

    if (PLACE_TO_TRANSITION_ONLY.has(values.type) && findElement(net, arc.source)?.type !== 'place') return net;

    const nextArc = { ...arc };
    for (const [key, value] of Object.entries(values)) {
        const expected = ATTRIBUTE_SCHEMA.arc?.[key];
        if (expected === undefined || !matchesSchema(value, expected)) return net;

        nextArc[modelField('arc', key)] = value;
    }

    if (nextArc.arcType === ARC_TYPE.RESET) nextArc.weight = 1;

    return { ...net, arcs: net.arcs.map((item) => (item.id === id ? nextArc : item)) };
}

function updateNode(net, id, changes) {
    const update = (node) => (node.id === id ? { ...node, ...changes } : node);
    const element = findElement(net, id);
    if (!element || element.type === 'arc') return net;

    return { ...net, places: net.places.map(update), transitions: net.transitions.map(update) };
}

function setAttribute(net, { id, key, value }) {
    const element = findElement(net, id);
    if (!element) return net;

    if (element.type === 'arc') return updateArc(net, { id, values: { [key]: value } });

    const expected = ATTRIBUTE_SCHEMA[element.type]?.[key];
    if (expected === undefined || !matchesSchema(value, expected)) return net;

    return updateNode(net, id, { [modelField(element.type, key)]: value });
}

function deleteElement(net, id) {
    const element = findElement(net, id);
    if (!element) return net;

    if (element.type === 'arc') return { ...net, arcs: net.arcs.filter((arc) => arc.id !== id) };

    return {
        places: net.places.filter((node) => node.id !== id),
        transitions: net.transitions.filter((node) => node.id !== id),
        arcs: net.arcs.filter((arc) => arc.source !== id && arc.target !== id),
    };
}
