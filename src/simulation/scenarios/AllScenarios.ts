// ============================================================
// ISHAMI SIMULATION — All Scenario Configurations
// Complete set of driving scenarios with UNIQUE waypoints
// Each scenario starts at a different location and follows
// its own distinct route through the city.
// ============================================================

import type { Waypoint } from '../core/SimulationState';

// ─── Scenario Base ────────────────────────────────────────

export interface ScenarioConfig {
  id: string;
  title: string;
  titleRW: string;
  description: string;
  descriptionRW: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  location: string;
  locationRW: string;
  estimatedTime: string;
  maxSpeed: number;
  speedLimit: number;
  xpReward: number;
  trainingMode: boolean;
  objectives: { id: string; text: string; textRW: string; icon: string }[];
  waypoints: Waypoint[];
  trafficLights?: { position: [number, number, number]; rotation: number }[];
  aiVehicles?: { position: [number, number, number]; color: number; speed: number; path: [number, number, number][] }[];
  pedestrians?: { position: [number, number, number]; path: [number, number, number][]; speed: number }[];
  environment?: {
    timeOfDay?: number;
    weather?: 'clear' | 'rain' | 'fog' | 'overcast';
  };
}

// ─── Parallel Parking Scenario ────────────────────────────
// Location: Stadium Parking Area (south-east of city)
// Route: Approach from east, park between cones, reverse out

export const PARALLEL_PARKING: ScenarioConfig = {
  id: 'parallel_parking',
  title: 'Parallel Parking',
  titleRW: 'Guhagarika Uburiri',
  description: 'Learn to park your vehicle between two parked cars in a tight space. Precision and patience are key.',
  descriptionRW: 'Jya mu gihe uhagaritse imodoka hagati y\'imodoka ebyiri. Ubunyangamugayo ni ingenzi.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — Stadium Parking Zone (South-East)',
  locationRW: 'Kigali — Ahantu h\'imodoka y\'Ukwirakwiza (Iburasirazuba)',
  estimatedTime: '5-8 min',
  maxSpeed: 15,
  speedLimit: 15,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'approach', text: 'Approach the parking spot slowly', textRW: 'Jya buhoro igerero ry\'imodoka', icon: '🚗' },
    { id: 'position', text: 'Position alongside the front car', textRW: 'Itegura hafi y\'imodoka ya mbere', icon: '📍' },
    { id: 'reverse', text: 'Reverse into the space', textRW: 'Subira inyuma mu buriri', icon: '↩️' },
    { id: 'align', text: 'Align between both vehicles', textRW: 'Itegura hagati y\'imodoka zombi', icon: '🎯' },
    { id: 'park', text: 'Come to a complete stop in the space', textRW: 'Hagarika mu buriri neza', icon: '🅿️' },
  ],
  waypoints: [
    {
      id: 'PP_APPROACH',
      position: [144, 0, 180],
      radius: 5,
      objective: 'Approach stadium parking from east',
      instruction: 'Drive slowly toward the stadium parking zone from the east road.',
      completed: false,
      instructorMessage: 'You are approaching the stadium parking area. Keep your speed very low.',
    },
    {
      id: 'PP_POSITION',
      position: [144, 0, 198],
      radius: 4,
      objective: 'Position alongside the parked car',
      instruction: 'Pull up alongside the parked car, leaving 1 meter of space.',
      completed: false,
      instructorMessage: 'Pull up next to the front car. Keep about 1 meter lateral distance.',
    },
    {
      id: 'PP_REVERSE',
      position: [126, 0, 216],
      radius: 4,
      objective: 'Begin reversing into spot',
      instruction: 'Select reverse gear, turn steering, and begin backing in.',
      completed: false,
      instructorMessage: 'Now select reverse gear. Turn steering wheel right and reverse slowly.',
    },
    {
      id: 'PP_ALIGN',
      position: [108, 0, 216],
      radius: 3,
      objective: 'Align between vehicles',
      instruction: 'Straighten the wheel and align between both parked cars.',
      completed: false,
      instructorMessage: 'Straighten the wheel. You are almost parked between the vehicles.',
    },
    {
      id: 'PP_PARKED',
      position: [90, 0, 216],
      radius: 3,
      objective: 'Park complete — engine off',
      instruction: 'Come to a complete stop. Engage handbrake and put in neutral.',
      completed: false,
      instructorMessage: 'Excellent parallel parking! Handbrake on, neutral gear. Well done.',
    },
  ],
};

// ─── Hill Start Scenario ──────────────────────────────────
// Location: South Road leading to Nyarutarama Hill
// Route: Drive south up the long hill, stop halfway, restart

export const HILL_START: ScenarioConfig = {
  id: 'hill_start',
  title: 'Hill Start',
  titleRW: 'Gutangira ku Gitozo',
  description: 'Practice starting on an incline without rolling back. Master clutch control and handbrake technique.',
  descriptionRW: 'Jya mu gihe utangira ku gitozo nta makuru. Menya clutch n\'agakamandende.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — Nyarutarama Hill (South)',
  locationRW: 'Kigali — Igitambara c\'Nyarutarama (Amajyepfo)',
  estimatedTime: '5-7 min',
  maxSpeed: 30,
  speedLimit: 25,
  xpReward: 450,
  trainingMode: true,
  objectives: [
    { id: 'stop_hill', text: 'Stop safely on the hill', textRW: 'Hagarika neza ku gitozo', icon: '🛑' },
    { id: 'handbrake', text: 'Engage the handbrake', textRW: 'Shira agakamandende', icon: '🔧' },
    { id: 'clutch_control', text: 'Find the clutch bite point', textRW: 'Rondera aho clutch ihura', icon: '⚙️' },
    { id: 'move_off', text: 'Move off without rolling back', textRW: 'Tangira utabereye inyuma', icon: '🚗' },
    { id: 'climb', text: 'Drive up the hill smoothly', textRW: 'Jya hejuru ku gitozo neza', icon: '⛰️' },
  ],
  waypoints: [
    {
      id: 'HS_BASE',
      position: [-180, 0, 306],
      radius: 5,
      objective: 'Drive to hill base',
      instruction: 'Drive south along the road toward the hill.',
      completed: false,
      instructorMessage: 'You are approaching the hill road. Drive toward the base.',
    },
    {
      id: 'HS_STOP',
      position: [-180, 0, 324],
      radius: 4,
      objective: 'Stop on the hill incline',
      instruction: 'Come to a complete stop on the incline.',
      completed: false,
      instructorMessage: 'Stop here on the hill. Apply the handbrake firmly.',
    },
    {
      id: 'HS_START_MOVE',
      position: [-180, 0, 342],
      radius: 4,
      objective: 'Move off from hill',
      instruction: 'Clutch in, first gear, find bite point, release handbrake, move off.',
      completed: false,
      instructorMessage: 'Now: clutch in, first gear, find the bite point, release handbrake gently, and drive!',
    },
    {
      id: 'HS_CLIMB',
      position: [-180, 0, 360],
      radius: 5,
      objective: 'Climb the hill',
      instruction: 'Keep a steady speed as you climb the hill.',
      completed: false,
      instructorMessage: 'Good climbing! Maintain steady throttle up the hill.',
    },
    {
      id: 'HS_TOP',
      position: [-180, 0, 378],
      radius: 5,
      objective: 'Mission complete!',
      instruction: 'You reached the hilltop successfully.',
      completed: false,
      instructorMessage: 'Outstanding hill start! You mastered the incline perfectly.',
    },
  ],
};

// ─── Roundabout Navigation Scenario ───────────────────────
// Location: North Intersection near Kacyiru
// Route: Approach from north, yield, enter, navigate, exit south

export const ROUNDABOUT_NAVIGATION: ScenarioConfig = {
  id: 'roundabout',
  title: 'Roundabout Navigation',
  titleRW: 'Kuzinga ku Roundabout',
  description: 'Master the art of navigating roundabouts with proper lane discipline and signaling.',
  descriptionRW: 'Menya neza kuzinga mu roundabout ukurikiza imbanza.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — Kacyiru Roundabout (North)',
  locationRW: 'Kigali — Roundabout ya Kacyiru (Amajyaruguru)',
  estimatedTime: '5-8 min',
  maxSpeed: 35,
  speedLimit: 30,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'approach_roundabout', text: 'Approach the roundabout', textRW: 'Jya igerero ry\'roundabout', icon: '🚗' },
    { id: 'yield', text: 'Yield to traffic already in the roundabout', textRW: 'Tega abari mu roundabout', icon: '⏸️' },
    { id: 'enter', text: 'Enter the roundabout correctly', textRW: 'Injira mu roundabout neza', icon: '🔄' },
    { id: 'navigate', text: 'Navigate to your exit', textRW: 'Jya aho usohoka', icon: '↗️' },
    { id: 'exit', text: 'Exit the roundabout safely', textRW: 'Sohoka mu roundabout neza', icon: '✅' },
  ],
  waypoints: [
    {
      id: 'RA_APPROACH',
      position: [68, 0, -252],
      radius: 5,
      objective: 'Approach the roundabout from the north',
      instruction: 'Drive south toward the roundabout intersection.',
      completed: false,
      instructorMessage: 'You are approaching the roundabout. Reduce speed and prepare to yield.',
    },
    {
      id: 'RA_YIELD',
      position: [68, 0, -234],
      radius: 4,
      objective: 'Yield at the roundabout entrance',
      instruction: 'Stop and check for traffic in the roundabout.',
      completed: false,
      instructorMessage: 'At the yield line. Check left — traffic in the roundabout has priority.',
    },
    {
      id: 'RA_ENTER',
      position: [54, 0, -216],
      radius: 4,
      objective: 'Enter the roundabout',
      instruction: 'When clear, enter the roundabout keeping right.',
      completed: false,
      instructorMessage: 'It is clear! Enter the roundabout. Keep to the right lane.',
    },
    {
      id: 'RA_NAVIGATE',
      position: [36, 0, -216],
      radius: 4,
      objective: 'Navigate through the roundabout',
      instruction: 'Continue around toward your exit.',
      completed: false,
      instructorMessage: 'Stay in lane. Signal right when approaching your exit.',
    },
    {
      id: 'RA_EXIT',
      position: [36, 0, -198],
      radius: 4,
      objective: 'Exit the roundabout',
      instruction: 'Signal and exit the roundabout onto the south road.',
      completed: false,
      instructorMessage: 'Signal right and exit smoothly. Well done!',
    },
    {
      id: 'RA_COMPLETE',
      position: [36, 0, -180],
      radius: 5,
      objective: 'Mission complete!',
      instruction: 'Roundabout navigation completed successfully.',
      completed: false,
      instructorMessage: 'Excellent roundabout navigation! You handled it perfectly.',
    },
  ],
};

// ─── Traffic Flow Scenario ───────────────────────────────
// Location: Western Hospital District
// Route: Start near hospital, loop through western roads, return

