import { ARC_TYPE } from '../constants/net.js';

/**
 * Checks whether a transition is enabled under a given marking.
 * A transition with no input places is always enabled (source transition).
 * Each input arc is checked by its type (regular, read, inhibitor, reset).
 * @param {Object} net - The network structure ({ arcs }).
 * @param {Object<string, number>} marking - Token count per place ID.
 * @param {string} transitionId - The ID of the transition to check.
 * @returns {boolean} True if the transition is enabled.
 */
export const isEnabled = (net, marking, transitionId) =>
  net.arcs
    .filter((arc) => arc.target === transitionId)
    .every((arc) => isInputArcSatisfied(arc, marking[arc.source] ?? 0));

/**
 * Fires a transition, returning the resulting marking.
 * Returns null if the transition is not enabled.
 * Input arcs are applied by their type before output arcs add tokens.
 * @param {Object} net - The network structure ({ arcs }).
 * @param {Object<string, number>} marking - The current marking.
 * @param {string} transitionId - The ID of the transition to fire.
 * @returns {Object<string, number>|null} The new marking, or null.
 */
export const fire = (net, marking, transitionId) => {
  if (!isEnabled(net, marking, transitionId)) return null;

  const next = { ...marking };

  // Inputs first cause reset arc must not wipe tokens this firing produces
  for (const arc of net.arcs) {
    if (arc.target === transitionId) next[arc.source] = tokensAfterFiring(arc, next[arc.source] ?? 0);
  }

  for (const arc of net.arcs) {
    if (arc.source === transitionId) next[arc.target] = (next[arc.target] ?? 0) + arc.weight;
  }

  return next;
};

/**
 * Returns the IDs of all transitions enabled under the given marking.
 *
 * @param {Object} net - The network structure ({ transitions, arcs }).
 * @param {Object<string, number>} marking - The current marking.
 * @returns {Array<string>} IDs of enabled transitions.
 */
export const getEnabledTransitions = (net, marking) =>
  net.transitions.filter((t) => isEnabled(net, marking, t.id)).map((t) => t.id);

/**
 * Builds the initial marking from the places tokens.
 *
 * @param {Array<Object>} places - The list of places.
 * @returns {Object<string, number>} The initial marking.
 */
export const buildInitialMarking = (places) =>
  Object.fromEntries(places.map((p) => [p.id, p.tokens ?? 0]));

/**
 * Validates whether an arc can be created between a source and a target node (bipartite graph).
 *
 * @param {string} sourceId - The ID of the source node.
 * @param {string} targetId - The ID of the target node.
 * @param {Array<Object>} places - The list of all places in the network.
 * @param {Array<Object>} transitions - The list of all transitions in the network.
 * @returns {boolean} True if the connection is bipartite-valid, false otherwise.
 */
export const isValidArc = (sourceId, targetId, places, transitions) => {
  if (sourceId === targetId) return false;

  const isSourcePlace = places.some((p) => p.id === sourceId);
  const isTargetPlace = places.some((p) => p.id === targetId);

  const isSourceTransition = transitions.some((t) => t.id === sourceId);
  const isTargetTransition = transitions.some((t) => t.id === targetId);

  return (isSourcePlace && isTargetTransition) || (isSourceTransition && isTargetPlace);
};

function isInputArcSatisfied(arc, tokens) {
  switch (arc.arcType) {
    case ARC_TYPE.REGULAR:
      return tokens >= arc.weight;

    case ARC_TYPE.READ:
      return tokens >= arc.weight;

    case ARC_TYPE.INHIBITOR:
      return tokens < arc.weight;

    case ARC_TYPE.RESET:
      return true;
      
    default:
      return tokens >= arc.weight;
  }
}

function tokensAfterFiring(arc, tokens) {
  switch (arc.arcType) {
    case ARC_TYPE.REGULAR:
      return tokens - arc.weight;

    case ARC_TYPE.READ:
      return tokens;

    case ARC_TYPE.INHIBITOR:
      return tokens;

    case ARC_TYPE.RESET:
      return 0;

    default:
      return tokens - arc.weight;
  }
}
