// ============================================================
// ISHAMI SIMULATION — Core State Management
// Centralized state for the entire simulation engine
// ============================================================

export type SimulationPhase =
  | 'loading'
  | 'cinematic'
  | 'aerial'
  | 'route_preview'
  | 'briefing'
  | 'preparation'
  | 'driving'
  | 'evaluation'
  | 'results';

export type InstructorStage =
  | 'INTRO'
  | 'SEAT_ADJUSTMENT'
  | 'MIRROR_CHECK'
  | 'SEATBELT'
  | 'HANDBRAKE'
  | 'GEAR_CHECK'
  | 'ENGINE_START'
  | 'CLUTCH'
  | 'FIRST_GEAR'
  | 'MOVEMENT'
  | 'STEERING'
  | 'STOP'
  | 'COMPLETION';

export type GearState = 'N' | '1' | '2' | '3' | '4' | '5' | 'R';

export type MistakeSeverity = 'INFO' | 'WARNING' | 'ERROR';

export interface Mistake {
  id: string;
  severity: MistakeSeverity;
  message: string;
  timestamp: number;
  category: string;
}

export interface Waypoint {
  id: string;
  position: [number, number, number];
  radius: number;
  objective: string;
  instruction: string;
  completed: boolean;
  instructorMessage?: string;
}

export interface ScoreCategory {
  name: string;
  weight: number;
  score: number;
}

export interface SimulationState {
  phase: SimulationPhase;
  instructorStage: InstructorStage;
  startTime: number;
  elapsedTime: number;

  // Vehicle state
  speed: number;
  maxSpeed: number;
  gear: GearState;
  clutchPressed: boolean;
  brakePressed: boolean;
  acceleratorPressed: boolean;
  handbrakeOn: boolean;
  engineRunning: boolean;
  engineStalled: boolean;
  steeringAngle: number;

  // Preparation checklist
  seatAdjusted: boolean;
  mirrorsChecked: { left: boolean; right: boolean; rear: boolean };
  seatbeltFastened: boolean;

  // Route progress
  currentWaypointIndex: number;
  waypoints: Waypoint[];

  // Evaluation
  mistakes: Mistake[];
  scoreCategories: ScoreCategory[];
  totalScore: number;
  speedViolations: number;
  collisionCount: number;
  collisions: { severity: 'MINOR' | 'WARNING' | 'MAJOR'; position: [number, number, number] }[];

  // Camera
  cameraMode: 'thirdPerson' | 'cockpit';

  // Mode
  isTrainingMode: boolean;
}

export function createInitialState(): SimulationState {
  return {
    phase: 'loading',
    instructorStage: 'INTRO',
    startTime: 0,
    elapsedTime: 0,

    speed: 0,
    maxSpeed: 60,
    gear: 'N',
    clutchPressed: false,
    brakePressed: false,
    acceleratorPressed: false,
    handbrakeOn: true,
    engineRunning: false,
    engineStalled: false,
    steeringAngle: 0,

    seatAdjusted: false,
    mirrorsChecked: { left: false, right: false, rear: false },
    seatbeltFastened: false,

    currentWaypointIndex: 0,
    waypoints: [],

    mistakes: [],
    scoreCategories: [
      { name: 'VEHICLE_CONTROL', weight: 0.25, score: 0 },
      { name: 'SAFETY', weight: 0.25, score: 0 },
      { name: 'TRAFFIC_COMPLIANCE', weight: 0.2, score: 0 },
      { name: 'STEERING', weight: 0.15, score: 0 },
      { name: 'SPEED_CONTROL', weight: 0.15, score: 0 },
    ],
    totalScore: 0,
    speedViolations: 0,
    collisionCount: 0,
    collisions: [],

    cameraMode: 'thirdPerson',
    isTrainingMode: true,
  };
}
