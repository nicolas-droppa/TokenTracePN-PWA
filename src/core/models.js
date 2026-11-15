/**
 * Petri net model - single source of truth
 *
 * @typedef {Object} Place
 * @property {string} id
 * @property {'place'} type
 * @property {number} x
 * @property {number} y
 * @property {string} label
 * @property {number} tokens
 *
 * @typedef {Object} Transition
 * @property {string} id
 * @property {'transition'} type
 * @property {number} x
 * @property {number} y
 * @property {string} label
 *
 * @typedef {Object} Arc
 * @property {string} id
 * @property {'arc'} type
 * @property {string} source
 * @property {string} target
 * @property {number} weight
 * @property {'regular'|'read'|'inhibitor'|'reset'} arcType
 *
 * @typedef {Object} Net
 * @property {Place[]} places
 * @property {Transition[]} transitions
 * @property {Arc[]} arcs
 */

import { ARC_TYPE, ARC_TYPES } from '../constants/net';
import { AUTO_LAYOUT } from '../constants/layout';

export const createPlace = ({ id, x = 0, y = 0, label = '', tokens = 0 }) => ({
    id,
    type: 'place',
    x,
    y,
    label,
    tokens: Math.max(0, Math.floor(Number(tokens) || 0)),
});

export const createTransition = ({ id, x = 0, y = 0, label = '' }) => ({
    id,
    type: 'transition',
    x,
    y,
    label,
});

export const createArc = ({ source, target, weight = 1, arcType = ARC_TYPE.REGULAR }) => {
    const normalizedType = ARC_TYPES.includes(arcType) ? arcType : ARC_TYPE.REGULAR;

    return {
        id: arcId(source, target),
        type: 'arc',
        source,
        target,
        weight: normalizedType === ARC_TYPE.RESET ? 1 : Math.max(1, Math.floor(Number(weight) || 1)),
        arcType: normalizedType,
    };
};

export const arcId = (source, target) => `${source}->${target}`;

/**
 * First free node name with the given prefix: p1, p2, ... .
 * @param {'p'|'t'} prefix
 * @param {{ places: Place[], transitions: Transition[] }} net
 * @returns {string}
 */
export const nextNodeId = (prefix, { places, transitions }) => {
    const used = new Set([...places, ...transitions].map((node) => node.id));
    let n = 1;
    while (used.has(`${prefix}${n}`)) n++;
    return `${prefix}${n}`;
};

/** Grid cell = order of the declaration, so moving another node never shifts this one. */
export const autoPosition = (index) => {
    return {
        x: AUTO_LAYOUT.ORIGIN_X + (index % AUTO_LAYOUT.COLUMNS) * AUTO_LAYOUT.SPACING,
        y: AUTO_LAYOUT.ORIGIN_Y - Math.floor(index / AUTO_LAYOUT.COLUMNS) * AUTO_LAYOUT.SPACING,
    };
};

/**
 * First free auto-layout cell after the existing nodes.
 * @param {{ places: Place[], transitions: Transition[] }} net
 * @returns {{ x: number, y: number }}
 */
export const nextFreeCell = ({ places = [], transitions = [] }) => {
    const nodes = [...places, ...transitions];
    const used = new Set(nodes.map((node) => `${node.x},${node.y}`));

    for (let index = nodes.length; ; index++) {
        const position = autoPosition(index);
        if (!used.has(`${position.x},${position.y}`)) return position;
    }
};

export const displayName = (node) => node.label || node.id;

/**
 * Finds a place, transition or arc by id.
 * @param {{ places: Place[], transitions: Transition[], arcs: Arc[] }} net - The net (or the store state).
 * @param {string|null} id
 * @returns {Place|Transition|Arc|null}
 */
export const findElement = (net, id) => {
    if (id == null) return null;
    return (
        net.places.find((el) => el.id === id) ??
        net.transitions.find((el) => el.id === id) ??
        net.arcs.find((el) => el.id === id) ??
        null
    );
};
