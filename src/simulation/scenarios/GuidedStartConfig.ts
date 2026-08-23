// ============================================================
// ISHAMI SIMULATION — Guided Start Scenario Configuration
// Scenario 01: Gutangira Gutwara
// ============================================================

import type { Waypoint } from '../core/SimulationState';

export const GUIDED_START_CONFIG = {
  id: 'guided_start',
  title: 'Guided Start',
  titleRW: 'Gutangira Gutwara',
  description: 'Learn the essential steps required before moving a vehicle.',
  descriptionRW: 'Ibintu byagenze bikenerwa mbere yo gutangira imodoka.',
  difficulty: 'BEGINNER',
  location: 'KIGALI — CONVENTION CENTRE TRAINING AREA',
  locationRW: 'KIGALI — AHANTU HO KUJYANA KUMUHANDA WA KONVANSI',
  estimatedTime: '3-5 min',
  maxSpeed: 40, // km/h training zone limit
  trafficDensity: 'LOW' as const,
  trainingMode: true,

  objectives: [
    { id: 'seat', text: 'Adjust your driving position', textRW: 'Hindura uburyo bwawe bwo gutwara', icon: '💺' },
    { id: 'mirrors', text: 'Check your mirrors', textRW: 'Reba amadaruro yawe', icon: '🔍' },
    { id: 'seatbelt', text: 'Fasten your seatbelt', textRW: 'Funga umugere wawe', icon: '🔒' },
    { id: 'controls', text: 'Prepare the vehicle controls', textRW: 'Tegura ibyabibishyitsi', icon: '🎛️' },
    { id: 'engine', text: 'Start the engine', textRW: 'Tangira injini', icon: '🔑' },
    { id: 'gear', text: 'Select first gear', textRW: 'Hitamo igeari ya mbere', icon: '⚙️' },
    { id: 'move', text: 'Move away safely', textRW: 'Tangira gutwara neza', icon: '🚗' },
    { id: 'route', text: 'Follow the training route', textRW: 'Kurikiza urwego rwo kujyana', icon: '🛤️' },
    { id: 'stop', text: 'Stop at the designated point', textRW: 'Hagarika aho wateguwe', icon: '🛑' },
  ],

  // Scoring weights
  scoring: {
    vehicleControl: 0.25,
    safety: 0.25,
    trafficCompliance: 0.2,
    steering: 0.15,
    speedControl: 0.15,
  },

  // Speed limit for training zone (km/h)
  speedLimit: 30,

  // XP rewards
  xpReward: 250,
  medalThresholds: {
    gold: 90,
    silver: 80,
    bronze: 70,
  },
};

// Waypoints for the training route
// Positioned relative to the city model — these form a simple loop
// starting and ending near the Convention Centre area
export const GUIDED_START_WAYPOINTS: Waypoint[] = [
  {
    id: 'START',
    position: [68, 0, -126],
    radius: 5,
    objective: 'Coffee Shop — Starting Point',
    instruction: 'Start your vehicle at the Coffee Shop on the main road.',
    completed: false,
    instructorMessage: 'Welcome! You are at the Coffee Shop. Begin your vehicle preparation here.',
  },
  {
    id: 'DRIVE_NORTH',
    position: [68, 0, -162],
    radius: 5,
    objective: 'Drive north past the shops',
    instruction: 'Drive straight north along the road past the shops.',
    completed: false,
    instructorMessage: 'Head north. Keep your speed controlled past the shop district.',
  },
  {
    id: 'TURN_RIGHT',
    position: [108, 0, -162],
    radius: 5,
    objective: 'Turn right at the intersection',
    instruction: 'Slow down and turn right at the intersection.',
    completed: false,
    instructorMessage: 'Turn right here. Check mirrors and signal before turning.',
  },
  {
    id: 'DRIVE_EAST',
    position: [144, 0, -162],
    radius: 5,
    objective: 'Continue east through the district',
    instruction: 'Keep driving east along the road.',
    completed: false,
    instructorMessage: 'Good driving! Continue east through the city.',
  },
  {
    id: 'TURN_SOUTH',
    position: [144, 0, -126],
    radius: 5,
    objective: 'Turn south toward the stadium',
    instruction: 'Turn right to head south past the stadium.',
    completed: false,
    instructorMessage: 'Turn south. The stadium area is nearby.',
  },
  {
    id: 'STADIUM_PAST',
    position: [144, 0, -90],
    radius: 5,
    objective: 'Drive past the stadium area',
    instruction: 'Continue south past the stadium parking.',
    completed: false,
    instructorMessage: 'You are passing the stadium area. Maintain steady speed.',
  },
  {
    id: 'TURN_WEST',
    position: [108, 0, -90],
    radius: 5,
    objective: 'Turn west back toward coffee shop',
    instruction: 'Turn right to head west back to the coffee shop.',
    completed: false,
    instructorMessage: 'Turn west. You are heading back to the Coffee Shop.',
  },
  {
    id: 'RETURN_SHOP',
    position: [68, 0, -90],
    radius: 5,
    objective: 'Approach the Coffee Shop',
    instruction: 'Slow down as you approach the Coffee Shop.',
    completed: false,
    instructorMessage: 'Almost there! Slow down and prepare to stop.',
  },
  {
    id: 'STOP_POINT',
    position: [68, 0, -108],
    radius: 5,
    objective: 'Stop near the Coffee Shop',
    instruction: 'Come to a complete stop near the Coffee Shop.',
    completed: false,
    instructorMessage: 'Stop here. Check traffic before proceeding.',
  },
  {
    id: 'FINISH',
    position: [68, 0, -126],
    radius: 6,
    objective: 'Mission complete!',
    instruction: 'Return to the Coffee Shop starting point.',
    completed: false,
    instructorMessage: 'Excellent! You have completed the training route from the Coffee Shop.',
  },
];

// Cinematic camera path for the Kigali overview
export const CINEMATIC_CAMERA_PATH = [
  { position: [0, 25, 30] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number], duration: 3 },
  { position: [20, 15, 10] as [number, number, number], lookAt: [5, 0, -5] as [number, number, number], duration: 3 },
  { position: [5, 8, 0] as [number, number, number], lookAt: [0, 0, 5] as [number, number, number], duration: 2 },
  { position: [3, 4, 8] as [number, number, number], lookAt: [0, 1, 5] as [number, number, number], duration: 2 },
];