export const TRAFFIC_FLOW: ScenarioConfig = {
  id: 'traffic_flow',
  title: 'Traffic Flow',
  titleRW: 'Kugendagenda',
  description: 'Navigate through traffic while following all traffic rules.',
  descriptionRW: 'Kugena mu mizigo y\'imodoka ukurikiza amategeko yose.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Hospital District (West)',
  locationRW: 'Kigali — Akarere ka Hospitale (Iburengerazuba)',
  estimatedTime: '5-7 min',
  maxSpeed: 40,
  speedLimit: 40,
  xpReward: 350,
  trainingMode: true,
  objectives: [
    { id: 'follow_lane', text: 'Stay in your lane', textRW: 'Guma mu imbanza yawe', icon: '🚗' },
    { id: 'signal', text: 'Use indicators when turning', textRW: 'Koresha ibyerekezo', icon: '🔄' },
    { id: 'speed', text: 'Maintain speed limit', textRW: 'Kurikiza imigabane', icon: '⚡' },
    { id: 'distance', text: 'Keep safe following distance', textRW: 'Bika interasi', icon: '📏' },
  ],
  waypoints: [
    {
      id: 'TF_HOSPITAL',
      position: [-126, 0, -54],
      radius: 5,
      objective: 'Start at Hospital District',
      instruction: 'Begin driving from the hospital area on the western road.',
      completed: false,
      instructorMessage: 'You are at the Hospital District. Follow the traffic flow carefully.',
    },
    {
      id: 'TF_NORTH_WEST',
      position: [-126, 0, -90],
      radius: 5,
      objective: 'Drive north along west road',
      instruction: 'Continue north along the western road.',
      completed: false,
      instructorMessage: 'Good lane discipline. Keep going north.',
    },
    {
      id: 'TF_TURN_RIGHT',
      position: [-90, 0, -90],
      radius: 5,
      objective: 'Turn right at intersection',
      instruction: 'Signal right and turn at the intersection.',
      completed: false,
      instructorMessage: 'Signal and turn right. Check your mirrors first.',
    },
    {
      id: 'TF_INNER_WEST',
      position: [-90, 0, -54],
      radius: 5,
      objective: 'Drive south on inner road',
      instruction: 'Drive south on the inner road through the district.',
      completed: false,
      instructorMessage: 'Good speed control. Stay in your lane.',
    },
    {
      id: 'TF_TURN_SOUTH',
      position: [-126, 0, -18],
      radius: 5,
      objective: 'Turn left back to hospital road',
      instruction: 'Signal left and turn back toward the hospital.',
      completed: false,
      instructorMessage: 'Turn left. Watch for pedestrians near the hospital.',
    },
    {
      id: 'TF_HOSPITAL_RETURN',
      position: [-126, 0, -54],
      radius: 6,
      objective: 'Mission complete!',
      instruction: 'Return to the Hospital District starting point.',
      completed: false,
      instructorMessage: 'Excellent traffic flow navigation in the hospital district!',
    },
  ],
};

// ─── Corners & Turns Scenario ─────────────────────────────
// Location: Kimironko District (west-central)
// Route: Sharp turns, U-turns, lane changes through western streets

export const CORNERS_TURNS: ScenarioConfig = {
  id: 'corners_turns',
  title: 'Corners & Turns',
  titleRW: 'Imfuruka',
  description: 'Master proper turning techniques and road positioning.',
  descriptionRW: 'Menya neza imfuruka n\'uburyo bwo gutwara mu muhanda.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Kimironko District (West-Central)',
  locationRW: 'Kigali — Akarere ka Kimironko (Iburasirazuba)',
  estimatedTime: '4-6 min',
  maxSpeed: 35,
  speedLimit: 30,
  xpReward: 300,
  trainingMode: true,
  objectives: [
    { id: 'sharp_turn', text: 'Navigate a sharp turn', textRW: 'Injira mu furuka', icon: '↩️' },
    { id: 'u_turn', text: 'Execute a U-turn', textRW: 'Koresha U-turn', icon: '🔄' },
    { id: 'lane_change', text: 'Change lanes safely', textRW: 'Hindura imbanza', icon: '↔️' },
  ],
  waypoints: [
    {
      id: 'CT_START',
      position: [-54, 0, -108],
      radius: 5,
      objective: 'Start turning course in Kimironko',
      instruction: 'Begin the turning course from Kimironko district.',
      completed: false,
      instructorMessage: 'Welcome to the Kimironko turning course. Follow the route.',
    },
    {
      id: 'CT_SHARP_LEFT',
      position: [-90, 0, -108],
      radius: 5,
      objective: 'Sharp left turn',
      instruction: 'Slow down and make a sharp left turn.',
      completed: false,
      instructorMessage: 'Slow down and turn left. Use your signal.',
    },
    {
      id: 'CT_STRAIGHT',
      position: [-90, 0, -144],
      radius: 5,
      objective: 'Drive straight south',
      instruction: 'Continue straight south for a short distance.',
      completed: false,
      instructorMessage: 'Good steering control. Keep going straight.',
    },
    {
      id: 'CT_RIGHT_TURN',
      position: [-54, 0, -144],
      radius: 5,
      objective: 'Right turn at junction',
      instruction: 'Turn right at this junction.',
      completed: false,
      instructorMessage: 'Turn right. Check your mirrors and blind spot.',
    },
    {
      id: 'CT_U_TURN',
      position: [-18, 0, -144],
      radius: 5,
      objective: 'Execute a U-turn',
      instruction: 'Make a safe U-turn when the road is clear.',
      completed: false,
      instructorMessage: 'Execute a U-turn. Check both directions first.',
    },
    {
      id: 'CT_RETURN',
      position: [-54, 0, -126],
      radius: 5,
      objective: 'Return to start area',
      instruction: 'Head back north toward the starting point.',
      completed: false,
      instructorMessage: 'Almost there. Drive smoothly back.',
    },
    {
      id: 'CT_FINISH',
      position: [-54, 0, -108],
      radius: 6,
      objective: 'Mission complete!',
      instruction: 'Turning course completed.',
      completed: false,
      instructorMessage: 'Great turning skills! You navigated Kimironko perfectly.',
    },
  ],
};

// ─── Highway Driving Scenario ─────────────────────────────
// Location: Airport Road (far west)
// Route: Long straight highway with merge, cruise, overtake, exit

export const HIGHWAY_DRIVING: ScenarioConfig = {
  id: 'highway_driving',
  title: 'Highway Driving',
  titleRW: 'Gutwara kuri Highway',
  description: 'High-speed driving with overtaking and lane changes.',
  descriptionRW: 'Gutwara cyihuse no gusubiza imodoka.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Airport Road (Far West)',
  locationRW: 'Kigali — Umuhanda w\'Ubwato (Iburengerazuba)',
  estimatedTime: '7-10 min',
  maxSpeed: 80,
  speedLimit: 80,
  xpReward: 700,
  trainingMode: true,
  objectives: [
    { id: 'merge', text: 'Merge onto highway', textRW: 'Injira ku highway', icon: '🛣️' },
    { id: 'cruise', text: 'Maintain highway speed', textRW: 'Komeza umuvuduko', icon: '⚡' },
    { id: 'overtake', text: 'Safely overtake a slower vehicle', textRW: 'Gusubiza imodoka', icon: '🚗' },
    { id: 'exit', text: 'Exit the highway safely', textRW: 'Sohoka ku highway', icon: '🔚' },
  ],
  waypoints: [
    {
      id: 'HW_MERGE',
      position: [-270, 0, 54],
      radius: 5,
      objective: 'Merge onto the highway',
      instruction: 'Accelerate and merge onto Airport Road from the on-ramp.',
      completed: false,
      instructorMessage: 'Merge carefully. Match highway speed before merging.',
    },
    {
      id: 'HW_CRUISE_1',
      position: [-270, 0, 0],
      radius: 6,
      objective: 'Cruise at highway speed',
      instruction: 'Maintain steady highway speed in your lane.',
      completed: false,
      instructorMessage: 'Good speed. Stay in the left lane and maintain distance.',
    },
    {
      id: 'HW_OVERTAKE',
      position: [-270, 0, -54],
      radius: 6,
      objective: 'Overtake the slower vehicle',
      instruction: 'Signal left, check mirrors, move to right lane, overtake.',
      completed: false,
      instructorMessage: 'Overtake when safe. Signal, check mirrors, then pass.',
    },
    {
      id: 'HW_CRUISE_2',
      position: [-270, 0, -108],
      radius: 6,
      objective: 'Return to left lane',
      instruction: 'Signal left and return to the left lane after overtaking.',
      completed: false,
      instructorMessage: 'Good overtaking. Signal and return to your lane.',
    },
    {
      id: 'HW_EXIT_PREP',
      position: [-270, 0, -162],
      radius: 5,
      objective: 'Prepare to exit',
      instruction: 'Signal right and slow down for the exit.',
      completed: false,
      instructorMessage: 'Signal early. Begin reducing speed for the exit.',
    },
    {
      id: 'HW_EXIT',
      position: [-252, 0, -198],
      radius: 5,
      objective: 'Mission complete!',
      instruction: 'Take the exit ramp safely.',
      completed: false,
      instructorMessage: 'Excellent highway driving! Smooth merge, overtake, and exit.',
    },
  ],
};

// ─── Night Driving Scenario ───────────────────────────────
// Location: East District (far east of city)
// Route: Dark streets with low visibility, careful navigation

export const NIGHT_DRIVING: ScenarioConfig = {
  id: 'night_driving',
  title: 'Night Driving',
  titleRW: 'Gutwara mu Gitondo',
  description: 'Drive safely in low visibility conditions with headlights and caution.',
  descriptionRW: 'Twara neza mu gihe ntarengwa.',
  difficulty: 'ADVANCED',
  location: 'Kigali — East District (Night Route)',
  locationRW: 'Kigali — Akarere y\'Iburasirazuba (Umuhanda wa joro)',
  estimatedTime: '6-8 min',
  maxSpeed: 40,
  speedLimit: 40,
  xpReward: 800,
  trainingMode: true,
  objectives: [
    { id: 'headlights', text: 'Use headlights correctly', textRW: 'Koresha ibitangazamavuga', icon: '💡' },
    { id: 'visibility', text: 'Drive within visibility range', textRW: 'Twara mu buryo uboneka', icon: '👁️' },
    { id: 'pedestrians', text: 'Watch for pedestrians', textRW: 'Reba abagenzi', icon: '🚶' },
  ],
  waypoints: [
    {
      id: 'ND_START',
      position: [180, 0, -90],
      radius: 5,
      objective: 'Start night route in East District',
      instruction: 'Turn on your headlights and begin driving east.',
      completed: false,
      instructorMessage: 'Night driving mode. Headlights on. Drive carefully in the east district.',
    },
    {
      id: 'ND_DARK_1',
      position: [216, 0, -90],
      radius: 5,
      objective: 'Navigate dark eastern street',
      instruction: 'Drive through the dimly lit eastern road.',
      completed: false,
      instructorMessage: 'Slow down. Visibility is very limited here.',
    },
    {
      id: 'ND_TURN_SOUTH',
      position: [216, 0, -54],
      radius: 5,
      objective: 'Turn south at dark intersection',
      instruction: 'Signal right and turn south at the intersection.',
      completed: false,
      instructorMessage: 'Turn carefully. Watch for pedestrians crossing.',
    },
    {
      id: 'ND_DARK_2',
      position: [216, 0, -18],
      radius: 5,
      objective: 'Continue south on dark road',
      instruction: 'Keep speed low on this unlit road.',
      completed: false,
      instructorMessage: 'Good caution. Maintain low speed and stay alert.',
    },
    {
      id: 'ND_TURN_WEST',
      position: [180, 0, -18],
      radius: 5,
      objective: 'Turn west toward lit area',
      instruction: 'Turn right heading west toward the main road.',
      completed: false,
      instructorMessage: 'Turn right. You are heading toward better lighting.',
    },
    {
      id: 'ND_FINISH',
      position: [180, 0, -54],
      radius: 6,
      objective: 'Mission complete!',
      instruction: 'Return to the lit area safely.',
      completed: false,
      instructorMessage: 'Safe night driving complete! You handled the dark roads well.',
    },
  ],
};

