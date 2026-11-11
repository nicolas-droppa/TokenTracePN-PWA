import { ARC_TYPE } from '../../constants/net';
import { PLACE_SIDE } from '../../constants/matrices';
import { zeros } from '../../utils/array';

/**
 * Creates index maps for places and transitions for easy lookup.
 * @param {Object} net - The Petri net.
 * @returns {{ places: string[], transitions: string[], mapPlaceToRow: Map<string, number>, mapTransitionToCol: Map<string, number> }}
 */
const createIndexMaps = (net) => {
    const mapPlaceToRow = new Map();
    const places = [];
    for (const place of net.places) {
        places.push(place.id);
        mapPlaceToRow.set(place.id, mapPlaceToRow.size);
    }

    const mapTransitionToCol = new Map();
    const transitions = [];
    for (const transition of net.transitions) {
        transitions.push(transition.id);
        mapTransitionToCol.set(transition.id, mapTransitionToCol.size);
    }

    return { places, transitions, mapPlaceToRow, mapTransitionToCol };
};

const buildArcMatrix = (net, maps, arcType, placeIs, fillValue = 0) => {
    const matrix = zeros(net.places.length, net.transitions.length, fillValue);

    for (const arc of net.arcs) {
        if (arc.arcType !== arcType) continue;

        const placeId = placeIs === PLACE_SIDE.SOURCE ? arc.source : arc.target;
        const transitionId = placeIs === PLACE_SIDE.SOURCE ? arc.target : arc.source;
        const row = maps.mapPlaceToRow.get(placeId);
        const col = maps.mapTransitionToCol.get(transitionId);

        if (row !== undefined && col !== undefined) {
            const arcValue = arcType === ARC_TYPE.RESET ? 1 : Number.isFinite(arc.weight) ? arc.weight : 1;
            matrix[row][col] = arcValue;
        }
    }

    return matrix;
};

export function buildMatrices(net) {
    const maps = createIndexMaps(net);

    const input = buildArcMatrix(net, maps, ARC_TYPE.REGULAR, PLACE_SIDE.SOURCE);
    const output = buildArcMatrix(net, maps, ARC_TYPE.REGULAR, PLACE_SIDE.TARGET);
    const read = buildArcMatrix(net, maps, ARC_TYPE.READ, PLACE_SIDE.SOURCE);
    const inhibitor = buildArcMatrix(net, maps, ARC_TYPE.INHIBITOR, PLACE_SIDE.SOURCE, Infinity);
    const reset = buildArcMatrix(net, maps, ARC_TYPE.RESET, PLACE_SIDE.SOURCE);

    return { input, output, read, inhibitor, reset };
}
