// ============================================================
// ISHAMI SIMULATION — Instructor Message System
// Moto Sensei contextual message database
// ============================================================

import type { InstructorStage } from './SimulationState';
import type { Lang } from '../../contexts/I18nContext';

export interface InstructorMessage {
  id: string;
  stage: InstructorStage;
  language: Lang;
  text: string;
  trigger: string;
  audio?: string;
}

const messages: InstructorMessage[] = [
  // === INTRO ===
  {
    id: 'intro_welcome',
    stage: 'INTRO',
    language: 'en',
    text: "Welcome! I'm Moto Sensei, your driving instructor. Let's begin your first lesson in Kigali.",
    trigger: 'stage_enter',
  },
  {
    id: 'intro_welcome_rw',
    stage: 'INTRO',
    language: 'rw',
    text: "Murakaza neza! Ndindata Sensei, umuforizi wawe w'ibinyobankali. Dufatanye ijambo ryambere mu Kigali.",
    trigger: 'stage_enter',
  },

  // === SEAT ADJUSTMENT ===
  {
    id: 'seat_adjust',
    stage: 'SEAT_ADJUSTMENT',
    language: 'en',
    text: "Before starting the vehicle, make sure you are seated comfortably and can reach the controls.",
    trigger: 'stage_enter',
  },
  {
    id: 'seat_adjust_rw',
    stage: 'SEAT_ADJUSTMENT',
    language: 'rw',
    text: "Mbere yo gutangira imodoka, nezera utwikiriye kandi ushobora gushika ku.ibatisiro.",
    trigger: 'stage_enter',
  },
  {
    id: 'seat_complete',
    stage: 'SEAT_ADJUSTMENT',
    language: 'en',
    text: "Good. Driving position is ready.",
    trigger: 'step_complete',
  },
  {
    id: 'seat_complete_rw',
    stage: 'SEAT_ADJUSTMENT',
    language: 'rw',
    text: "Neza. Ubumwororero bw'ibinyobankali bwiteguye.",
    trigger: 'step_complete',
  },

  // === MIRROR CHECK ===
  {
    id: 'mirror_check',
    stage: 'MIRROR_CHECK',
    language: 'en',
    text: "Check your mirrors before moving. You need a clear view of the road around you.",
    trigger: 'stage_enter',
  },
  {
    id: 'mirror_check_rw',
    stage: 'MIRROR_CHECK',
    language: 'rw',
    text: "Reba amadaruro mbere yo gutwara. Ukeneye uburambe bwiza bw'umuhanda.",
    trigger: 'stage_enter',
  },
  {
    id: 'mirror_partial',
    stage: 'MIRROR_CHECK',
    language: 'en',
    text: "Good. Check all three mirrors — left, right, and rear-view.",
    trigger: 'partial_complete',
  },
  {
    id: 'mirror_partial_rw',
    stage: 'MIRROR_CHECK',
    language: 'rw',
    text: "Neza. Reba amadaruro yose atatu — ibumoso, iburyo, n'ibyuma.",
    trigger: 'partial_complete',
  },
  {
    id: 'mirror_complete',
    stage: 'MIRROR_CHECK',
    language: 'en',
    text: "Excellent. All mirrors checked. You have a clear view of your surroundings.",
    trigger: 'step_complete',
  },
  {
    id: 'mirror_complete_rw',
    stage: 'MIRROR_CHECK',
    language: 'rw',
    text: "Neza cane. Amadaruro yose yerekejwe. Ufite uburamhe bwiza bw'ibidukikije.",
    trigger: 'step_complete',
  },

  // === SEATBELT ===
  {
    id: 'seatbelt',
    stage: 'SEATBELT',
    language: 'en',
    text: "Fasten your seatbelt before starting the vehicle.",
    trigger: 'stage_enter',
  },
  {
    id: 'seatbelt_rw',
    stage: 'SEATBELT',
    language: 'rw',
    text: "Funga umugere wawe mbere yo gutangira imodoka.",
    trigger: 'stage_enter',
  },
  {
    id: 'seatbelt_complete',
    stage: 'SEATBELT',
    language: 'en',
    text: "Seatbelt fastened. Safety first — always.",
    trigger: 'step_complete',
  },
  {
    id: 'seatbelt_complete_rw',
    stage: 'SEATBELT',
    language: 'rw',
    text: "Umugere wafunguwe. Ubumenyerewe bwambere — burigihe.",
    trigger: 'step_complete',
  },

  // === HANDBRAKE ===
  {
    id: 'handbrake',
    stage: 'HANDBRAKE',
    language: 'en',
    text: "The handbrake is currently engaged. Keep it on until you're ready to move.",
    trigger: 'stage_enter',
  },
  {
    id: 'handbrake_rw',
    stage: 'HANDBRAKE',
    language: 'rw',
    text: "Agakamandende kari hasi. Kureka ushyira icyerekezo kugirango utangire gutwara.",
    trigger: 'stage_enter',
  },

  // === GEAR CHECK ===
  {
    id: 'gear_check',
    stage: 'GEAR_CHECK',
    language: 'en',
    text: "Make sure the vehicle is in neutral before starting the engine.",
    trigger: 'stage_enter',
  },
  {
    id: 'gear_check_rw',
    stage: 'GEAR_CHECK',
    language: 'rw',
    text: "Nezera imodoka iri mu buryo bw'imiterere mbere yo gutangira injini.",
    trigger: 'stage_enter',
  },

  // === ENGINE START ===
  {
    id: 'engine_start',
    stage: 'ENGINE_START',
    language: 'en',
    text: "Make sure the vehicle is safely prepared before starting the engine. Clutch pressed, gear in neutral, handbrake engaged.",
    trigger: 'stage_enter',
  },
  {
    id: 'engine_start_rw',
    stage: 'ENGINE_START',
    language: 'rw',
    text: "Nezera imodoka yiteguye neza mbere yo gutangira injini. Clutch ifunzwe, igeari iri mu buryo, agakamandende kari hasi.",
    trigger: 'stage_enter',
  },
  {
    id: 'engine_running',
    stage: 'ENGINE_START',
    language: 'en',
    text: "Engine is running. Well done. Let's prepare to move.",
    trigger: 'step_complete',
  },
  {
    id: 'engine_running_rw',
    stage: 'ENGINE_START',
    language: 'rw',
    text: "Injini iri gukora. Wakoze neza. Reko twitegure gutwara.",
    trigger: 'step_complete',
  },

  // === FIRST GEAR ===
  {
    id: 'first_gear',
    stage: 'FIRST_GEAR',
    language: 'en',
    text: "Now select first gear. Keep control of the clutch and prepare to move slowly.",
    trigger: 'stage_enter',
  },
  {
    id: 'first_gear_rw',
    stage: 'FIRST_GEAR',
    language: 'rw',
    text: "Ubu shiramu igeari ya mbere. Komeza ubwigunge bw'clutch kandi utegure gutwara buhoro.",
    trigger: 'stage_enter',
  },
  {
    id: 'wrong_gear',
    stage: 'FIRST_GEAR',
    language: 'en',
    text: "Let's use first gear for this controlled start.",
    trigger: 'wrong_action',
  },
  {
    id: 'wrong_gear_rw',
  stage: 'FIRST_GEAR',
    language: 'rw',
    text: "Koresha igeari ya mbere kugirango utangire neza.",
    trigger: 'wrong_action',
  },
  {
    id: 'first_gear_complete',
    stage: 'FIRST_GEAR',
    language: 'en',
    text: "First gear engaged. Now, slowly release the clutch while gently pressing the accelerator.",
    trigger: 'step_complete',
  },
  {
    id: 'first_gear_complete_rw',
    stage: 'FIRST_GEAR',
    language: 'rw',
    text: "Igeari ya mbere yashyizweho. Ubu, uhungure clutch buhoro mu gihe ukomeza accelerator.",
    trigger: 'step_complete',
  },

  // === MOVEMENT ===
  {
    id: 'movement_start',
    stage: 'MOVEMENT',
    language: 'en',
    text: "The car is moving! Keep your steering smooth and maintain a controlled speed.",
    trigger: 'stage_enter',
  },
  {
    id: 'movement_start_rw',
    stage: 'MOVEMENT',
    language: 'rw',
    text: "Imodoka iri gutwara! Komeza ubwigunge bw'ibinyobankali kandi ushobore umuvuduko.",
    trigger: 'stage_enter',
  },

  // === STEERING ===
  {
    id: 'steering_guidance',
    stage: 'STEERING',
    language: 'en',
    text: "Keep the vehicle straight and maintain a controlled speed. Use smooth steering inputs.",
    trigger: 'stage_enter',
  },
  {
    id: 'steering_guidance_rw',
    stage: 'STEERING',
    language: 'rw',
    text: "Genda mu buryo bwiza kandi ushobore umuvuduko. Koresha ubwigunge bw'ibinyobankali.",
    trigger: 'stage_enter',
  },

  // === STOP ===
  {
    id: 'stop_guidance',
    stage: 'STOP',
    language: 'en',
    text: "Approaching the designated stop point. Slow down and come to a complete stop.",
    trigger: 'stage_enter',
  },
  {
    id: 'stop_guidance_rw',
    stage: 'STOP',
    language: 'rw',
    text: "Ugeze aho ugomba guhagarara. Hagarika buhoro kandi uhagarike mu buryo bwiza.",
    trigger: 'stage_enter',
  },

  // === COMPLETION ===
  {
    id: 'completion',
    stage: 'COMPLETION',
    language: 'en',
    text: "Excellent! You've completed your first guided drive. Let's review your performance.",
    trigger: 'stage_enter',
  },
  {
    id: 'completion_rw',
    stage: 'COMPLETION',
    language: 'rw',
    text: "Neza cane! Wakoze uburyo bwawe bwo gutangira buhuje. Reko dushakire ibyifuzo byawe.",
    trigger: 'stage_enter',
  },

  // === DYNAMIC FEEDBACK ===
  {
    id: 'too_fast',
    stage: 'STEERING',
    language: 'en',
    text: "Slow down. This is a training area. Maintain control.",
    trigger: 'speed_violation',
  },
  {
    id: 'too_fast_rw',
    stage: 'STEERING',
    language: 'rw',
    text: "Huhuka. Iri ni ahantu ho kujyana. Guma ufite ubwigunge.",
    trigger: 'speed_violation',
  },
  {
    id: 'aggressive_steering',
    stage: 'STEERING',
    language: 'en',
    text: "Use smoother steering. Gentle movements keep the car stable.",
    trigger: 'steering_violation',
  },
  {
    id: 'aggressive_steering_rw',
    stage: 'STEERING',
    language: 'rw',
    text: "Koresha ubwigunge bw'ibinyobankali. Imyitwarire yoroheje irindisha imodoka neza.",
    trigger: 'steering_violation',
  },
  {
    id: 'good_stop',
    stage: 'STOP',
    language: 'en',
    text: "Good stop. The vehicle is under control.",
    trigger: 'good_stop',
  },
  {
    id: 'good_stop_rw',
    stage: 'STOP',
    language: 'rw',
    text: "Uhagaritse neza. Imodoka iri mu buryo bwiza.",
    trigger: 'good_stop',
  },
  {
    id: 'stall_recovery',
    stage: 'MOVEMENT',
    language: 'en',
    text: "Don't worry. Find the clutch engagement point and try again.",
    trigger: 'stall',
  },
  {
    id: 'stall_recovery_rw',
    stage: 'MOVEMENT',
    language: 'rw',
    text: "Ntukagire ubwoba. Rondera aho clutch ihura kandi ugerageze nanone.",
    trigger: 'stall',
  },
  {
    id: 'collision_minor',
    stage: 'STEERING',
    language: 'en',
    text: "Minor collision detected. Control your speed and steering.",
    trigger: 'collision',
  },
  {
    id: 'collision_minor_rw',
    stage: 'STEERING',
    language: 'rw',
    text: "Hari agakosa gato ryatumwe. Shobora umuvuduko n'ibinyobankali.",
    trigger: 'collision',
  },
  {
    id: 'keep_going',
    stage: 'MOVEMENT',
    language: 'en',
    text: "Good job. Keep going straight along the training route.",
    trigger: 'waypoint_approach',
  },
  {
    id: 'keep_going_rw',
    stage: 'MOVEMENT',
    language: 'rw',
    text: "Wakoze neza. Komeza mu buryo bwiza kuri urwego rwo kujyana.",
    trigger: 'waypoint_approach',
  },
  {
    id: 'approaching_turn',
    stage: 'STEERING',
    language: 'en',
    text: "Gentle turn ahead. Slow down and steer smoothly.",
    trigger: 'waypoint_turn',
  },
  {
    id: 'approaching_turn_rw',
    stage: 'STEERING',
    language: 'rw',
    text: "Hari imfuruka iri imbere. Huhuka kandi ucyuho neza.",
    trigger: 'waypoint_turn',
  },
];

export function getInstructorMessage(
  stage: InstructorStage,
  trigger: string,
  lang: Lang
): InstructorMessage | null {
  // Try exact match first
  const exact = messages.find(
    (m) => m.stage === stage && m.trigger === trigger && m.language === lang
  );
  if (exact) return exact;

  // Fall back to English
  const fallback = messages.find(
    (m) => m.stage === stage && m.trigger === trigger && m.language === 'en'
  );
  return fallback || null;
}

export function getStageEnterMessage(
  stage: InstructorStage,
  lang: Lang
): InstructorMessage | null {
  return getInstructorMessage(stage, 'stage_enter', lang);
}

export { messages };
