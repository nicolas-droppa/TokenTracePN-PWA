import { ARC_DIRECTION } from '../constants/matrices';
import { ARC_TYPE } from '../constants/net';
import { arcId } from './models';

/**
 * Builds the net command for a matrix cell edit.
 *
 * @param {{ arcs: Array<{ id: string, arcType: string }> }} net
 * @param {{ arcType: string, direction: string }} view
 * @param {string} placeId
 * @param {string} transitionId
 * @param {number|string} value
 * @returns {{ type: string, id?: string, source?: string, target?: string, arcType?: string, weight?: number } | null}
 */
export function cellCommand(net, view, placeId, transitionId, value) {
    const [source, target] = view.direction === ARC_DIRECTION.PLACE_TO_TRANSITION ? [placeId, transitionId] : [transitionId, placeId];
    const weight = Number(value);

    if (!Number.isInteger(weight) || weight < 0) return null;

    const id = arcId(source, target);
    const arc = net.arcs.find((a) => a.id === id);

    if (!arc) {
        return weight > 0 ? { type: 'addArc', source, target, arcType: view.arcType, weight } : null;
    }
    if (arc.arcType !== view.arcType) {
        return weight > 0 ? { type: 'updateArc', id, values: { type: view.arcType, weight } } : null;
    }
    if (weight === 0) {
        return { type: 'deleteElement', id };
    }
    if (view.arcType === ARC_TYPE.RESET) {
        return null;
    }

    return { type: 'setAttribute', id, key: 'weight', value: weight };
}