// ─── Rain Driving Scenario ────────────────────────────────
// Location: Convention Centre Area (central city)
// Route: Wet roads through central district, careful braking

export const RAIN_DRIVING: ScenarioConfig = {
  id: 'rain_driving',
  title: 'Rain Driving',
  titleRW: 'Gutwara mu Mvura',
  description: 'Handle wet road conditions with reduced traction and careful braking.',
  descriptionRW: 'Gucunga imodoka mu mvura.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Convention Centre (Central)',
  locationRW: 'Kigali — Ikigo cy\'Agakamandende (Mu mutima)',
  estimatedTime: '6-9 min',
  maxSpeed: 35,
  speedLimit: 30,
  xpReward: 800,
  trainingMode: true,
  objectives: [
    { id: 'wet_braking', text: 'Brake gently on wet roads', textRW: 'Hagarika buhoro', icon: '🌧️' },
    { id: 'traction', text: 'Maintain traction on curves', textRW: 'Bika interasi', icon: '🛣️' },
    { id: 'wipers', text: 'Use wipers and demister', textRW: 'Koresha wipers', icon: '🔄' },
  ],
  environment: {
    weather: 'rain',
  },
  waypoints: [
    {
      id: 'RD_START',
      position: [0, 0, -36],
      radius: 5,
      objective: 'Start rain route at Convention Centre',
      instruction: 'Begin driving from the Convention Centre in wet conditions.',
      completed: false,
      instructorMessage: 'Rain driving mode activated. Reduce speed. Increased braking distance.',
    },
    {
      id: 'RD_NORTH',
      position: [0, 0, -72],
      radius: 5,
      objective: 'Drive north on wet road',
      instruction: 'Drive carefully north on the wet surface.',
      completed: false,
      instructorMessage: 'Wet roads reduce grip. Brake earlier than usual.',
    },
    {
      id: 'RD_TURN_EAST',
      position: [36, 0, -72],
      radius: 5,
      objective: 'Turn right on wet road',
      instruction: 'Turn right gently on the wet surface.',
      completed: false,
      instructorMessage: 'Turn gently. Sudden steering on wet roads causes skidding.',
    },
    {
      id: 'RD_EAST',
      position: [72, 0, -72],
      radius: 5,
      objective: 'Continue east through rain',
      instruction: 'Drive straight through the rain zone.',
      completed: false,
      instructorMessage: 'Good traction control. Maintain steady speed.',
    },
    {
      id: 'RD_TURN_SOUTH',
      position: [72, 0, -36],
      radius: 5,
      objective: 'Turn right south',
      instruction: 'Signal and turn right to head south.',
      completed: false,
      instructorMessage: 'Signal early. Turn gently south.',
    },
    {
      id: 'RD_SOUTH',
      position: [36, 0, 0],
      radius: 5,
      objective: 'Drive south back toward start',
      instruction: 'Continue south toward the Convention Centre.',
      completed: false,
      instructorMessage: 'Good rain driving. Almost back to the start.',
    },
    {
      id: 'RD_FINISH',
      position: [0, 0, -36],
      radius: 6,
      objective: 'Mission complete!',
      instruction: 'Return to the Convention Centre starting point.',
      completed: false,
      instructorMessage: 'Excellent rain driving skills! You handled wet conditions perfectly.',
    },
  ],
};

// ─── Emergency Vehicle Yield Scenario ─────────────────────
// Location: Northeast Commercial District
// Route: Urban road with approaching emergency vehicles

export const EMERGENCY_VEHICLE_YIELD: ScenarioConfig = {
  id: 'emergency_vehicle_yield',
  title: 'Emergency Vehicle Yield',
  titleRW: 'Gutegereza Imodoka y\'Ubugenzi',
  description: 'Learn to safely pull over and yield the right of way to approaching emergency vehicles with sirens and lights.',
  descriptionRW: 'Menya guhagarika imbere y\'imodoka z\'ubugenzi zifuza kugenda.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Northeast Commercial District',
  locationRW: 'Kigali — Akarere ka Amashuru y\'Iburasirazuba',
  estimatedTime: '4-6 min',
  maxSpeed: 40,
  speedLimit: 35,
  xpReward: 350,
  trainingMode: true,
  objectives: [
    { id: 'detect', text: 'Detect approaching emergency vehicle', textRW: 'Reba imodoka y\'ubugenzi ihari', icon: '🚨' },
    { id: 'signal', text: 'Signal right early', textRW: 'Oreza ibyerekezo', icon: '🔆' },
    { id: 'pull_over', text: 'Pull over to the right safely', textRW: 'Hagarika aho hafi y\'umuhanda', icon: '🛑' },
    { id: 'stop', text: 'Come to a complete stop', textRW: 'Hagarika kabisa', icon: '⏸️' },
    { id: 'resume', text: 'Resume driving when clear', textRW: 'Tangira neza igihe cyari neza', icon: '🚗' },
  ],
  waypoints: [
    {
      id: 'EVY_START',
      position: [198, 0, 54],
      radius: 5,
      objective: 'Start in northeast district',
      instruction: 'Begin driving north through the commercial district.',
      completed: false,
      instructorMessage: 'Start driving. Listen and watch for emergency vehicles.',
    },
    {
      id: 'EVY_LISTEN',
      position: [198, 0, 90],
      radius: 5,
      objective: 'Detect siren behind you',
      instruction: 'An emergency vehicle is approaching from behind. Prepare to yield.',
      completed: false,
      instructorMessage: 'Do you hear that siren? An ambulance is coming. Prepare to pull over.',
    },
    {
      id: 'EVY_PULL_OVER',
      position: [198, 0, 126],
      radius: 4,
      objective: 'Pull over to the right',
      instruction: 'Signal right, check mirrors, pull over to the right edge.',
      completed: false,
      instructorMessage: 'Signal right! Pull over to the right side of the road safely.',
    },
    {
      id: 'EVY_STOP',
      position: [162, 0, 126],
      radius: 3,
      objective: 'Stop and wait',
      instruction: 'Come to a complete stop and wait for the emergency vehicle to pass.',
      completed: false,
      instructorMessage: 'Stop completely. Keep your foot on the brake and wait.',
    },
    {
      id: 'EVY_RESUME',
      position: [162, 0, 90],
      radius: 5,
      objective: 'Resume your journey',
      instruction: 'The emergency vehicle has passed. Check traffic, signal, and merge back.',
      completed: false,
      instructorMessage: 'Good! The ambulance passed. Check mirrors, signal left, and resume driving.',
    },
  ],
};

// ─── School Zone Crossing Scenario ────────────────────────
// Location: Southwest Residential School Area
// Route: Drive through active school zone with crossing children

export const SCHOOL_ZONE_CROSSING: ScenarioConfig = {
  id: 'school_zone_crossing',
  title: 'School Zone Crossing',
  titleRW: 'Gutwara mu Mwinjira wa Shule',
  description: 'Navigate an active school zone with reduced speed limits, crossing guards, and children on the road.',
  descriptionRW: 'Twara neza mu shule hari abana bagenda kugena.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Southwest School Zone',
  locationRW: 'Kigali — Ahantu h\'Amashuri Amajyepfo',
  estimatedTime: '4-5 min',
  maxSpeed: 30,
  speedLimit: 20,
  xpReward: 300,
  trainingMode: true,
  objectives: [
    { id: 'reduce_speed', text: 'Reduce speed on approach', textRW: 'Guma cyangwa cyangwa umuvuduko', icon: '🐢' },
    { id: 'observe_signs', text: 'Obey school crossing signs', textRW: 'Kurikiza ibimenyetso bya shule', icon: '🚸' },
    { id: 'watch_children', text: 'Watch for children crossing', textRW: 'Reba abana bazana', icon: '👧' },
    { id: 'yield_crossing', text: 'Yield to crossing guard', textRW: 'Tega umusirikare', icon: '👮' },
  ],
  waypoints: [
    {
      id: 'SZC_APPROACH',
      position: [-198, 0, -198],
      radius: 5,
      objective: 'Approach the school zone',
      instruction: 'You are approaching a school zone. Begin reducing speed now.',
      completed: false,
      instructorMessage: 'School zone ahead! Reduce speed to 20 km/h immediately.',
    },
    {
      id: 'SZC_SIGN',
      position: [-198, 0, -162],
      radius: 5,
      objective: 'Observe the crossing sign',
      instruction: 'Pass the school crossing sign. Maintain reduced speed.',
      completed: false,
      instructorMessage: 'See the school crossing sign? Children may be nearby. Stay alert.',
    },
    {
      id: 'SZC_GUARD',
      position: [-162, 0, -162],
      radius: 4,
      objective: 'Stop for crossing guard',
      instruction: 'A crossing guard has stepped into the road. Come to a stop.',
      completed: false,
      instructorMessage: 'The crossing guard is signaling stop! Stop right now.',
    },
    {
      id: 'SZC_PROCEED',
      position: [-162, 0, -126],
      radius: 5,
      objective: 'Proceed slowly through zone',
      instruction: 'The guard waves you through. Continue slowly through the school zone.',
      completed: false,
      instructorMessage: 'Good. The guard says go. Drive very slowly — watch for stragglers.',
    },
  ],
};

// ─── Fog Driving Scenario ─────────────────────────────────
// Location: Far North Outskirts
// Route: Thick fog conditions with severely limited visibility

