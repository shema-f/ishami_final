// ============================================================
// ISHAMI SIMULATION — Scenario Manager
// Unlock system, XP persistence, and achievement tracking
// ============================================================

export interface ScenarioDefinition {
  id: string;
  title: string;
  titleRW: string;
  description: string;
  descriptionRW: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: string;
  location: string;
  locationRW: string;
  xpReward: number;
  icon: string;
  order: number;
  unlockRequirement?: {
    scenarioId: string;
    minScore: number;
  };
}

export interface ScenarioProgress {
  completed: boolean;
  bestScore: number;
  attempts: number;
  totalXP: number;
  lastPlayed: number;
  stars: number; // 0-3
}

export interface UserProfile {
  totalXP: number;
  level: number;
  totalSimulations: number;
  scenarios: Record<string, ScenarioProgress>;
  achievements: string[];
  bestComboStreak: number;
  totalDistance: number;
  totalPlayTime: number;
}

const STORAGE_KEY = 'ishami.sim_profile';
const ACHIEVEMENTS_KEY = 'ishami.achievements';

// ─── All Scenarios ────────────────────────────────────────

export const ALL_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'guided_start',
    title: 'Guided Start',
    titleRW: 'Gutangira Gutwara',
    description: 'Learn the essential steps required before moving a vehicle.',
    descriptionRW: 'Ibintu byagenze bikenerwa mbere yo gutangira imodoka.',
    difficulty: 'BEGINNER',
    estimatedTime: '3-5 min',
    location: 'Kigali — Convention Centre Training Area',
    locationRW: 'Kigali — Ahantu ho kujyana',
    xpReward: 250,
    icon: '🚗',
    order: 1,
  },
  {
    id: 'traffic_flow',
    title: 'Traffic Flow',
    titleRW: 'Kugendagenda',
    description: 'Navigate through traffic while following all traffic rules.',
    descriptionRW: 'Kugena mu mizigo y\'imodoka ukurikiza amategeko yose.',
    difficulty: 'BEGINNER',
    estimatedTime: '5-7 min',
    location: 'Kigali — KN 5 Road',
    locationRW: 'Kigali — Umuhanda wa KN 5',
    xpReward: 350,
    icon: '🚦',
    order: 2,
  },
  {
    id: 'corners_turns',
    title: 'Corners & Turns',
    titleRW: 'Imfuruka',
    description: 'Master proper turning techniques and road positioning.',
    descriptionRW: 'Menya neza imfuruka n\'uburyo bwo gutwara mu muhanda.',
    difficulty: 'BEGINNER',
    estimatedTime: '4-6 min',
    location: 'Kigali — Kimironko District',
    locationRW: 'Kigali — Akarere ka Kimironko',
    xpReward: 300,
    icon: '↩️',
    order: 3,
  },
  {
    id: 'parallel_parking',
    title: 'Parallel Parking',
    titleRW: 'Guhagarika Uburiri',
    description: 'Learn to park between vehicles in tight spaces.',
    descriptionRW: 'Jya mu gihe uhagaritse imodoka hagati y\'izindi.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-8 min',
    location: 'Kigali — City Center Parking',
    locationRW: 'Kigali — Ahantu h\'imodoka mu mujyi',
    xpReward: 500,
    icon: '🅿️',
    order: 4,
  },
  {
    id: 'hill_start',
    title: 'Hill Start',
    titleRW: 'Gutangira ku Gitozo',
    description: 'Practice starting on an incline without rolling back.',
    descriptionRW: 'Jya mu gihe utangira ku gitozo nta makuru.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-7 min',
    location: 'Kigali — Nyarutarama Hill',
    locationRW: 'Kigali — Igitambara c\'Nyarutarama',
    xpReward: 450,
    icon: '⛰️',
    order: 5,
  },
  {
    id: 'roundabout',
    title: 'Roundabout Navigation',
    titleRW: 'Kuzinga ku Roundabout',
    description: 'Master the art of navigating roundabouts with proper lane discipline.',
    descriptionRW: 'Menya neza kuzinga mu roundabout ukurikiza imbanza.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-8 min',
    location: 'Kigali — Kacyiru Roundabout',
    locationRW: 'Kigali — Roundabout ya Kacyiru',
    xpReward: 500,
    icon: '🔄',
    order: 6,
  },
  {
    id: 'highway_driving',
    title: 'Highway Driving',
    titleRW: 'Gutwara kuri Highway',
    description: 'High-speed driving with overtaking and lane changes.',
    descriptionRW: 'Gutwara cyihuse no gusubiza imodoka.',
    difficulty: 'ADVANCED',
    estimatedTime: '7-10 min',
    location: 'Kigali — Airport Road',
    locationRW: 'Kigali — Umuhanda w\'Urwego',
    xpReward: 700,
    icon: '🛣️',
    order: 7,
  },
  {
    id: 'night_driving',
    title: 'Night Driving',
    titleRW: 'Gutwara mu Gitondo',
    description: 'Drive safely in low visibility conditions.',
    descriptionRW: 'Twara neza mu gihe ntarengwa.',
    difficulty: 'ADVANCED',
    estimatedTime: '6-8 min',
    location: 'Kigali — Downtown Night Route',
    locationRW: 'Kigali — Umuhanda waJsonValue',
    xpReward: 800,
    icon: '🌙',
    order: 8,
  },
  {
    id: 'rain_driving',
    title: 'Rain Driving',
    titleRW: 'Gutwara mu Mvura',
    description: 'Handle wet road conditions with reduced traction.',
    descriptionRW: 'Gucunga imodoka mu mvura.',
    difficulty: 'ADVANCED',
    estimatedTime: '6-9 min',
    location: 'Kigali — Rainy Day Route',
    locationRW: 'Kigali — Umuhanda w\'Imvura',
    xpReward: 800,
    icon: '🌧️',
    order: 9,
  },
  {
    id: 'pedestrian_crossing',
    title: 'Pedestrian Safety',
    titleRW: 'Ubumenyi bw\'Abanyamaguru',
    description: 'Navigate busy pedestrian zones and zebra crossings safely.',
    descriptionRW: 'Gukemura ibibanza by\'abanyamaguru neza no kwambuka ahantu bambukamo.',
    difficulty: 'BEGINNER',
    estimatedTime: '4-6 min',
    location: 'Kigali — Kimironko Market',
    locationRW: 'Kigali — Isoko ya Kimironko',
    xpReward: 300,
    icon: '🚶',
    order: 10,
  },
  {
    id: 'emergency_stop',
    title: 'Emergency Stop',
    titleRW: 'Guhagarara Byihutirwa',
    description: 'Practice emergency braking at various speeds.',
    descriptionRW: 'Jya mu gihe uhagarara byihutirwa mu muvuduko wose.',
    difficulty: 'BEGINNER',
    estimatedTime: '3-5 min',
    location: 'Kigali — Training Ground',
    locationRW: 'Kigali — Ahantu ho kujyana',
    xpReward: 350,
    icon: '🚨',
    order: 11,
  },
  {
    id: 'school_zone',
    title: 'School Zone Navigation',
    titleRW: 'Kugenda mu Mugi w\'Ishuri',
    description: 'Drive through school zones with children present.',
    descriptionRW: 'Gutwara mu mudugudu w\'ishuri abana bariho.',
    difficulty: 'BEGINNER',
    estimatedTime: '4-6 min',
    location: 'Kigali — Ecole Belge Area',
    locationRW: 'Kigali — Ahantu h\'Ecole Belge',
    xpReward: 350,
    icon: '🏫',
    order: 12,
  },
  {
    id: 'overtaking_practice',
    title: 'Safe Overtaking',
    titleRW: 'Gusubiza mu Buryo Bwiza',
    description: 'Master overtaking safely on multi-lane roads.',
    descriptionRW: 'Menya gusubiza neza ku muhanda ufite imbanza byinshi.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '6-8 min',
    location: 'Kigali —KN 3 Road',
    locationRW: 'Kigali — Umuhanda wa KN 3',
    xpReward: 500,
    icon: '🏎️',
    order: 13,
  },
  {
    id: 'perpendicular_parking',
    title: 'Perpendicular Parking',
    titleRW: 'Guhagarika muburyo bw\'Imbono',
    description: 'Park into spaces at 90-degree angles.',
    descriptionRW: 'Guhagarika mu mwanya wo hejuru y\'uburebure.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-7 min',
    location: 'Kigali — Mall Parking Lot',
    locationRW: 'Kigali — Ahantu h\'imodoka mu isoko',
    xpReward: 450,
    icon: '🅿️',
    order: 14,
  },
  {
    id: 't_intersection',
    title: 'T-Junction Navigation',
    titleRW: 'Ihuriro ry\'Umuhanda T',
    description: 'Learn priority rules at T-junctions.',
    descriptionRW: 'Menya amategeko y\'uburenganzira ku T-intersection.',
    difficulty: 'BEGINNER',
    estimatedTime: '4-6 min',
    location: 'Kigali — Remera Junction',
    locationRW: 'Kigali — Ihuriro rya Remera',
    xpReward: 300,
    icon: '➕',
    order: 15,
  },
  {
    id: 'four_way_junction',
    title: '4-Way Intersection',
    titleRW: 'Inkomane y\'Imihanda 4',
    description: 'Navigate 4-way intersections with traffic lights.',
    descriptionRW: 'Gukemura inkomane y\'imihanda ine ifite amatara y\'umuhanda.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-7 min',
    location: 'Kigali — City Center Junction',
    locationRW: 'Kigali — Ihuriro ry\'Imbazo',
    xpReward: 450,
    icon: '🚦',
    order: 16,
  },
  {
    id: 'tunnel_driving',
    title: 'Tunnel Navigation',
    titleRW: 'Kugenda mu Mucuma',
    description: 'Drive through tunnels with proper lighting.',
    descriptionRW: 'Gukemura mu mucuma ukoresheje amatara meza.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '4-6 min',
    location: 'Kigali — Tunnel Route',
    locationRW: 'Kigali — Umuhanda w\'Umucuma',
    xpReward: 500,
    icon: '🚇',
    order: 17,
  },
  {
    id: 'railway_crossing',
    title: 'Railway Crossing',
    titleRW: 'Kwambuka Inzira ya Gari ya Moshi',
    description: 'Safely cross railway tracks with signals.',
    descriptionRW: 'Kwambuka neza inzira ya gari ya moshi.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '4-5 min',
    location: 'Kigali — Railway Crossing',
    locationRW: 'Kigali — Ahantu h\'amagare',
    xpReward: 450,
    icon: '🚂',
    order: 18,
  },
  {
    id: 'construction_zone',
    title: 'Construction Zone',
    titleRW: 'Urwego rw\'Ukubaka',
    description: 'Navigate through road work zones safely.',
    descriptionRW: 'Gukemura mu rwego rw\'akorwa mu muhanda neza.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-7 min',
    location: 'Kigali — Road Construction Area',
    locationRW: 'Kigali — Ahantu h\'akorwa mu muhanda',
    xpReward: 500,
    icon: '🚧',
    order: 19,
  },
  {
    id: 'mountain_road',
    title: 'Mountain Road',
    titleRW: 'Umuhanda w\'Igitambara',
    description: 'Drive on winding mountain roads with steep gradients.',
    descriptionRW: 'Gutwara ku muhanda ukwiye hejuru no hasi.',
    difficulty: 'ADVANCED',
    estimatedTime: '8-10 min',
    location: 'Kigali — Nyarugenge Hill Road',
    locationRW: 'Kigali — Umuhanda w\'Igitambara c\'Nyarugenge',
    xpReward: 800,
    icon: '⛰️',
    order: 20,
  },
  {
    id: 'parking_garage',
    title: 'Parking Garage',
    titleRW: 'Garaje y\'Imodoka',
    description: 'Navigate multi-level parking structures.',
    descriptionRW: 'Gukemura mu garaje y\'imodoka byinshi.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '5-8 min',
    location: 'Kigali — KCC Parking',
    locationRW: 'Kigali — Garaje ya KCC',
    xpReward: 500,
    icon: '🏢',
    order: 21,
  },
  {
    id: 'bus_lane_navigation',
    title: 'Bus Lane Rules',
    titleRW: 'Amategeko y\'Inzira y\'Amagare',
    description: 'Learn when bus lanes can and cannot be used.',
    descriptionRW: 'Menya ryari inzira y\'amagare ishobora gukoreshwa.',
    difficulty: 'INTERMEDIATE',
    estimatedTime: '4-6 min',
    location: 'Kigali — Bus Rapid Transit Route',
    locationRW: 'Kigali — Umuhanda w\'Amagare',
    xpReward: 450,
    icon: '🚌',
    order: 22,
  },
  {
    id: 'fog_driving',
    title: 'Fog Driving',
    titleRW: 'Gutwara mu Gicu',
    description: 'Drive safely in foggy conditions with limited visibility.',
    descriptionRW: 'Gutwara neza mu gicu nta ubona bwinshi.',
    difficulty: 'ADVANCED',
    estimatedTime: '6-8 min',
    location: 'Kigali — Foggy Morning Route',
    locationRW: 'Kigali — Umuhanda w\'Amagambo',
    xpReward: 800,
    icon: '🌫️',
    order: 23,
  },
  {
    id: 'loading_zone',
    title: 'Loading Zone Navigation',
    titleRW: 'Kugenda mu Rwego rwo Gushyiramo',
    description: 'Navigate around loading zones and delivery vehicles.',
    descriptionRW: 'Gukemura hafi y\'aho imodoka zishyirwa ibintu.',
    difficulty: 'BEGINNER',
    estimatedTime: '3-5 min',
    location: 'Kigali — Commercial District',
    locationRW: 'Kigali — Aho amahera y\'ibicuruzwa',
    xpReward: 300,
    icon: '📦',
    order: 24,
  },
  {
    id: 'roundabout_multi_exit',
    title: 'Multi-Exit Roundabout',
    titleRW: 'Roundabout Ifite Inyuma Nyinshi',
    description: 'Navigate complex roundabouts with multiple exits.',
    descriptionRW: 'Gukemura mu roundabout ifite inyuma nyinshi.',
    difficulty: 'ADVANCED',
    estimatedTime: '6-8 min',
    location: 'Kigali — Mulindi Roundabout',
    locationRW: 'Kigali — Roundabout ya Mulindi',
    xpReward: 700,
    icon: '🔄',
    order: 25,
  },
  {
    id: 'motorcycle_lane',
    title: 'Motorcycle Navigation',
    titleRW: 'Gukemura Ubufasha bw\'Amapikipiki',
    description: 'Understand motorcycle lane rules and interactions.',
    descriptionRW: 'Menya amategeko y\'inzira y\'amapikipiki.',
    difficulty: 'BEGINNER',
    estimatedTime: '4-6 min',
    location: 'Kigali — Motorcycle Lane Area',
    locationRW: 'Kigali — Ahantu h\'inzira y\'amapikipiki',
    xpReward: 350,
    icon: '🏍️',
    order: 26,
  },
  {
    id: 'hill_descend',
    title: 'Steep Hill Descent',
    titleRW: 'Kumanuka ku Gitozo',
    description: 'Master downhill driving with engine braking.',
    descriptionRW: 'Menya gutwara hasi ukoresheje moteri.',
    difficulty: 'ADVANCED',
    estimatedTime: '5-7 min',
    location: 'Kigali — Nyarutarama Descent',
    locationRW: 'Kigali — Ihejuru ry\'Nyarutarama',
    xpReward: 700,
    icon: '⛰️',
    order: 27,
  },
  {
    id: 'night_pedestrian',
    title: 'Night Pedestrian Zones',
    titleRW: 'Urwego rw\'Abanyamaguru mu Gitondo',
    description: 'Drive through pedestrian zones at night.',
    descriptionRW: 'Gukemura mu rwego rw\'abanyamaguru mu gitondo.',
    difficulty: 'ADVANCED',
    estimatedTime: '6-8 min',
    location: 'Kigali — Night Market Area',
    locationRW: 'Kigali — Isoko y\'ijoro',
    xpReward: 800,
    icon: '🌙',
    order: 28,
  },
  {
    id: 'speed_calming',
    title: 'Speed Calming Zone',
    titleRW: 'Urwego rw\'Umuvuduko',
    description: 'Navigate through areas with speed bumps and traffic calming.',
    descriptionRW: 'Gukemura mu bice bifite umuvuduko n\'amategeko y\'umuhanda.',
    difficulty: 'BEGINNER',
    estimatedTime: '3-5 min',
    location: 'Kigali — Residential Zone',
    locationRW: 'Kigali — Urwego rw\'abatuye',
    xpReward: 300,
    icon: '🐢',
    order: 29,
  },
  {
    id: 'dual_carriageway',
    title: 'Dual Carriageway',
    titleRW: 'Umuhanda wa Kabiri',
    description: 'Navigate dual carriageways with fast and slow lanes.',
    descriptionRW: 'Gukemura ku muhanda wa kabiri ufite imbanza by\'umuvuduko.',
    difficulty: 'ADVANCED',
    estimatedTime: '7-9 min',
    location: 'Kigali — KN 1 Road',
    locationRW: 'Kigali — Umuhanda wa KN 1',
    xpReward: 750,
    icon: '🛣️',
    order: 30,
  },
];

