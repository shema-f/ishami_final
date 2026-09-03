/**
 * Multi-stage camera & car keyframes for the ISHAMI hero scroll choreography.
 *
 * Each stage is a pair of percentage markers (0–1) that map to the hero scroll.
 * GSAP's `scrub` interpolates between them smoothly.
 *
 * STAGES
 * ──────
 * 0.00–0.12  INTRO      – Camera slowly approaches from the hero angle
 * 0.12–0.30  ORBIT      – Camera sweeps to the side (automotive-ad style)
 * 0.30–0.45  BEHIND     – Camera transitions behind the car
 * 0.45–0.65  DRIVE      – Car moves forward through the city, camera follows
 * 0.65–0.82  AERIAL     – Camera rises above for a bird's-eye view
 * 0.82–1.00  TRANSITION – Scene fades / pushes away to hand off to next section
 */

// ── Camera keyframes ──────────────────────────────────────────────
// { pos: [x, y, z], lookAt: [x, y, z] }
// Car sits at [0, 0.7, 0] on the road, facing +Z (front)

export const cameraKeyframes = [
  // 0.00 – Hero start: three-quarter front view, slightly elevated
  { pos: [5, 2.2, 6], lookAt: [0, 0.5, 0.5] },

  // 0.12 – Approach: camera pushes in closer
  { pos: [3.5, 1.8, 4.5], lookAt: [0, 0.4, 0.5] },

  // 0.30 – Side orbit: automotive beauty shot from the right
  { pos: [-4, 1.5, 2], lookAt: [0, 0.4, 0] },

  // 0.45 – Behind: camera positions behind the car, slightly elevated
  { pos: [1.5, 2, 4.5], lookAt: [0, 0.3, -2] },

  // 0.55 – Car begins moving: camera follows behind at road level
  { pos: [0, 1.5, 5], lookAt: [0, 0.2, -8] },

  // 0.65 – Car mid-drive: deeper into the city
  { pos: [0, 1.8, 3], lookAt: [0, 0.1, -18] },

  // 0.82 – Aerial: camera sweeps upward — wide view of whole city
  { pos: [5, 18, -8], lookAt: [0, 0, -5] },

  // 0.92 – High aerial: full city visible below
  { pos: [0, 28, -5], lookAt: [0, 0, 0] },

  // 1.00 – Transition out: bird's-eye view, pushed far up
  { pos: [0, 38, -10], lookAt: [0, 0, -5] },
]

// ── Car keyframes ─────────────────────────────────────────────────
// { pos: [x, y, z], rotY: number }
// Car base Y=0.7 (lifts tires to road), slight initial angle

export const carKeyframes = [
  // 0.00 – Starting position: slightly angled on the road
  { pos: [0, 0.7, 0], rotY: -0.15 },

  // 0.45 – Still parked, camera moving behind
  { pos: [0, 0.7, 0], rotY: -0.15 },

  // 0.50 – Car starts rolling forward, straightens out
  { pos: [0, 0.7, -3], rotY: 0 },

  // 0.55 – Driving
  { pos: [0, 0.7, -8], rotY: 0 },

  // 0.65 – Further into the city
  { pos: [0, 0.7, -18], rotY: 0 },

  // 0.82 – Nearly out of sight (aerial takes over)
  { pos: [0, 0.7, -28], rotY: 0 },

  // 1.00 – Gone
  { pos: [0, 0.7, -35], rotY: 0 },
]

// ── Fog keyframes ────────────────────────────────────────────────
// { near: number, far: number }

export const fogKeyframes = [
  { near: 20, far: 80 },   // 0.00
  { near: 20, far: 80 },   // 0.45
  { near: 15, far: 65 },   // 0.65 – tighten for drive
  { near: 30, far: 120 },  // 0.82 – aerial: push fog out for full city view
  { near: 3, far: 15 },    // 1.00 – fade out
]

// ── Ambient light intensity keyframes ─────────────────────────────
export const ambientKeyframes = [
  { intensity: 0.4 },   // 0.00
  { intensity: 0.4 },   // 0.45
  { intensity: 0.3 },   // 0.65
  { intensity: 0.15 },  // 0.82
  { intensity: 0.05 },  // 1.00 – fade to dark
]