export const FOG_DRIVING: ScenarioConfig = {
  id: 'fog_driving',
  title: 'Fog Driving',
  titleRW: 'Gutwara mu Mwaru',
  description: 'Drive under heavy fog conditions with extremely limited visibility. Use fog lights and maintain safe distance.',
  descriptionRW: 'Twara neza mu mwaru. Oresheje lights n\'interasi nziza.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Far North Outskirts',
  locationRW: 'Kigali — Imisozi y\'Amajyaruguru',
  estimatedTime: '6-8 min',
  maxSpeed: 35,
  speedLimit: 25,
  xpReward: 850,
  trainingMode: true,
  objectives: [
    { id: 'fog_lights', text: 'Use fog lights correctly', textRW: 'Koresha lights z\'umwaru', icon: '💡' },
    { id: 'low_speed', text: 'Maintain very low speed', textRW: 'Guma cyangwa umuvuduko', icon: '🐌' },
    { id: 'safe_distance', text: 'Keep extended safe distance', textRW: 'Bika interasi nziza', icon: '📏' },
    { id: 'no_overtake', text: 'Do not overtake in fog', textRW: 'Nta gusubiza mu mwaru', icon: '🚫' },
    { id: 'stay_lane', text: 'Stay in your lane', textRW: 'Guma mu imbanza yawe', icon: '🛣️' },
  ],
  environment: {
    weather: 'fog',
  },
  waypoints: [
    {
      id: 'FD_ENTER',
      position: [0, 0, 270],
      radius: 5,
      objective: 'Enter fog zone',
      instruction: 'Dense fog ahead. Turn on fog lights and reduce speed.',
      completed: false,
      instructorMessage: 'Fog zone starting. Visibility dropping fast. Turn on fog lights now!',
    },
    {
      id: 'FD_DRIVE_1',
      position: [-36, 0, 270],
      radius: 4,
      objective: 'Drive through heavy fog',
      instruction: 'Continue west through the thick fog at very low speed.',
      completed: false,
      instructorMessage: 'Visibility is almost zero. Keep speed below 25 km/h. Do not overtake.',
    },
    {
      id: 'FD_TURN',
      position: [-36, 0, 234],
      radius: 4,
      objective: 'Turn south carefully',
      instruction: 'Turn south in the fog. Signal well in advance and go very slow.',
      completed: false,
      instructorMessage: 'Turn coming up. Signal early! Turn slowly and carefully.',
    },
    {
      id: 'FD_DRIVE_2',
      position: [0, 0, 234],
      radius: 4,
      objective: 'Continue through fog',
      instruction: 'Drive east through the fog. Watch for road edge markers.',
      completed: false,
      instructorMessage: 'Good. Keep to the center of your lane. Watch the road lines.',
    },
    {
      id: 'FD_EXIT',
      position: [36, 0, 234],
      radius: 5,
      objective: 'Exit the fog zone',
      instruction: 'Fog is clearing. Gradually increase speed and turn off fog lights.',
      completed: false,
      instructorMessage: 'Excellent! The fog is clearing. You survived the fog zone perfectly.',
    },
  ],
};

// ─── Urban Merging Scenario ───────────────────────────────
// Location: South-Central East On-Ramp
// Route: Merge from access road into busy urban traffic flow

export const URBAN_MERGING: ScenarioConfig = {
  id: 'urban_merging',
  title: 'Urban Merging',
  titleRW: 'Injira mu Mizigo y\'Imodoka',
  description: 'Practice merging from an on-ramp into dense urban traffic. Match speed, signal, and find a safe gap.',
  descriptionRW: 'Injiza neza imodoka mu mizigo y\'imodoka mu mujyi.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — South-Central East On-Ramp',
  locationRW: 'Kigali — Umuhanda wo Injira Amajyepfo',
  estimatedTime: '5-7 min',
  maxSpeed: 50,
  speedLimit: 45,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'accelerate', text: 'Accelerate on the on-ramp', textRW: 'Gusogora umuvuduko', icon: '⚡' },
    { id: 'match_speed', text: 'Match traffic speed', textRW: 'Kurikiza umuvuduko w\'umugambi', icon: '🎚️' },
    { id: 'signal', text: 'Signal intention to merge', textRW: 'Oreza ibyerekezo', icon: '🔆' },
    { id: 'find_gap', text: 'Find a safe gap in traffic', textRW: 'Rondera interasi nziza', icon: '🔍' },
    { id: 'merge_safe', text: 'Merge smoothly into lane', textRW: 'Injira neza mu imbanza', icon: '🚗' },
  ],
  waypoints: [
    {
      id: 'UM_RAMP_START',
      position: [108, 0, 90],
      radius: 5,
      objective: 'Enter the on-ramp',
      instruction: 'Enter the on-ramp and begin accelerating to match traffic speed.',
      completed: false,
      instructorMessage: 'On-ramp ahead. Start accelerating smoothly to match traffic.',
    },
    {
      id: 'UM_ACCELERATE',
      position: [108, 0, 126],
      radius: 5,
      objective: 'Accelerate to traffic speed',
      instruction: 'Continue accelerating along the ramp. Aim for 45 km/h.',
      completed: false,
      instructorMessage: 'Good acceleration. Get your speed up to match the vehicles on the main road.',
    },
    {
      id: 'UM_SIGNAL',
      position: [144, 0, 126],
      radius: 4,
      objective: 'Signal and check mirrors',
      instruction: 'Signal left, check mirrors and blind spot. Look for a gap.',
      completed: false,
      instructorMessage: 'Signal left NOW. Check your mirrors and blind spot carefully.',
    },
    {
      id: 'UM_FIND_GAP',
      position: [144, 0, 162],
      radius: 4,
      objective: 'Find a gap and merge',
      instruction: 'A gap is available. Merge smoothly into the traffic lane.',
      completed: false,
      instructorMessage: 'Perfect gap between those two cars. Merge in smoothly now.',
    },
    {
      id: 'UM_COMPLETE',
      position: [108, 0, 162],
      radius: 5,
      objective: 'Merge complete — adjust to traffic',
      instruction: 'You are merged. Adjust speed to maintain safe following distance.',
      completed: false,
      instructorMessage: 'Excellent merge! Now maintain safe distance with the car ahead.',
    },
  ],
};

// ─── Perpendicular Parking Scenario ───────────────────────
// Location: East Side Commercial Parking Lot
// Route: Pull forward into a 90-degree perpendicular parking bay

export const PERPENDICULAR_PARKING: ScenarioConfig = {
  id: 'perpendicular_parking',
  title: 'Perpendicular Parking',
  titleRW: 'Guhagarika mu Gushira',
  description: 'Master the common 90-degree forward and reverse parking into a marked bay. Useful for most parking lots.',
  descriptionRW: 'Koresha uburyo bwo guhagarika imodoka neza mu buriri bwose.',
  difficulty: 'BEGINNER',
  location: 'Kigali — East Commercial Parking Lot',
  locationRW: 'Kigali — Ahantu h\'imodoka y\'Iburasirazuba',
  estimatedTime: '4-6 min',
  maxSpeed: 15,
  speedLimit: 10,
  xpReward: 350,
  trainingMode: true,
  objectives: [
    { id: 'approach', text: 'Approach the parking bay', textRW: 'Jya neza igerero ry\'uburiri', icon: '🚗' },
    { id: 'position', text: 'Position for turn-in', textRW: 'Itegura kugena injira', icon: '📍' },
    { id: 'drive_in', text: 'Drive forward into the bay', textRW: 'Injira neza mu buriri', icon: '⬆️' },
    { id: 'reverse_out', text: 'Reverse out safely', textRW: 'Subira neza inyuma', icon: '↩️' },
    { id: 'complete', text: 'Parking maneuver complete', textRW: 'Guhagarika byagenze neza', icon: '✅' },
  ],
  waypoints: [
    {
      id: 'PERP_APPROACH',
      position: [234, 0, 36],
      radius: 5,
      objective: 'Approach parking lot aisle',
      instruction: 'Drive slowly along the parking aisle, looking for your bay.',
      completed: false,
      instructorMessage: 'Approaching the parking bays. Go very slow and watch for your spot.',
    },
    {
      id: 'PERP_POSITION',
      position: [234, 0, 72],
      radius: 4,
      objective: 'Position opposite the bay',
      instruction: 'Stop opposite the target bay with your shoulder aligned to the bay start.',
      completed: false,
      instructorMessage: 'Stop here. Your shoulder should be level with the start of the parking bay.',
    },
    {
      id: 'PERP_DRIVE_IN',
      position: [252, 0, 72],
      radius: 3,
      objective: 'Turn in and drive forward',
      instruction: 'Full lock right, drive forward into the bay. Straighten at the end.',
      completed: false,
      instructorMessage: 'Full lock right! Drive in slowly. Straighten the wheel as you enter.',
    },
    {
      id: 'PERP_REVERSE_PREP',
      position: [252, 0, 36],
      radius: 3,
      objective: 'Reverse out of the bay',
      instruction: 'Select reverse. Check all around. Reverse out until you can see behind you.',
      completed: false,
      instructorMessage: 'Now reverse out. Check both sides. Go very slow — pedestrians may be behind.',
    },
    {
      id: 'PERP_COMPLETE',
      position: [234, 0, 36],
      radius: 5,
      objective: 'Complete parking maneuver',
      instruction: 'Straighten the wheel and drive forward. Parking maneuver complete.',
      completed: false,
      instructorMessage: 'Perfect perpendicular parking! You got it in one try. Well done.',
    },
  ],
};

// ─── Three-point Turn Scenario ────────────────────────────
// Location: North-West Narrow Road
// Route: Perform a three-point turn to reverse direction on a narrow road

export const THREE_POINT_TURN: ScenarioConfig = {
  id: 'three_point_turn',
  title: 'Three-point Turn',
  titleRW: 'Kuzinga Amahitamo Atatu',
  description: 'Learn to perform a three-point (Y-turn) to change direction on a road that is too narrow for a U-turn.',
  descriptionRW: 'Menya kuzinga neza imbere, inyuma, imbere kugira ngo ugure.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — North-West Narrow Road',
  locationRW: 'Kigali — Umuhanda Muto Iburengerazuba',
  estimatedTime: '5-7 min',
  maxSpeed: 20,
  speedLimit: 15,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'check_clear', text: 'Check road is clear', textRW: 'Reba umuhanda nta kindi', icon: '👀' },
    { id: 'first_forward', text: 'First forward to opposite side', textRW: 'Injira ku rundi rukono', icon: '➡️' },
    {
      id: 'reverse_back',
      text: 'Reverse back to other side',
      textRW: 'Subira inyuma ku rundi rukono',
      icon: '⬅️',
    },
    { id: 'second_forward', text: 'Second forward to face direction', textRW: 'Tangira imbere neza', icon: '⬆️' },
    { id: 'complete', text: 'Drive away in new direction', textRW: 'Tangira umugambi mushya', icon: '🚗' },
  ],
  waypoints: [
    {
      id: 'TPT_START',
      position: [-216, 0, -234],
      radius: 5,
      objective: 'Stop on narrow road',
      instruction: 'Pull over on the left side of the narrow road. Check all around.',
      completed: false,
      instructorMessage: 'Stop on the left side. Make sure the road is clear in both directions.',
    },
    {
      id: 'TPT_FORWARD_1',
      position: [-216, 0, -198],
      radius: 4,
      objective: 'First forward turn',
      instruction: 'Full lock right. Drive forward slowly until you reach the opposite edge.',
      completed: false,
      instructorMessage: 'Full lock right! Drive forward slowly to the opposite curb.',
    },
    {
      id: 'TPT_REVERSE',
      position: [-180, 0, -198],
      radius: 4,
      objective: 'Reverse to the left',
      instruction: 'Reverse. Full lock left. Back up to the left side of the road.',
      completed: false,
      instructorMessage: 'Now full lock left and reverse. Check behind you constantly!',
    },
    {
      id: 'TPT_COMPLETE',
      position: [-180, 0, -234],
      radius: 5,
      objective: 'Turn and drive away',
      instruction: 'Full lock right. Drive forward to complete the turn. Straighten and drive on.',
      completed: false,
      instructorMessage: 'Full lock right and drive forward. You are now facing the opposite way! Brilliant three-point turn.',
    },
  ],
};

// ─── Tunnel Driving Scenario ──────────────────────────────
// Location: Far South Underground Tunnel
// Route: Enter, drive through, and exit a long enclosed highway tunnel