// ─── Achievements ─────────────────────────────────────────

export const ALL_ACHIEVEMENTS = [
  { id: 'first_drive', title: 'First Drive', titleRW: 'Intambwe ya Mbere', description: 'Complete your first simulation', icon: '🎓', xp: 100 },
  { id: 'perfect_score', title: 'Perfect Score', titleRW: 'Amanota Yuzuye', description: 'Score 100% on any scenario', icon: '💯', xp: 500 },
  { id: 'speed_demon', title: 'Speed Demon', titleRW: 'Igiciro', description: 'Drive at max speed without crashing', icon: '⚡', xp: 200 },
  { id: 'combo_master', title: 'Combo Master', titleRW: 'Uw\'Ubufasha', description: 'Get a 10x combo streak', icon: '🔥', xp: 300 },
  { id: 'all_beginner', title: 'Beginner Graduate', titleRW: 'Umusore', description: 'Complete all beginner scenarios', icon: '📗', xp: 500 },
  { id: 'all_intermediate', title: 'Intermediate Driver', titleRW: 'Umushoferi', description: 'Complete all intermediate scenarios', icon: '📘', xp: 800 },
  { id: 'all_advanced', title: 'Expert Driver', titleRW: 'Umujyanama', description: 'Complete all advanced scenarios', icon: '📙', xp: 1500 },
  { id: 'gold_hunter', title: 'Gold Hunter', titleRW: 'Ushaka Ubucuruzi', description: 'Get gold medal on 5 scenarios', icon: '🥇', xp: 1000 },
  { id: 'marathon', title: 'Marathon Driver', titleRW: 'Umugere', description: 'Drive for 30 minutes total', icon: '🏃', xp: 400 },
  { id: 'safe_driver', title: 'Safe Driver', titleRW: 'Umuyobozi W\'Amategeko', description: 'Complete 5 scenarios with zero mistakes', icon: '🛡️', xp: 600 },
];

