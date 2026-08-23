/**
 * Keyframe interpolation utilities.
 *
 * Given an array of keyframes at known percentage markers and a `progress`
 * value (0–1), these helpers return smoothly interpolated values.
 */

/**
 * Map a list of equally-spaced keyframes to their percentage positions.
 * If `markers` is provided it overrides the automatic spacing.
 */
function getMarkerPositions(count, markers) {
  if (markers) return markers
  if (count <= 1) return [0]
  return Array.from({ length: count }, (_, i) => i / (count - 1))
}

/**
 * Find the two surrounding keyframes for `t` and return their indices
 * plus the local fractional progress between them.
 */
function findSegment(t, markers) {
  if (t <= markers[0]) return { i: 0, local: 0 }
  if (t >= markers[markers.length - 1]) return { i: markers.length - 2, local: 1 }

  for (let i = 0; i < markers.length - 1; i++) {
    if (t >= markers[i] && t <= markers[i + 1]) {
      const local = (t - markers[i]) / (markers[i + 1] - markers[i])
      return { i, local }
    }
  }
  return { i: markers.length - 2, local: 1 }
}

/**
 * Simple smooth-step easing (ease-in-out).
 */
function smoothstep(t) {
  return t * t * (3 - 2 * t)
}

/**
 * Interpolate a single numeric value between two keyframes.
 */
function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Interpolate an array of numbers (e.g. [x, y, z]).
 */
function lerpArray(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t))
}

/**
 * Interpolate a keyframe array of objects.
 *
 * @param {Array<Object>} keyframes  – Array of objects with numeric or array values
 * @param {number}        progress   – Current scroll progress (0–1)
 * @param {Array<number>} [markers]  – Optional explicit percentage positions
 * @returns {Object} Interpolated values
 *
 * @example
 *   interpolateKeyframes(
 *     [{ pos: [0,0,0], rotY: 0 }, { pos: [5,0,-10], rotY: 0 }],
 *     0.5
 *   )
 *   // → { pos: [2.5, 0, -5], rotY: 0 }
 */
export function interpolateKeyframes(keyframes, progress, markers) {
  const positions = getMarkerPositions(keyframes.length, markers)
  const { i, local } = findSegment(progress, positions)

  const from = keyframes[i]
  const to = keyframes[Math.min(i + 1, keyframes.length - 1)]
  const t = smoothstep(local)

  const result = {}
  for (const key of Object.keys(from)) {
    const a = from[key]
    const b = to[key]

    if (Array.isArray(a)) {
      result[key] = lerpArray(a, b, t)
    } else if (typeof a === 'number') {
      result[key] = lerp(a, b, t)
    } else {
      result[key] = t < 0.5 ? a : b
    }
  }

  return result
}

/**
 * Convenience: extract a Vector3-compatible array from an interpolated result.
 */
export function Vec3(obj) {
  return obj.pos || [0, 0, 0]
}