export const TUNNEL_DRIVING: ScenarioConfig = {
  id: 'tunnel_driving',
  title: 'Tunnel Driving',
  titleRW: 'Gutwara mu Toneli',
  description: 'Safely navigate an enclosed highway tunnel including lighting changes, lane discipline, and narrow clearance.',
  descriptionRW: 'Twara neza mu toneli. Koresha lights n\'imbanza neza.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Far South Highway Tunnel',
  locationRW: 'Kigali — Toneli ya Highway Amajyepfo',
  estimatedTime: '6-8 min',
  maxSpeed: 60,
  speedLimit: 50,
  xpReward: 700,
  trainingMode: true,
  objectives: [
    { id: 'lights_on', text: 'Turn on headlights before entry', textRW: 'Tanga lights umbere yo injira', icon: '💡' },
    { id: 'stay_lane', text: 'Maintain strict lane position', textRW: 'Guma mu imbanza yawe', icon: '🛣️' },
    { id: 'no_stop', text: 'Do not stop inside tunnel', textRW: 'Ntugahagarike mu toneli', icon: '🚫' },
    { id: 'safe_distance', text: 'Keep extended following distance', textRW: 'Bika interasi nziza', icon: '📏' },
    { id: 'exit_safe', text: 'Adjust eyes on exit daylight', textRW: 'Reba neza usohoka', icon: '☀️' },
  ],
  waypoints: [
    {
      id: 'TD_APPROACH',
      position: [-72, 0, 252],
      radius: 5,
      objective: 'Approach tunnel entrance',
      instruction: 'The tunnel is ahead. Turn on your headlights before entering.',
      completed: false,
      instructorMessage: 'Tunnel coming up! Headlights on NOW. Before you enter, not after.',
    },
    {
      id: 'TD_ENTER',
      position: [-36, 0, 252],
      radius: 4,
      objective: 'Enter the tunnel',
      instruction: 'Enter the tunnel. Keep to the left lane and maintain speed.',
      completed: false,
      instructorMessage: 'Watch the sudden light change. Your eyes are adjusting. Stay in lane.',
    },
    {
      id: 'TD_DRIVE',
      position: [0, 0, 252],
      radius: 5,
      objective: 'Drive through the tunnel',
      instruction: 'Maintain your lane and speed. Do not change lanes inside the tunnel.',
      completed: false,
      instructorMessage: 'Good tunnel driving. Do NOT change lanes in here. Keep steady speed.',
    },
    {
      id: 'TD_CONTINUE',
      position: [36, 0, 252],
      radius: 5,
      objective: 'Continue toward exit',
      instruction: 'Still in tunnel. Watch for the exit daylight ahead.',
      completed: false,
      instructorMessage: 'You can see daylight at the end. Keep going — eyes ahead.',
    },
    {
      id: 'TD_EXIT',
      position: [72, 0, 252],
      radius: 5,
      objective: 'Exit the tunnel safely',
      instruction: 'Exit the tunnel. Be prepared for sudden bright daylight glare.',
      completed: false,
      instructorMessage: 'Excellent tunnel navigation! Wait a few seconds before turning off headlights.',
    },
  ],
};

// ─── Railway Crossing Scenario ────────────────────────────
// Location: West Side Railway Level Crossing
// Route: Approach, check, stop if required, and safely cross railway tracks

export const RAILWAY_CROSSING: ScenarioConfig = {
  id: 'railway_crossing',
  title: 'Railway Crossing',
  titleRW: 'Gusubiza Umuhanda wa Lire',
  description: 'Approach and cross a railway level crossing. Check for trains, obey signals, and never stop on the tracks.',
  descriptionRW: 'Gusubiza neza umuhanda wa lire. Tega indwara zose.',
  difficulty: 'BEGINNER',
  location: 'Kigali — West Side Railway Crossing',
  locationRW: 'Kigali — Umuhanda wa Lire Iburengerazuba',
  estimatedTime: '4-5 min',
  maxSpeed: 40,
  speedLimit: 20,
  xpReward: 300,
  trainingMode: true,
  objectives: [
    { id: 'approach_slow', text: 'Slow down on approach', textRW: 'Guma cyangwa umuvuduko', icon: '🐢' },
    { id: 'check_signals', text: 'Check lights and signals', textRW: 'Reba lights n\'ibimenyetso', icon: '🚦' },
    { id: 'look_listen', text: 'Look and listen for trains', textRW: 'Reba no kumvira indwara', icon: '👂' },
    { id: 'cross_safe', text: 'Cross tracks without stopping', textRW: 'Kugenda ntugahagarike', icon: '🚂' },
  ],
  waypoints: [
    {
      id: 'RC_APPROACH',
      position: [-234, 0, 126],
      radius: 5,
      objective: 'Approach railway crossing',
      instruction: 'Railway crossing ahead. Slow down and prepare to stop if needed.',
      completed: false,
      instructorMessage: 'Railway crossing ahead. Start reducing speed now.',
    },
    {
      id: 'RC_STOP_LINE',
      position: [-234, 0, 90],
      radius: 4,
      objective: 'Stop at the stop line',
      instruction: 'Stop before the stop line. Turn down radio. Check signals.',
      completed: false,
      instructorMessage: 'Stop at the line. Roll down your window. Listen for trains.',
    },
    {
      id: 'RC_LOOK',
      position: [-198, 0, 90],
      radius: 3,
      objective: 'Look both ways and listen',
      instruction: 'Look left and right twice. Listen carefully. Proceed only when clear.',
      completed: false,
      instructorMessage: 'Look LEFT, look RIGHT, look LEFT again! Do you see or hear any train?',
    },
    {
      id: 'RC_CROSS',
      position: [-198, 0, 126],
      radius: 5,
      objective: 'Cross tracks continuously',
      instruction: 'Cross the railway tracks without stopping. Maintain a steady speed.',
      completed: false,
      instructorMessage: 'It is clear! Go — but do NOT stop on the tracks for any reason.',
    },
  ],
};

// ─── Pedestrian Priority Scenario ─────────────────────────
// Location: Central-North Shopping District
// Route: Navigate busy shopping streets with frequent pedestrian crossings

export const PEDESTRIAN_PRIORITY: ScenarioConfig = {
  id: 'pedestrian_priority',
  title: 'Pedestrian Priority',
  titleRW: 'Abagenzi Bafite Ubwigenge',
  description: 'Drive through a busy pedestrian area with frequent crossings. Always give way to pedestrians on the road.',
  descriptionRW: 'Twara neza hari abagenzi benshi. Batega abazana ku muhanda.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Central-North Shopping District',
  locationRW: 'Kigali — Akarere ka Amashuru Katambwe',
  estimatedTime: '4-6 min',
  maxSpeed: 30,
  speedLimit: 25,
  xpReward: 300,
  trainingMode: true,
  objectives: [
    { id: 'slow_zone', text: 'Maintain low speed in zone', textRW: 'Guma cyangwa umuvuduko', icon: '🚶' },
    { id: 'yield_crossing', text: 'Yield at zebra crossing', textRW: 'Tega abazana ku zebra', icon: '🚸' },
    { id: 'stop_ped', text: 'Stop for stepping pedestrians', textRW: 'Hagarika abazana', icon: '🛑' },
    { id: 'patience', text: 'Wait patiently for all to cross', textRW: 'Subiriza neza abagenzi', icon: '⏳' },
    { id: 'proceed', text: 'Proceed when crossing is clear', textRW: 'Tangira neza igihe hari abari', icon: '🚗' },
  ],
  waypoints: [
    {
      id: 'PED_START',
      position: [90, 0, 18],
      radius: 5,
      objective: 'Enter pedestrian zone',
      instruction: 'Entering busy shopping district. Pedestrians everywhere. Slow down.',
      completed: false,
      instructorMessage: 'Pedestrian zone. Very low speed. Watch every side for people stepping out.',
    },
    {
      id: 'PED_CROSSING_1',
      position: [90, 0, 54],
      radius: 4,
      objective: 'Stop for zebra crossing',
      instruction: 'Zebra crossing ahead with pedestrians waiting. Stop and let them cross.',
      completed: false,
      instructorMessage: 'Zebra crossing! Stop NOW. Those pedestrians have priority.',
    },
    {
      id: 'PED_WAIT',
      position: [54, 0, 54],
      radius: 4,
      objective: 'Wait for all pedestrians',
      instruction: 'Wait until all pedestrians have completely crossed before moving.',
      completed: false,
      instructorMessage: 'Wait. Do NOT creep forward. Let everyone finish crossing safely.',
    },
    {
      id: 'PED_DRIVE',
      position: [54, 0, 18],
      radius: 4,
      objective: 'Continue through zone',
      instruction: 'Crossing clear. Continue slowly through the shopping street.',
      completed: false,
      instructorMessage: 'Good. Now drive on. Still watching for shoppers between parked cars.',
    },
    {
      id: 'PED_COMPLETE',
      position: [90, 0, 18],
      radius: 5,
      objective: 'Exit pedestrian zone',
      instruction: 'Exiting the pedestrian zone. Excellent pedestrian awareness.',
      completed: false,
      instructorMessage: 'Perfect pedestrian courtesy! You let everyone cross safely.',
    },
  ],
};

// ─── Cyclist Awareness Scenario ───────────────────────────
// Location: East-Central Residential with Bike Lanes
// Route: Share the road with cyclists, check blind spots, overtake safely

export const CYCLIST_AWARENESS: ScenarioConfig = {
  id: 'cyclist_awareness',
  title: 'Cyclist Awareness',
  titleRW: 'Gumenya Abakoresha Baiskeli',
  description: 'Share the road safely with cyclists. Maintain passing distance, check bike boxes, and watch for turning riders.',
  descriptionRW: 'Guhamagarira abakoresha baiskeli. Bika interasi nziza.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — East-Central Residential Bike Route',
  locationRW: 'Kigali — Umuhanda w\'Abakoresha Baiskeli',
  estimatedTime: '5-7 min',
  maxSpeed: 40,
  speedLimit: 35,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'notice', text: 'Notice cyclists early', textRW: 'Reba abana baiskeli', icon: '🚲' },
    { id: 'distance', text: 'Maintain 1.5m passing distance', textRW: 'Bika interasi 1.5m', icon: '📏' },
    { id: 'blind_spot', text: 'Check blind spot before turns', textRW: 'Reba aho ntiboneka', icon: '👀' },
    { id: 'overtake_safe', text: 'Overtake cyclists safely', textRW: 'Gusubiza neza baiskeli', icon: '↗️' },
    { id: 'turn_safe', text: 'Do not cut off cyclists', textRW: 'Ntukavurira abaiskeli', icon: '🔄' },
  ],
  waypoints: [
    {
      id: 'CYC_START',
      position: [162, 0, -144],
      radius: 5,
      objective: 'Start on bike route road',
      instruction: 'This road has a bike lane. Watch for cyclists and share the road.',
      completed: false,
      instructorMessage: 'Bike lane ahead. Watch for cyclists. Do not drive in the bike lane.',
    },
    {
      id: 'CYC_FOLLOW',
      position: [162, 0, -108],
      radius: 5,
      objective: 'Follow cyclist at safe distance',
      instruction: 'A cyclist is ahead. Stay back and wait for a safe place to pass.',
      completed: false,
      instructorMessage: 'Cyclist ahead. Drop back and give them plenty of space.',
    },
    {
      id: 'CYC_OVERTAKE',
      position: [126, 0, -108],
      radius: 4,
      objective: 'Overtake with 1.5m clearance',
      instruction: 'Road clear ahead. Signal, move right, overtake with at least 1.5m clearance.',
      completed: false,
      instructorMessage: 'Clear to overtake. Signal right. Go WIDE — at least 1.5 meters from the cyclist.',
    },
    {
      id: 'CYC_TURN',
      position: [126, 0, -72],
      radius: 4,
      objective: 'Check for cyclists before turn',
      instruction: 'Turning left. Check your blind spot carefully for cyclists on the inside.',
      completed: false,
      instructorMessage: 'Left turn coming. Check BOTH mirrors AND your blind spot for cyclists!',
    },
    {
      id: 'CYC_COMPLETE',
      position: [162, 0, -72],
      radius: 5,
      objective: 'Complete route safely',
      instruction: 'You passed all cyclist hazards. Good awareness!',
      completed: false,
      instructorMessage: 'Excellent cyclist awareness! You shared the road responsibly.',
    },
  ],
};

