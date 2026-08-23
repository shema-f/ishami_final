// ============================================================
// ISHAMI SIMULATION — Dynamic AI Instructor
// Adaptive messaging based on driving performance and context
// ============================================================

import type { InstructorStage, GearState } from '../core/SimulationState';
import type { Lang } from '../../contexts/I18nContext';

export interface InstructorContext {
  speed: number;
  gear: GearState;
  rpm: number;
  engineRunning: boolean;
  engineStalled: boolean;
  clutchPressed: boolean;
  handbrakeOn: boolean;
  brakePressed: boolean;
  acceleratorPressed: boolean;
  steeringAngle: number;
  mistakeCount: number;
  comboStreak: number;
  score: number;
  elapsedTime: number;
  currentWaypoint: number;
  totalWaypoints: number;
  stage: InstructorStage;
}

interface DynamicMessage {
  text: string;
  type: 'encouragement' | 'warning' | 'correction' | 'tip' | 'celebration' | 'info';
  priority: 'low' | 'medium' | 'high';
}

// ─── Contextual Message Database ──────────────────────────

const CONTEXTUAL_MESSAGES: Record<Lang, {
  speed_warning: DynamicMessage[];
  too_slow: DynamicMessage[];
  hard_braking: DynamicMessage[];
  aggressive_steering: DynamicMessage[];
  good_driving: DynamicMessage[];
  combo_bonus: DynamicMessage[];
  stall_help: DynamicMessage[];
  gear_mismatch: DynamicMessage[];
  waypoint_approach: DynamicMessage[];
  waypoint_complete: DynamicMessage[];
  encouragement_low_score: DynamicMessage[];
  encouragement_high_score: DynamicMessage[];
  safety_tip: DynamicMessage[];
  time_pressure: DynamicMessage[];
}> = {
  en: {
    speed_warning: [
      { text: "Slow down! This is a training zone. Speed limit is strict here.", type: 'warning', priority: 'high' },
      { text: "You're going too fast for this area. Reduce your speed immediately.", type: 'warning', priority: 'high' },
      { text: "Speed violation! Keep your speed under control for safety.", type: 'warning', priority: 'high' },
    ],
    too_slow: [
      { text: "You can go a bit faster. Don't hold up traffic.", type: 'tip', priority: 'low' },
      { text: "Good caution, but try to maintain a steady pace.", type: 'info', priority: 'low' },
    ],
    hard_braking: [
      { text: "Brake earlier and more gently. Anticipate stops ahead.", type: 'correction', priority: 'medium' },
      { text: "Smooth braking is safer and more comfortable. Plan ahead.", type: 'tip', priority: 'medium' },
    ],
    aggressive_steering: [
      { text: "Steer more gently. Sudden movements can destabilize the car.", type: 'correction', priority: 'medium' },
      { text: "Use smooth, progressive steering inputs.", type: 'tip', priority: 'medium' },
    ],
    good_driving: [
      { text: "Great control! Your steering is smooth and precise.", type: 'encouragement', priority: 'low' },
      { text: "Nice driving! You're maintaining good speed and control.", type: 'encouragement', priority: 'low' },
      { text: "Excellent! Keep up the good driving habits.", type: 'encouragement', priority: 'low' },
    ],
    combo_bonus: [
      { text: "🔥 Perfect combo! Your driving is getting better!", type: 'celebration', priority: 'medium' },
      { text: "⭐ Amazing streak! Keep this up!", type: 'celebration', priority: 'medium' },
      { text: "🎯 Combo bonus! You're on fire!", type: 'celebration', priority: 'medium' },
    ],
    stall_help: [
      { text: "The engine stalled. Press the clutch, select neutral, and try starting again.", type: 'info', priority: 'high' },
      { text: "Stall detected! Remember: clutch in, neutral gear, then start.", type: 'info', priority: 'high' },
    ],
    gear_mismatch: [
      { text: "The gear doesn't match your speed. Try a different gear.", type: 'correction', priority: 'medium' },
      { text: "Engine straining. Shift to a higher gear for better control.", type: 'correction', priority: 'medium' },
    ],
    waypoint_approach: [
      { text: "Checkpoint ahead. Prepare to navigate through it.", type: 'info', priority: 'low' },
      { text: "Next objective approaching. Stay focused.", type: 'info', priority: 'low' },
    ],
    waypoint_complete: [
      { text: "Checkpoint passed! Great job following the route.", type: 'encouragement', priority: 'low' },
      { text: "Waypoint cleared! Keep going.", type: 'encouragement', priority: 'low' },
    ],
    encouragement_low_score: [
      { text: "Don't worry, practice makes perfect. Try to focus on one thing at a time.", type: 'encouragement', priority: 'medium' },
      { text: "Every mistake is a learning opportunity. You're doing better than you think!", type: 'encouragement', priority: 'medium' },
    ],
    encouragement_high_score: [
      { text: "Outstanding performance! You're driving like a pro!", type: 'celebration', priority: 'medium' },
      { text: "Incredible score! Your skills are really showing.", type: 'celebration', priority: 'medium' },
    ],
    safety_tip: [
      { text: "Remember: always check mirrors before changing direction.", type: 'tip', priority: 'low' },
      { text: "Safety tip: maintain at least 2 seconds following distance.", type: 'tip', priority: 'low' },
      { text: "Pro tip: scan the road ahead, not just directly in front.", type: 'tip', priority: 'low' },
    ],
    time_pressure: [
      { text: "Take your time. Safety is more important than speed.", type: 'info', priority: 'medium' },
    ],
  },
  rw: {
    speed_warning: [
      { text: "Huhuka! Iri ni ahantu ho kujyana. Imigabane y'umuvuduko ni ngombwa.", type: 'warning', priority: 'high' },
      { text: "Uri ngenderwaho cyane. Hagarika umuvuduko wawe ubisubire.", type: 'warning', priority: 'high' },
      { text: "Ibihwa by'umuvuduko! Guma ufite ubwigunge.", type: 'warning', priority: 'high' },
    ],
    too_slow: [
      { text: "Ushobora kwiyongera gato. Ntuhangane abandi.", type: 'tip', priority: 'low' },
      { text: "Ubuntu bwiza, aha komeza neza.", type: 'info', priority: 'low' },
    ],
    hard_braking: [
      { text: "Hagarika mbere kandi buhoro. Menya aho uhagarara.", type: 'correction', priority: 'medium' },
      { text: "Ku buryo bwiza ni amahoro kandi bwiza. Tegura imbere.", type: 'tip', priority: 'medium' },
    ],
    aggressive_steering: [
      { text: "Koresha ubwigunge bw'ibinyobankali. Imyitwarire yoroheje irindisha imodoka neza.", type: 'correction', priority: 'medium' },
      { text: "Koresha ubwigunge bw'ibinyobankali.", type: 'tip', priority: 'medium' },
    ],
    good_driving: [
      { text: "Ubwigunge bwiza! Ibyinyobankali byawe biryo.", type: 'encouragement', priority: 'low' },
      { text: "Wakoze neza! Guma ufite ubwigunge bwiza.", type: 'encouragement', priority: 'low' },
      { text: "Neza cane! Komeza gutwara neza.", type: 'encouragement', priority: 'low' },
    ],
    combo_bonus: [
      { text: "🔥 Combo y'umwimerere! Gutwara kwawe kuri hejuru!", type: 'celebration', priority: 'medium' },
      { text: "⭐ Ubushobozi bukomeye! Komeza gutwara neza!", type: 'celebration', priority: 'medium' },
      { text: "🎯 Combo bonus! Uri mu bihe!", type: 'celebration', priority: 'medium' },
    ],
    stall_help: [
      { text: "Injini yahagaritse. Funga clutch, hitamo neutral, uzongere gutangira.", type: 'info', priority: 'high' },
      { text: "Stall! Jya mwibuka: clutch iri mu mbere, gear iri mu buryo, hanyuma utangire.", type: 'info', priority: 'high' },
    ],
    gear_mismatch: [
      { text: "Igeari ntiyhujije umuvuduko wawe. Gerageza igindi.", type: 'correction', priority: 'medium' },
      { text: "Injini iri mu nguvu. ShiShifta igeari yo hejuru.", type: 'correction', priority: 'medium' },
    ],
    waypoint_approach: [
      { text: "Checkpoint iri imbere. Tegura kugenda mu yayo.", type: 'info', priority: 'low' },
      { text: "Intambwe ikurikira iri imbere. Guma ufite ubwenge.", type: 'info', priority: 'low' },
    ],
    waypoint_complete: [
      { text: "Checkpoint yashyizweho! Wakoze neza kandi ukurikiza urwego.", type: 'encouragement', priority: 'low' },
      { text: "Waypoint yarakiriwe! Komeza.", type: 'encouragement', priority: 'low' },
    ],
    encouragement_low_score: [
      { text: "Ntukagire ubwoba, gukora neza biri mu bikorwa. Gebera icyo icyawe.", type: 'encouragement', priority: 'medium' },
      { text: "Icosa ryose ni amahoro y'ubumenyi. Wakorera neza kuruta icyo ukeneye!", type: 'encouragement', priority: 'medium' },
    ],
    encouragement_high_score: [
      { text: "Imyitwarire y'umwimerere! Utwara nk'umuyobozi w'icyubahiro!", type: 'celebration', priority: 'medium' },
      { text: "Amanota meza! Ubushobozi bwawe bukora neza.", type: 'celebration', priority: 'medium' },
    ],
    safety_tip: [
      { text: "Jya mwibuka: reba amadaruro mbere yo guhindura inzira.", type: 'tip', priority: 'low' },
      { text: "Inama y'ubumenyi: komeza ubuntu bw'isuku.", type: 'tip', priority: 'low' },
      { text: "Inama: reba mu gihe kiri imbere, sibyo aho uri.", type: 'tip', priority: 'low' },
    ],
    time_pressure: [
      { text: "Tegura neza. Ubumenyerewe ni byo bigoye kuruta umuvuduko.", type: 'info', priority: 'medium' },
    ],
  },
};

