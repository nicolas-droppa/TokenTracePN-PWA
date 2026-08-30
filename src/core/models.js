/**
 * Function to create a new place object with the given parameters.
 * @param {number} x - The x-coordinate of the place.
 * @param {number} y - The y-coordinate of the place.
 * @param {string} label - The label for the place.
 * @param {number} initialTokens - The number of tokens in the initial marking.
 */
export const createPlace = (x, y, label = '', initialTokens = 0) => ({
  id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  type: 'place',
  x,
  y,
  label: label || 'P',
  initialTokens: Math.max(0, Number(initialTokens) || 0),
});

/**
 * Function to create a new transition object with the given parameters.
 * @param {number} x - The x-coordinate of the transition.
 * @param {number} y - The y-coordinate of the transition.
 * @param {string} label - The label for the transition.
 */
export const createTransition = (x, y, label = '') => ({
  id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  type: 'transition',
  x,
  y,
  label: label || 'T',
});

/**
 * Function to create a new arc object with the given parameters.
 * @param {string} sourceId - The ID of the source element.
 * @param {string} targetId - The ID of the target element.
 * @param {number} weight - The weight of the arc.
 */
export const createArc = (sourceId, targetId, weight = 1) => ({
  id: `a_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  type: 'arc',
  source: sourceId,
  target: targetId,
  weight: Math.max(1, Number(weight) || 1),
});