// ─── Rural Village Scenario ───────────────────────────────
// Location: Far South-East Rural Village
// Route: Narrow winding rural road through a village with animals, markets, and pedestrians

export const RURAL_VILLAGE: ScenarioConfig = {
  id: 'rural_village',
  title: 'Rural Village Driving',
  titleRW: 'Gutwara mu Muryango',
  description: 'Drive through a rural village with narrow unmarked roads, livestock, market stalls, and children playing.',
  descriptionRW: 'Twara neza mu muryango hari inka n\'abana bakinaga.',
  difficulty: 'BEGINNER',
  location: 'Kigali — Far South-East Rural Village',
  locationRW: 'Kigali — Umuryango w\'Iburasirazuba',
  estimatedTime: '5-7 min',
  maxSpeed: 30,
  speedLimit: 20,
  xpReward: 350,
  trainingMode: true,
  objectives: [
    { id: 'very_slow', text: 'Drive at walking pace in village', textRW: 'Guma cyangwa umuvuduko', icon: '🚶' },
    { id: 'animals', text: 'Watch for livestock on road', textRW: 'Reba inyamaswa ku muhanda', icon: '🐐' },
    { id: 'stalls', text: 'Avoid market stalls', textRW: 'Zura amasozi y\'amasoko', icon: '🛒' },
    { id: 'children', text: 'Watch for playing children', textRW: 'Reba abana bakina', icon: '👶' },
  ],
  waypoints: [
    {
      id: 'RV_ENTER',
      position: [252, 0, 198],
      radius: 5,
      objective: 'Enter the rural village',
      instruction: 'Village ahead. Reduce speed to walking pace immediately.',
      completed: false,
      instructorMessage: 'Welcome to the village! Slow to a crawl. Expect anything on the road.',
    },
    {
      id: 'RV_ANIMALS',
      position: [252, 0, 234],
      radius: 4,
      objective: 'Stop for crossing goats',
      instruction: 'Livestock crossing the road. Stop and wait. Do NOT honk at animals.',
      completed: false,
      instructorMessage: 'Goats crossing! STOP. Do not honk — you will scare them.',
    },
    {
      id: 'RV_STALLS',
      position: [216, 0, 234],
      radius: 4,
      objective: 'Navigate around market stalls',
      instruction: 'Market stalls on both sides. Squeeze through slowly.',
      completed: false,
      instructorMessage: 'Market stalls narrowing the road. Go very slow. Watch both mirrors.',
    },
    {
      id: 'RV_EXIT',
      position: [216, 0, 198],
      radius: 5,
      objective: 'Exit the village safely',
      instruction: 'Leaving the village. Check all clear before speeding up.',
      completed: false,
      instructorMessage: 'Great village driving! You kept the villagers and animals safe.',
    },
  ],
};

// ─── Bridge Crossing Scenario ─────────────────────────────
// Location: South-West River Crossing Bridge
// Route: Cross a narrow multi-lane bridge over a river, with wind and head-on traffic

export const BRIDGE_CROSSING: ScenarioConfig = {
  id: 'bridge_crossing',
  title: 'Bridge Crossing',
  titleRW: 'Gusubiza Umurongo',
  description: 'Safely cross a narrow bridge over a river. Deal with crosswinds, oncoming vehicles, and no overtaking.',
  descriptionRW: 'Gusubiza neza umurongo. Tega imyaka n\'imodoka zibera.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — South-West River Bridge',
  locationRW: 'Kigali — Umurongo w\'Umuyaga Amajyepfo',
  estimatedTime: '5-6 min',
  maxSpeed: 45,
  speedLimit: 40,
  xpReward: 450,
  trainingMode: true,
  objectives: [
    { id: 'approach', text: 'Stay left on approach', textRW: 'Guma ku rukonyo rwa kumeri', icon: '⬅️' },
    { id: 'no_overtake', text: 'Never overtake on bridge', textRW: 'Nta gusubiza umurongo', icon: '🚫' },
    { id: 'grip_wheel', text: 'Hold wheel for crosswinds', textRW: 'Gumana na steering', icon: '💪' },
    { id: 'head_on', text: 'Give space to oncoming traffic', textRW: 'Bika interasi n\'izibera', icon: '🚗' },
    { id: 'clear', text: 'Speed up after clear of bridge', textRW: 'Sogora usobanura', icon: '⚡' },
  ],
  waypoints: [
    {
      id: 'BR_APPROACH',
      position: [-144, 0, 162],
      radius: 5,
      objective: 'Approach the bridge',
      instruction: 'Bridge ahead. Move to the left lane. Do not overtake on the bridge.',
      completed: false,
      instructorMessage: 'Bridge ahead. Stay left. No overtaking on this bridge.',
    },
    {
      id: 'BR_ENTER',
      position: [-144, 0, 198],
      radius: 4,
      objective: 'Enter the bridge',
      instruction: 'Enter the bridge. Keep both hands on the wheel for crosswind gusts.',
      completed: false,
      instructorMessage: 'On the bridge. Grip the wheel firmly — crosswinds can push you sideways.',
    },
    {
      id: 'BR_MID',
      position: [-108, 0, 198],
      radius: 4,
      objective: 'Pass oncoming vehicle',
      instruction: 'Oncoming vehicle. Move slightly left and give plenty of clearance.',
      completed: false,
      instructorMessage: 'Truck coming. Drift slightly left. Give it room. Do NOT panic.',
    },
    {
      id: 'BR_EXIT',
      position: [-108, 0, 162],
      radius: 5,
      objective: 'Exit the bridge',
      instruction: 'Clear of bridge. Check behind and gradually accelerate back to normal speed.',
      completed: false,
      instructorMessage: 'Off the bridge. Good job! That crosswind was tricky but you handled it.',
    },
    {
      id: 'BR_COMPLETE',
      position: [-144, 0, 162],
      radius: 5,
      objective: 'Crossing complete',
      instruction: 'Return via the bridge access road.',
      completed: false,
      instructorMessage: 'Excellent bridge crossing! You kept your lane and your composure.',
    },
  ],
};

// ─── Sun Glare / Dazzle Scenario ──────────────────────────
// Location: North-West Sunset Highway
// Route: Driving directly into low sun angle with severe glare and reduced visibility

export const SUN_GLARE: ScenarioConfig = {
  id: 'sun_glare',
  title: 'Sun Glare / Dazzle Driving',
  titleRW: 'Gutwara Hari Izuwa Ryakomeye',
  description: 'Drive directly into low-angle sun glare. Use sun visor, increase following distance, and anticipate hazards.',
  descriptionRW: 'Twara neza hari izuwa ryakomeye. Koresha sun visor.',
  difficulty: 'ADVANCED',
  location: 'Kigali — North-West Sunset Highway',
  locationRW: 'Kigali — Highway y\'Izuwa riryoshye',
  estimatedTime: '5-7 min',
  maxSpeed: 50,
  speedLimit: 40,
  xpReward: 700,
  trainingMode: true,
  environment: {
    timeOfDay: 18,
    weather: 'clear',
  },
  objectives: [
    { id: 'visor', text: 'Deploy sun visor immediately', textRW: 'Tangira sun visor', icon: '😎' },
    { id: 'distance', text: 'Double following distance', textRW: 'Bibwire interasi', icon: '📏' },
    { id: 'speed', text: 'Reduce speed significantly', textRW: 'Guma cyangwa umuvuduko', icon: '🐢' },
    { id: 'hazards', text: 'Anticipate hidden hazards', textRW: 'Reba ibintu ntibiboneka', icon: '⚠️' },
  ],
  waypoints: [
    {
      id: 'SG_START',
      position: [-54, 0, 180],
      radius: 5,
      objective: 'Drive into sun glare area',
      instruction: 'Low sun directly ahead. Severe glare. Visor down NOW.',
      completed: false,
      instructorMessage: 'Sun glare zone starting. Visor down! Visibility is dropping rapidly.',
    },
    {
      id: 'SG_DRIVE_1',
      position: [-54, 0, 216],
      radius: 5,
      objective: 'Maintain doubled following distance',
      instruction: 'Double your following distance. Drop speed to 40 km/h.',
      completed: false,
      instructorMessage: 'You can barely see the car ahead, right? Double your distance NOW.',
    },
    {
      id: 'SG_TURN',
      position: [-18, 0, 216],
      radius: 4,
      objective: 'Turn with reduced visibility',
      instruction: 'Turn right. Lane markings are hard to see in glare. Use road edge.',
      completed: false,
      instructorMessage: 'Turn right. The lane lines are invisible. Use the left curb as reference.',
    },
    {
      id: 'SG_COMPLETE',
      position: [-18, 0, 180],
      radius: 5,
      objective: 'Glare zone passed',
      instruction: 'Sun angle changed. Glare easing. Return to normal speed gradually.',
      completed: false,
      instructorMessage: 'Glare is finally easing. Well done. That was like driving blind!',
    },
  ],
};

// ─── Defensive Braking Scenario ───────────────────────────
// Location: Central-East Urban Road
// Route: Practice defensive and emergency braking for unexpected road hazards