export class DynamicInstructor {
  private lastMessageTime = 0;
  private messageCooldown = 3000; // ms between messages
  private lastMessageType = '';
  private messageHistory: string[] = [];
  private performanceScore = 50; // 0-100 running score
  private safetyTipsGiven = 0;

  getAdaptiveMessage(
    ctx: InstructorContext,
    lang: Lang
  ): DynamicMessage | null {
    const now = Date.now();
    if (now - this.lastMessageTime < this.messageCooldown) return null;

    const messages = CONTEXTUAL_MESSAGES[lang];
    if (!messages) return null;

    // Priority-based message selection
    let selected: DynamicMessage | null = null;

    // 1. Speed warnings (highest priority)
    if (ctx.speed > 35) {
      selected = this.randomFrom(messages.speed_warning);
    }
    // 2. Stall help
    else if (ctx.engineStalled) {
      selected = this.randomFrom(messages.stall_help);
    }
    // 3. Hard braking
    else if (ctx.brakePressed && ctx.speed > 20) {
      selected = this.randomFrom(messages.hard_braking);
    }
    // 4. Aggressive steering
    else if (Math.abs(ctx.steeringAngle) > 0.4 && ctx.speed > 15) {
      selected = this.randomFrom(messages.aggressive_steering);
    }
    // 5. Gear mismatch
    else if (ctx.gear !== 'N' && ctx.gear !== 'R' && ctx.rpm < 1000 && ctx.speed > 5) {
      selected = this.randomFrom(messages.gear_mismatch);
    }
    // 6. Combo celebration
    else if (ctx.comboStreak > 0 && ctx.comboStreak % 5 === 0) {
      selected = this.randomFrom(messages.combo_bonus);
    }
    // 7. Encouragement based on score
    else if (ctx.score < 40 && ctx.mistakeCount > 3) {
      selected = this.randomFrom(messages.encouragement_low_score);
    }
    else if (ctx.score > 80) {
      selected = this.randomFrom(messages.encouragement_high_score);
    }
    // 8. Good driving feedback
    else if (ctx.speed > 10 && ctx.speed < 30 && Math.abs(ctx.steeringAngle) < 0.2 && ctx.comboStreak > 3) {
      selected = this.randomFrom(messages.good_driving);
    }
    // 9. Safety tips (periodic)
    else if (this.safetyTipsGiven < 3 && Math.random() < 0.02) {
      selected = this.randomFrom(messages.safety_tip);
      this.safetyTipsGiven++;
    }
    // 10. Waypoint messages
    else if (ctx.currentWaypoint > 0 && Math.random() < 0.01) {
      selected = this.randomFrom(messages.waypoint_approach);
    }

    if (selected) {
      this.lastMessageTime = now;
      this.lastMessageType = selected.type;
      this.messageHistory.push(selected.text);
      if (this.messageHistory.length > 10) this.messageHistory.shift();
    }

    return selected;
  }

  updatePerformance(speed: number, mistakes: number, score: number) {
    // Running performance score
    this.performanceScore = this.performanceScore * 0.95 + score * 0.05;
  }

  reset() {
    this.lastMessageTime = 0;
    this.lastMessageType = '';
    this.messageHistory = [];
    this.performanceScore = 50;
    this.safetyTipsGiven = 0;
  }

  private randomFrom(arr: DynamicMessage[]): DynamicMessage {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