// ─── Profile Management ───────────────────────────────────

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return createDefaultProfile();
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

function createDefaultProfile(): UserProfile {
  return {
    totalXP: 0,
    level: 1,
    totalSimulations: 0,
    scenarios: {},
    achievements: [],
    bestComboStreak: 0,
    totalDistance: 0,
    totalPlayTime: 0,
  };
}

export function isScenarioUnlocked(_scenarioId: string, _profile: UserProfile): boolean {
  // All scenarios are playable immediately
  return true;
}

export function getScenarioStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 80) return 2;
  if (score >= 70) return 1;
  return 0;
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(1 + Math.sqrt(totalXP / 100));
}

export function xpForNextLevel(level: number): number {
  return Math.floor(Math.pow(level - 1, 2) * 100);
}

export function recordScenarioCompletion(
  profile: UserProfile,
  scenarioId: string,
  score: number,
  xpEarned: number,
  distance: number,
  playTime: number
): UserProfile {
  const newProfile = { ...profile };
  const existing = newProfile.scenarios[scenarioId] || {
    completed: false,
    bestScore: 0,
    attempts: 0,
    totalXP: 0,
    lastPlayed: 0,
    stars: 0,
  };

  existing.attempts++;
  existing.completed = true;
  existing.bestScore = Math.max(existing.bestScore, score);
  existing.totalXP += xpEarned;
  existing.lastPlayed = Date.now();
  existing.stars = Math.max(existing.stars, getScenarioStars(score));

  newProfile.scenarios[scenarioId] = existing;
  newProfile.totalXP += xpEarned;
  newProfile.totalSimulations++;
  newProfile.totalDistance += distance;
  newProfile.totalPlayTime += playTime;
  newProfile.level = calculateLevel(newProfile.totalXP);

  saveProfile(newProfile);
  return newProfile;
}

