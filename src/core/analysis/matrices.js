import { zeros } from '../../utils/array';

/**
 * Builds the input (pre) and output (post) matrices of the net.
 * Non regular arcs ignored.
 * @param {Object} net - Petri net.
 * @returns {{ places: string[], transitions: string[], input: number[][], output: number[][] }}
 */
export function buildIOMatrices(net) {
    const input = zeros(net.places.length, net.transitions.length);
    const output = zeros(net.places.length, net.transitions.length);

    const mapPlaceToRowIndex = new Map();
    const places = [];
    for (const place of net.places) {
        places.push(place.id);
        mapPlaceToRowIndex.set(place.id, mapPlaceToRowIndex.size);
    }

    const mapTransitionToColumnIndex = new Map();
    const transitions = [];
    for (const transition of net.transitions) {
        transitions.push(transition.id);
        mapTransitionToColumnIndex.set(transition.id, mapTransitionToColumnIndex.size);
    }

    for (const arc of net.arcs) {
        if (arc.arcType !== "regular") continue;

        // place -> transition
        const inputRow = mapPlaceToRowIndex.get(arc.source);
        const inputColumn = mapTransitionToColumnIndex.get(arc.target);
        if (inputRow !== undefined && inputColumn !== undefined) {
            input[inputRow][inputColumn] = arc.weight;
        }

        // transition -> place
        const outputRow = mapPlaceToRowIndex.get(arc.target);
        const outputColumn = mapTransitionToColumnIndex.get(arc.source);
        if (outputRow !== undefined && outputColumn !== undefined) {
            output[outputRow][outputColumn] = arc.weight;
        }
    }

    return {
        places,
        transitions,
        input,
        output,
    };
}