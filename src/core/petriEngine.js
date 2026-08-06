/**
 * Checks if a transition can be fired based on the current places and arcs.
 *
 * @param {string} transitionId - The ID of the transition to check.
 * @param {Array<Object>} places - The list of all places in the network.
 * @param {Array<Object>} arcs - The list of all arcs in the network.
 * @returns {boolean} True if the transition can fire, false otherwise.
 */
export const canTransitionFire = (transitionId, places, arcs) => {
  const incomingArcs = arcs.filter((arc) => arc.target === transitionId);

  if (incomingArcs.length === 0) return false;

  return incomingArcs.every((arc) => {
    const sourcePlace = places.find((p) => p.id === arc.source);
    if (!sourcePlace) return false;
    return sourcePlace.tokens >= arc.weight;
  });
};

/**
 * Fires a transition and returns a new updated array of places.
 * Also changes tokens in adjacent places.
 *
 * @param {string} transitionId - The ID of the transition to fire.
 * @param {Array<Object>} places - The current list of places.
 * @param {Array<Object>} arcs - The list of all arcs in the network.
 * @returns {Array<Object>} A new array of updated places (immutably).
 */
export const fireTransition = (transitionId, places, arcs) => {
  if (!canTransitionFire(transitionId, places, arcs)) {
    return places;
  }

  const updatedPlaces = places.map((place) => ({ ...place }));

  const incomingArcs = arcs.filter((arc) => arc.target === transitionId);
  const outgoingArcs = arcs.filter((arc) => arc.source === transitionId);

  incomingArcs.forEach((arc) => {
    const place = updatedPlaces.find((p) => p.id === arc.source);
    if (place) {
      place.tokens -= arc.weight;
    }
  });

  outgoingArcs.forEach((arc) => {
    const place = updatedPlaces.find((p) => p.id === arc.target);
    if (place) {
      place.tokens += arc.weight;
    }
  });

  return updatedPlaces;
};

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

  const isPlaceToTransition = isSourcePlace && isTargetTransition;
  const isTransitionToPlace = isSourceTransition && isTargetPlace;

  return isPlaceToTransition || isTransitionToPlace;
};