export function unlockAchievement(profile: UserProfile, achievementId: string): UserProfile {
  if (profile.achievements.includes(achievementId)) return profile;

  const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return profile;

  const newProfile = { ...profile };
  newProfile.achievements = [...profile.achievements, achievementId];
  newProfile.totalXP += achievement.xp;
  newProfile.level = calculateLevel(newProfile.totalXP);

  saveProfile(newProfile);
  return newProfile;
}

export function checkAchievements(profile: UserProfile): string[] {
  const newAchievements: string[] = [];

  // First Drive
  if (profile.totalSimulations >= 1 && !profile.achievements.includes('first_drive')) {
    newAchievements.push('first_drive');
  }

  // Combo Master
  if (profile.bestComboStreak >= 10 && !profile.achievements.includes('combo_master')) {
    newAchievements.push('combo_master');
  }

  // All beginner
  const beginnerScenarios = ALL_SCENARIOS.filter(s => s.difficulty === 'BEGINNER');
  if (beginnerScenarios.every(s => profile.scenarios[s.id]?.completed) && !profile.achievements.includes('all_beginner')) {
    newAchievements.push('all_beginner');
  }

  // All intermediate
  const intermediateScenarios = ALL_SCENARIOS.filter(s => s.difficulty === 'INTERMEDIATE');
  if (intermediateScenarios.every(s => profile.scenarios[s.id]?.completed) && !profile.achievements.includes('all_intermediate')) {
    newAchievements.push('all_intermediate');
  }

  // All advanced
  const advancedScenarios = ALL_SCENARIOS.filter(s => s.difficulty === 'ADVANCED');
  if (advancedScenarios.every(s => profile.scenarios[s.id]?.completed) && !profile.achievements.includes('all_advanced')) {
    newAchievements.push('all_advanced');
  }

  // Gold hunter
  const goldCount = Object.values(profile.scenarios).filter(s => s.stars >= 3).length;
  if (goldCount >= 5 && !profile.achievements.includes('gold_hunter')) {
    newAchievements.push('gold_hunter');
  }

  // Marathon
  if (profile.totalPlayTime >= 1800 && !profile.achievements.includes('marathon')) {
    newAchievements.push('marathon');
  }

  // Safe driver - 5 scenarios with zero mistakes
  // (check this externally as we need mistake data)

  return newAchievements;
}