export const DEFENSIVE_BRAKING: ScenarioConfig = {
  id: 'defensive_braking',
  title: 'Defensive Braking',
  titleRW: 'Kugenda Kugira Neza',
  description: 'Practice defensive and emergency braking techniques for sudden hazards — car stops, ball rolls out, etc.',
  descriptionRW: 'Menya kugenda neza kandi ugabanya igihe hari ikibazo.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — Central-East Urban Road',
  locationRW: 'Kigali — Umuhanda W\'Iburasirazuba',
  estimatedTime: '4-6 min',
  maxSpeed: 50,
  speedLimit: 45,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'anticipate', text: 'Scan for brake lights ahead', textRW: 'Reba ibitangazamavuga', icon: '🔴' },
    { id: 'smooth', text: 'Brake smoothly and early', textRW: 'Hagarika buhoro', icon: '🛑' },
    { id: 'emergency', text: 'Emergency stop when needed', textRW: 'Hagarika vuba neza', icon: '💥' },
    { id: 'escape', text: 'Steer around if possible', textRW: 'Zura nshya igihe bishoboka', icon: '↪️' },
    { id: 'control', text: 'Maintain steering control', textRW: 'Guma ufite steering', icon: '🎮' },
  ],
  waypoints: [
    {
      id: 'DB_START',
      position: [72, 0, 18],
      radius: 5,
      objective: 'Drive scanning ahead',
      instruction: 'Drive at 45 km/h. Scan far ahead for brake lights and hazards.',
      completed: false,
      instructorMessage: 'Driving speed. Look 12 seconds ahead. Brake lights, intersections, parked cars.',
    },
    {
      id: 'DB_BRAKE_LIGHTS',
      position: [72, 0, 54],
      radius: 4,
      objective: 'Brake for brake lights ahead',
      instruction: 'Car ahead brakes. Brake smoothly now. Do not jam on.',
      completed: false,
      instructorMessage: 'Brake lights ahead! Start braking SMOOTHLY right now.',
    },
    {
      id: 'DB_EMERGENCY',
      position: [108, 0, 54],
      radius: 4,
      objective: 'Emergency stop for hazard',
      instruction: 'Child runs out! EMERGENCY STOP. Hard brake, keep straight.',
      completed: false,
      instructorMessage: 'BALL + CHILD IN ROAD — STOP NOW! FULLY BRAKE. STEER STRAIGHT.',
    },
    {
      id: 'DB_CONTINUE',
      position: [108, 0, 18],
      radius: 4,
      objective: 'Proceed after hazard',
      instruction: 'Hazard cleared. Check mirrors, signal, continue your drive.',
      completed: false,
      instructorMessage: 'Phew! Hazard avoided. Calm down and carry on. Good reaction time.',
    },
    {
      id: 'DB_COMPLETE',
      position: [72, 0, 18],
      radius: 5,
      objective: 'Defensive drive complete',
      instruction: 'Return to starting point. Continue scanning defensively.',
      completed: false,
      instructorMessage: 'Top-notch defensive driving! You reacted to every hazard perfectly.',
    },
  ],
};

// ─── Lane Discipline Scenario ─────────────────────────────
// Location: North Grid Multi-Lane Road
// Route: Multi-lane highway-style road. Practice proper lane keeping, lane choice, and lane change signaling.

export const LANE_DISCIPLINE: ScenarioConfig = {
  id: 'lane_discipline',
  title: 'Lane Discipline',
  titleRW: 'Guma mu Imbanza',
  description: 'Master proper lane discipline: keep left, overtake right, return left, signal for every lane change.',
  descriptionRW: 'Guma mu imbanza yawe. Gusubiza ku kunyuma no kugaruka.',
  difficulty: 'BEGINNER',
  location: 'Kigali — North Grid Multi-Lane Road',
  locationRW: 'Kigali — Umuhanda W\'Imbanza Nnyinshi Amajyaruguru',
  estimatedTime: '4-6 min',
  maxSpeed: 55,
  speedLimit: 50,
  xpReward: 300,
  trainingMode: true,
  objectives: [
    { id: 'keep_left', text: 'Keep to the left lane', textRW: 'Guma ku rukonyo rwa kumeri', icon: '⬅️' },
    { id: 'signal_change', text: 'Signal every lane change', textRW: 'Oreza igihe usubiza', icon: '🔆' },
    { id: 'mirrors', text: 'Check mirrors every change', textRW: 'Reba mirrors buri gihe', icon: '🪞' },
    { id: 'overtake_right', text: 'Overtake on the right only', textRW: 'Gusubiza ku rukonyo rwa kuburyo', icon: '➡️' },
    { id: 'return_left', text: 'Return to left lane after', textRW: 'Garuka ku rukonyo rwa kumeri', icon: '⬅️' },
  ],
  waypoints: [
    {
      id: 'LD_START',
      position: [-18, 0, 270],
      radius: 5,
      objective: 'Start in left lane',
      instruction: 'Start in the left lane of this three-lane road. Maintain 50 km/h.',
      completed: false,
      instructorMessage: 'Stay in the LEFT lane unless you are overtaking. Rule #1.',
    },
    {
      id: 'LD_CHANGE_RIGHT',
      position: [-18, 0, 234],
      radius: 5,
      objective: 'Change to right lane',
      instruction: 'Prepare to overtake. Signal right, check mirrors, change to right lane.',
      completed: false,
      instructorMessage: 'Time to overtake. SIGNAL RIGHT first. Check mirrors. Change lanes smoothly.',
    },
    {
      id: 'LD_OVERTAKE',
      position: [18, 0, 234],
      radius: 5,
      objective: 'Overtake in right lane',
      instruction: 'Pass the slower vehicle in the right lane. Maintain speed.',
      completed: false,
      instructorMessage: 'Good overtake. Now signal LEFT — do NOT stay in the right lane!',
    },
    {
      id: 'LD_RETURN_LEFT',
      position: [18, 0, 270],
      radius: 5,
      objective: 'Return to left lane',
      instruction: 'Signal left, check mirrors, return to the left lane.',
      completed: false,
      instructorMessage: 'Return to the left lane now. The right lane is for overtaking only.',
    },
    {
      id: 'LD_COMPLETE',
      position: [-18, 0, 270],
      radius: 5,
      objective: 'Lane discipline complete',
      instruction: 'Back in left lane. Excellent lane discipline!',
      completed: false,
      instructorMessage: 'Perfect lane discipline! Signal, mirror, change. You\'ve got it.',
    },
  ],
};

// ─── Traffic Police Hand Signals Scenario ─────────────────
// Location: North Road Intersection
// Route: Approach intersection controlled by traffic officer instead of lights

export const TRAFFIC_POLICE_SIGNALS: ScenarioConfig = {
  id: 'traffic_police_signals',
  title: 'Traffic Police Signals',
  titleRW: 'Ibimenyetso by\'Umusirikare',
  description: 'Drive through an intersection controlled by a traffic police officer using hand signals instead of failed lights.',
  descriptionRW: 'Twara neza hari umusirikare azana ibimenyetso n\'amakara.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — North Road Intersection',
  locationRW: 'Kigali — Ahantu Hugezweho Amajyaruguru',
  estimatedTime: '4-6 min',
  maxSpeed: 35,
  speedLimit: 30,
  xpReward: 450,
  trainingMode: true,
  objectives: [
    { id: 'approach_slow', text: 'Slow down on approach', textRW: 'Guma cyangwa umuvuduko', icon: '🐢' },
    { id: 'observe', text: 'Watch officer continuously', textRW: 'Reba umusirikare guhanga', icon: '👮' },
    { id: 'stop_signal', text: 'Obey STOP signal', textRW: 'Kurikiza ibyo hagarika', icon: '✋' },
    { id: 'go_signal', text: 'Go on GO signal only', textRW: 'Genda igihe bisobanura', icon: '👋' },
  ],
  waypoints: [
    {
      id: 'TPS_APPROACH',
      position: [18, 0, -216],
      radius: 5,
      objective: 'Approach controlled intersection',
      instruction: 'Traffic lights failed. Police officer is controlling. Slow and watch for signals.',
      completed: false,
      instructorMessage: 'Lights are out. There is a police officer. Slow down — watch his hands carefully.',
    },
    {
      id: 'TPS_STOP',
      position: [18, 0, -180],
      radius: 4,
      objective: 'Stop for stop signal',
      instruction: 'Officer shows palm out STOP signal. Come to a halt.',
      completed: false,
      instructorMessage: 'STOP! Palm raised means STOP. Do NOT creep forward — stay back.',
    },
    {
      id: 'TPS_WAIT',
      position: [72, 0, -180],
      radius: 4,
      objective: 'Wait for clear signal',
      instruction: 'Officer waves other directions through. Wait your turn patiently.',
      completed: false,
      instructorMessage: 'He is letting other directions go. Wait patiently. Your turn is coming.',
    },
    {
      id: 'TPS_GO',
      position: [72, 0, -216],
      radius: 5,
      objective: 'Proceed on wave-through',
      instruction: 'Officer waves you through. Move through the intersection carefully.',
      completed: false,
      instructorMessage: 'He waves YOU through! Go. But keep watching him as you cross.',
    },
  ],
};

// ─── Alcohol Awareness (Impaired Simulation) Scenario ─────
// Location: Far West Late-Night Road
// Route: Simulated impaired driving experience — delayed response, exaggerated steering, poor judgment

export const ALCOHOL_AWARENESS: ScenarioConfig = {
  id: 'alcohol_awareness',
  title: 'Alcohol Awareness Simulation',
  titleRW: 'Gumenya Ibyiza ku Bihe',
  description: 'Experience a SIMULATION of alcohol-impaired driving to understand the extreme dangers of drinking and driving.',
  descriptionRW: 'Menya neza icyo bihe bya alkohol bifite abandi.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Far West Late-Night Road',
  locationRW: 'Kigali — Umuhanda wa Joro Iburengerazuba',
  estimatedTime: '5-7 min',
  maxSpeed: 50,
  speedLimit: 40,
  xpReward: 850,
  trainingMode: true,
  environment: {
    timeOfDay: 23,
  },
  objectives: [
    { id: 'aware', text: 'Understand effects of alcohol', textRW: 'Menya ibitekerezo bya alkohol', icon: '🍺' },
    { id: 'reaction', text: 'Notice slower reaction time', textRW: 'Reba igihe kidutahiza', icon: '⏱️' },
    { id: 'steering', text: 'Feel exaggerated steering', textRW: 'Reba steering itemeye', icon: '🎮' },
    { id: 'lesson', text: 'Learn: never drink and drive', textRW: 'Wifuza: ntugute nk\'igipimo', icon: '🚫' },
  ],
  waypoints: [
    {
      id: 'AA_START',
      position: [-252, 0, 162],
      radius: 5,
      objective: 'Begin simulation: BAC over limit',
      instruction: 'SIMULATION STARTED: Your reactions are delayed and steering is exaggerated. Try to stay in lane.',
      completed: false,
      instructorMessage: 'WARNING: This is what driving drunk feels like. Reactions are 50% slower. Steering overshoots.',
    },
    {
      id: 'AA_DRIVE_1',
      position: [-252, 0, 216],
      radius: 5,
      objective: 'Try to stay in your lane',
      instruction: 'Keep the car in the left lane. Notice how you cannot correct smoothly.',
      completed: false,
      instructorMessage: 'See that? You\'re weaving all over! This is with just a few drinks.',
    },
    {
      id: 'AA_REACT',
      position: [-216, 0, 216],
      radius: 4,
      objective: 'React to stopped car ahead',
      instruction: 'Car stopped ahead. Brake! But your reaction is delayed.',
      completed: false,
      instructorMessage: 'CAR STOPPED — BRAKE! But you cannot react fast enough. This is the danger.',
    },
    {
      id: 'AA_LESSON',
      position: [-216, 0, 162],
      radius: 5,
      objective: 'Simulation ends — lesson learned',
      instruction: 'SIMULATION OVER. Effects clear. NEVER drink and drive — take a taxi.',
      completed: false,
      instructorMessage: 'SIMULATION END. Now you understand. ONE drink is too many. Always have a designated driver!',
    },
  ],
};

// ─── Load Securing Scenario ───────────────────────────────
// Location: West-South Industrial Distribution Route
// Route: Drive a loaded vehicle. Experience handling with cargo shift, braking difference, and turns

