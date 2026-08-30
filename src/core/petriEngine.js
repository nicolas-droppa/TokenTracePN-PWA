/**
 * Checks whether a transition is enabled under a given marking.
 * A transition with no input places is always enabled (source transition).
 *
 * @param {Object} net - The network structure ({ arcs }).
 * @param {Object<string, number>} marking - Token count per place ID.
 * @param {string} transitionId - The ID of the transition to check.
 * @returns {boolean} True if the transition is enabled.
 */
export const isEnabled = (net, marking, transitionId) =>
  net.arcs
    .filter((arc) => arc.target === transitionId)
    .every((arc) => (marking[arc.source] ?? 0) >= arc.weight);

/**
 * Fires a transition, returning the resulting marking.
 * Returns null if the transition is not enabled.
 *
 * @param {Object} net - The network structure ({ arcs }).
 * @param {Object<string, number>} marking - The current marking.
 * @param {string} transitionId - The ID of the transition to fire.
 * @returns {Object<string, number>|null} The new marking, or null.
 */
export const fire = (net, marking, transitionId) => {
  if (!isEnabled(net, marking, transitionId)) return null;

  const next = { ...marking };

  for (const arc of net.arcs) {
    if (arc.target === transitionId) next[arc.source] -= arc.weight;
    if (arc.source === transitionId) next[arc.target] += arc.weight;
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
 * Builds the initial marking from the places' initialTokens.
 *
 * @param {Array<Object>} places - The list of places.
 * @returns {Object<string, number>} The initial marking.
 */
export const buildInitialMarking = (places) =>
  Object.fromEntries(places.map((p) => [p.id, p.initialTokens ?? 0]));

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