export const LOAD_SECURING: ScenarioConfig = {
  id: 'load_securing',
  title: 'Load Securing & Handling',
  titleRW: 'Gucunga Ibitabo n\'Igikoresho',
  description: 'Drive a heavily loaded vehicle. Learn how cargo affects braking distance, turning, and stability if not secured.',
  descriptionRW: 'Twara neza hari amagambo menshi. Menya guhagarika kandi guzenguruka.',
  difficulty: 'INTERMEDIATE',
  location: 'Kigali — West-South Industrial Route',
  locationRW: 'Kigali — Umuhanda w\'Amadini Iburengerazuba',
  estimatedTime: '5-7 min',
  maxSpeed: 45,
  speedLimit: 40,
  xpReward: 500,
  trainingMode: true,
  objectives: [
    { id: 'check_load', text: 'Verify load is secured', textRW: 'Reba ibitabo byitegure', icon: '📦' },
    { id: 'early_brake', text: 'Brake earlier — load weight', textRW: 'Hagarika mbere', icon: '🛑' },
    { id: 'slow_turn', text: 'Turn slower with load', textRW: 'Gusubiza kandi cyangwa', icon: '🔄' },
    { id: 'stability', text: 'Maintain stability', textRW: 'Guma ufite ubwiza', icon: '⚖️' },
    { id: 'distance', text: 'Increase following distance', textRW: 'Bika interasi', icon: '📏' },
  ],
  waypoints: [
    {
      id: 'LS_START',
      position: [-162, 0, 54],
      radius: 5,
      objective: 'Start with cargo load',
      instruction: 'Vehicle is carrying a full load. Braking distance is doubled. Steering is sluggish.',
      completed: false,
      instructorMessage: 'Full load on board. Everything feels heavier. Brake twice as early.',
    },
    {
      id: 'LS_BRAKE',
      position: [-162, 0, 90],
      radius: 5,
      objective: 'Brake with increased distance',
      instruction: 'Stop sign ahead. Brake much earlier than you normally would.',
      completed: false,
      instructorMessage: 'BRAKING — start NOW! Loaded vehicle takes MUCH longer to stop.',
    },
    {
      id: 'LS_TURN',
      position: [-126, 0, 90],
      radius: 4,
      objective: 'Turn slowly with load',
      instruction: 'Right turn. Slow down well before. Go around the turn very slowly.',
      completed: false,
      instructorMessage: 'Slow DOWN before this turn. Heavy load wants to tip if you turn too fast.',
    },
    {
      id: 'LS_DRIVE',
      position: [-126, 0, 54],
      radius: 5,
      objective: 'Maintain stability straight',
      instruction: 'Continue straight. Feel the reduced responsiveness. Allow extra space.',
      completed: false,
      instructorMessage: 'Keep a bigger gap ahead. You cannot swerve or stop like an empty car.',
    },
    {
      id: 'LS_COMPLETE',
      position: [-162, 0, 54],
      radius: 5,
      objective: 'Load handling complete',
      instruction: 'Return to depot. Good load handling!',
      completed: false,
      instructorMessage: 'Good load sense! You adjusted braking and steering perfectly for the cargo.',
    },
  ],
};

// ─── Wildlife Hazard Scenario ─────────────────────────────
// Location: Far South-West Game Reserve Edge
// Route: Rural road through game reserve area with sudden wildlife crossings — deer, antelope, warthogs

export const WILDLIFE_HAZARD: ScenarioConfig = {
  id: 'wildlife_hazard',
  title: 'Wildlife Hazard Driving',
  titleRW: 'Gutwara Hari Inyamaswa',
  description: 'Drive through a game reserve border road at dawn. Watch for wildlife suddenly crossing the road.',
  descriptionRW: 'Twara neza hari inyamaswa zibera zina mu muhanda.',
  difficulty: 'ADVANCED',
  location: 'Kigali — Far South-West Game Reserve',
  locationRW: 'Kigali — Intambwe y\'Inyamaswa Amajyepfo',
  estimatedTime: '6-8 min',
  maxSpeed: 45,
  speedLimit: 35,
  xpReward: 850,
  trainingMode: true,
  environment: {
    timeOfDay: 6,
  },
  objectives: [
    { id: 'scan_sides', text: 'Scan bushes continuously', textRW: 'Reba imisozi y\'itsi', icon: '🌳' },
    { id: 'dawn', text: 'Reduce speed dawn/dusk', textRW: 'Guma cyangwa isuku', icon: '🌅' },
    { id: 'do_not_swerve', text: 'Do NOT swerve for animals', textRW: 'Ntugende zanyurira inyamaswa', icon: '🚫' },
    { id: 'brake_hard', text: 'Brake firmly in lane', textRW: 'Hagarika neza mu imbanza', icon: '🛑' },
    { id: 'herd', text: 'Stop for crossing herds', textRW: 'Hagarika intego zose', icon: '🦌' },
  ],
  waypoints: [
    {
      id: 'WH_ENTER',
      position: [-234, 0, 198],
      radius: 5,
      objective: 'Enter game reserve road',
      instruction: 'Dawn on reserve border. Wildlife is most active now. Scan both sides constantly.',
      completed: false,
      instructorMessage: 'Game reserve border. Dawn = animals crossing. Scan the verges non-stop!',
    },
    {
      id: 'WH_WARTHOG',
      position: [-234, 0, 234],
      radius: 4,
      objective: 'Brake for warthog',
      instruction: 'Warthog runs into road! BRAKE firmly in lane. Do NOT swerve.',
      completed: false,
      instructorMessage: 'WARTHOG IN ROAD — BRAKE! But STAY IN LANE. Swerving = rollover!',
    },
    {
      id: 'WH_HERD',
      position: [-198, 0, 234],
      radius: 4,
      objective: 'Stop and wait for herd',
      instruction: 'Herd of antelopes streaming across. Stop, turn off engine, wait.',
      completed: false,
      instructorMessage: 'WHOLE HERD crossing! Turn off your engine. This could take 5 minutes.',
    },
    {
      id: 'WH_DRIVE',
      position: [-198, 0, 198],
      radius: 5,
      objective: 'Proceed when clear',
      instruction: 'Herd cleared. Count to 3, then proceed slowly.',
      completed: false,
      instructorMessage: 'All clear? Wait 3 more seconds. Then drive on slowly — stragglers.',
    },
    {
      id: 'WH_COMPLETE',
      position: [-234, 0, 198],
      radius: 5,
      objective: 'Exit reserve safely',
      instruction: 'Exiting reserve boundary. Wildlife hazard reduced.',
      completed: false,
      instructorMessage: 'Great wildlife driving! You didn\'t swerve and you saved animals AND yourself.',
    },
  ],
};

// ─── Ice / Cold Conditions Scenario ───────────────────────
// Location: North-West Corner Highland Road
// Route: Simulated icy road conditions with extremely reduced traction. Very gentle steering, braking, throttle.

export const ICE_CONDITIONS: ScenarioConfig = {
  id: 'ice_conditions',
  title: 'Ice & Cold Conditions',
  titleRW: 'Gutwara mu Mafuri y\'Umukeceri',
  description: 'Drive in simulated black ice conditions with near-zero traction. Every input — steering, brake, throttle — must be extremely gentle.',
  descriptionRW: 'Twara neza hari umukeceri. Ibyose bikomeye kandi bikomeye.',
  difficulty: 'ADVANCED',
  location: 'Kigali — North-West Highland Ice Road',
  locationRW: 'Kigali — Umuhanda W\'Umukeceri Iburengerazuba',
  estimatedTime: '6-8 min',
  maxSpeed: 30,
  speedLimit: 20,
  xpReward: 900,
  trainingMode: true,
  environment: {
    timeOfDay: 5,
    weather: 'overcast',
  },
  objectives: [
    { id: 'smooth', text: 'Every input extremely smooth', textRW: 'Ibyose bikomeye neza', icon: '🧊' },
    { id: 'no_sudden', text: 'No sudden steering/brake', textRW: 'Nta bikingi bya steering', icon: '🚫' },
    { id: 'engine_brake', text: 'Use engine braking mainly', textRW: 'Koresha gear hagarika', icon: '⚙️' },
    { id: 'slow_turn', text: 'Turns: almost no speed', textRW: 'Imfuruka: nta cyenda', icon: '🔄' },
    { id: 'skid', text: 'If skid: steer INTO skid', textRW: 'Igihe wikanwa: zura aho uri', icon: '↪️' },
  ],
  waypoints: [
    {
      id: 'ICE_ENTER',
      position: [-234, 0, -270],
      radius: 5,
      objective: 'Enter black ice zone',
      instruction: 'BLACK ICE WARNING. Traction 10% of normal. Every movement must be SMOOTH and TINY.',
      completed: false,
      instructorMessage: 'ICE ZONE. Traction is zero. Gently. Gently. Gently. If you jerk anything, you spin.',
    },
    {
      id: 'ICE_DRIVE',
      position: [-198, 0, -270],
      radius: 5,
      objective: 'Maintain straight line on ice',
      instruction: 'Steer with fingertips only. Throttle as light as a feather.',
      completed: false,
      instructorMessage: 'Good. Fingertips on wheel. Feather throttle. Keep it straight. Don\'t twitch.',
    },
    {
      id: 'ICE_BRAKE',
      position: [-198, 0, -234],
      radius: 4,
      objective: 'Stop using engine braking',
      instruction: 'Stop sign. Downshift to slow. Very gentle brake. Pump if skidding.',
      completed: false,
      instructorMessage: 'STOP. DOWNGEAR first. THEN gently brake. Do NOT slam — you will spin 360!',
    },
    {
      id: 'ICE_TURN',
      position: [-234, 0, -234],
      radius: 4,
      objective: 'Turn at near-zero speed',
      instruction: 'Left turn. Virtually stop, then turn. Almost no speed while turning.',
      completed: false,
      instructorMessage: 'VIRTUALLY STOP for this turn. Then turn the wheel EXTREMELY slowly.',
    },
    {
      id: 'ICE_COMPLETE',
      position: [-234, 0, -270],
      radius: 5,
      objective: 'Exit ice zone',
      instruction: 'Leaving ice zone. Gradually return to normal inputs.',
      completed: false,
      instructorMessage: 'Off the ice! You are an ice-driving master. That was world-class smooth control.',
    },
  ],
};

// ─── Scenario Registry ────────────────────────────────────

export const ALL_SCENARIO_CONFIGS: ScenarioConfig[] = [
  TRAFFIC_FLOW,
  CORNERS_TURNS,
  PARALLEL_PARKING,
  HILL_START,
  ROUNDABOUT_NAVIGATION,
  HIGHWAY_DRIVING,
  NIGHT_DRIVING,
  RAIN_DRIVING,
  EMERGENCY_VEHICLE_YIELD,
  SCHOOL_ZONE_CROSSING,
  FOG_DRIVING,
  URBAN_MERGING,
  PERPENDICULAR_PARKING,
  THREE_POINT_TURN,
  TUNNEL_DRIVING,
  RAILWAY_CROSSING,
  PEDESTRIAN_PRIORITY,
  CYCLIST_AWARENESS,
  RURAL_VILLAGE,
  BRIDGE_CROSSING,
  SUN_GLARE,
  DEFENSIVE_BRAKING,
  LANE_DISCIPLINE,
  TRAFFIC_POLICE_SIGNALS,
  ALCOHOL_AWARENESS,
  LOAD_SECURING,
  WILDLIFE_HAZARD,
  ICE_CONDITIONS,
];

export function getScenarioConfig(id: string): ScenarioConfig | undefined {
  return ALL_SCENARIO_CONFIGS.find(s => s.id === id);
}
