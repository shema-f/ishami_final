// ============================================================
// ISHAMI SIMULATION — Real-time Scoring System
// Combo streaks, bonus multipliers, and live score updates
// ============================================================

import type { SimulationState, ScoreCategory, Mistake } from './SimulationState';

export interface ScoreUpdate {
  delta: number;
  reason: string;
  type: 'positive' | 'negative' | 'combo' | 'milestone';
  timestamp: number;
}

export interface ComboState {
  streak: number;
  multiplier: number;
  lastGoodAction: number;
  timeoutMs: number;
}

export class ScoringSystem {
  private combo: ComboState = {
    streak: 0,
    multiplier: 1,
    lastGoodAction: 0,
    timeoutMs: 5000, // 5 seconds to maintain combo
  };

  private scoreHistory: ScoreUpdate[] = [];
  private totalScore = 0;
  private categoryScores: Record<string, number> = {
    VEHICLE_CONTROL: 0,
    SAFETY: 0,
    TRAFFIC_COMPLIANCE: 0,
    STEERING: 0,
    SPEED_CONTROL: 0,
  };

  private categoryWeights: Record<string, number> = {
    VEHICLE_CONTROL: 0.25,
    SAFETY: 0.25,
    TRAFFIC_COMPLIANCE: 0.2,
    STEERING: 0.15,
    SPEED_CONTROL: 0.15,
  };

  private milestones = [25, 50, 75, 100];
  private reachedMilestones = new Set<number>();

  // ─── Action Scoring ────────────────────────────────────

  scoreSmoothDriving(speed: number, steeringAngle: number) {
    if (speed > 10 && speed < 30 && Math.abs(steeringAngle) < 0.2) {
      this.addScore(0.5, 'Smooth driving', 'VEHICLE_CONTROL');
      this.maintainCombo();
    }
  }

  scoreCorrectGear(gear: string, speed: number) {
    const expectedGear = this.getExpectedGear(speed);
    if (gear === expectedGear) {
      this.addScore(1, 'Correct gear selection', 'VEHICLE_CONTROL');
      this.maintainCombo();
    }
  }

  scoreCheckpointReached(index: number, total: number) {
    const bonus = Math.floor(5 + (index / total) * 10);
    this.addScore(bonus, `Checkpoint ${index + 1}/${total}`, 'TRAFFIC_COMPLIANCE');
    this.maintainCombo();
  }

  scoreSafeSpeed(speed: number, limit: number) {
    if (speed <= limit && speed > 5) {
      this.addScore(0.3, 'Safe speed', 'SPEED_CONTROL');
    }
  }

  scoreSmoothBrake() {
    this.addScore(1, 'Smooth braking', 'SAFETY');
    this.maintainCombo();
  }

  scoreGoodStop(distanceToTarget: number) {
    if (distanceToTarget < 2) {
      this.addScore(15, 'Perfect stop!', 'SAFETY');
      this.maintainCombo();
    } else if (distanceToTarget < 5) {
      this.addScore(8, 'Good stop', 'SAFETY');
      this.maintainCombo();
    }
  }

  // ─── Penalty Scoring ───────────────────────────────────

  penaltySpeedViolation(speed: number, limit: number) {
    const overage = speed - limit;
    const penalty = Math.floor(-2 - overage * 0.5);
    this.addScore(penalty, `Speed violation (${Math.round(speed)} km/h)`, 'SPEED_CONTROL');
    this.breakCombo();
  }

  penaltyCollision(severity: 'MINOR' | 'WARNING' | 'MAJOR') {
    const penalties = { MINOR: -5, WARNING: -15, MAJOR: -30 };
    this.addScore(penalties[severity], `Collision (${severity})`, 'SAFETY');
    this.breakCombo();
  }

  penaltyAggressiveSteering() {
    this.addScore(-3, 'Aggressive steering', 'STEERING');
    this.breakCombo();
  }

  penaltyHardBraking() {
    this.addScore(-2, 'Hard braking', 'VEHICLE_CONTROL');
    this.breakCombo();
  }

  penaltyStall() {
    this.addScore(-5, 'Engine stall', 'VEHICLE_CONTROL');
    this.breakCombo();
  }

  penaltyWrongGear() {
    this.addScore(-3, 'Wrong gear selection', 'VEHICLE_CONTROL');
    this.breakCombo();
  }

  // ─── Combo System ──────────────────────────────────────

  private maintainCombo() {
    const now = Date.now();
    if (now - this.combo.lastGoodAction < this.combo.timeoutMs) {
      this.combo.streak++;
    } else {
      this.combo.streak = 1;
    }
    this.combo.lastGoodAction = now;
    this.combo.multiplier = 1 + Math.floor(this.combo.streak / 5) * 0.25;

    // Combo bonus every 5 streak
    if (this.combo.streak > 0 && this.combo.streak % 5 === 0) {
      const comboBonus = Math.floor(5 * this.combo.multiplier);
      this.addScore(comboBonus, `${this.combo.streak}x Combo!`, 'combo');
    }
  }

  private breakCombo() {
    if (this.combo.streak > 0) {
      this.combo.streak = 0;
      this.combo.multiplier = 1;
    }
  }

  updateCombo(deltaTime: number) {
    const now = Date.now();
    if (this.combo.streak > 0 && now - this.combo.lastGoodAction > this.combo.timeoutMs) {
      this.combo.streak = 0;
      this.combo.multiplier = 1;
    }
  }

  // ─── Score Calculation ─────────────────────────────────

  private addScore(delta: number, reason: string, category: string) {
    const adjustedDelta = Math.floor(delta * this.combo.multiplier);

    this.totalScore += adjustedDelta;
    this.totalScore = Math.max(0, Math.min(100, this.totalScore));

    if (this.categoryScores[category] !== undefined) {
      this.categoryScores[category] += adjustedDelta;
      this.categoryScores[category] = Math.max(0, Math.min(100, this.categoryScores[category]));
    }

    // Check milestones
    for (const milestone of this.milestones) {
      if (this.totalScore >= milestone && !this.reachedMilestones.has(milestone)) {
        this.reachedMilestones.add(milestone);
        this.scoreHistory.push({
          delta: 0,
          reason: `Milestone: ${milestone}%!`,
          type: 'milestone',
          timestamp: Date.now(),
        });
      }
    }

    this.scoreHistory.push({
      delta: adjustedDelta,
      reason,
      type: adjustedDelta > 0 ? 'positive' : adjustedDelta < 0 ? 'negative' : 'combo',
      timestamp: Date.now(),
    });
  }

  private getExpectedGear(speed: number): string {
    if (speed < 1) return 'N';
    if (speed < 15) return '1';
    if (speed < 30) return '2';
    if (speed < 45) return '3';
    if (speed < 60) return '4';
    return '5';
  }

  // ─── Getters ───────────────────────────────────────────

  getScore(): number {
    return this.totalScore;
  }

  getCombo(): ComboState {
    return { ...this.combo };
  }

  getCategoryScores(): ScoreCategory[] {
    return Object.entries(this.categoryScores).map(([name, score]) => ({
      name,
      weight: this.categoryWeights[name] || 0,
      score: Math.max(0, Math.min(100, score)),
    }));
  }

  getRecentUpdates(count = 5): ScoreUpdate[] {
    return this.scoreHistory.slice(-count);
  }

  getTotalMistakes(state: SimulationState): number {
    return state.mistakes.length;
  }

  // ─── Final Score ───────────────────────────────────────

  calculateFinalScore(state: SimulationState): number {
    const categories = this.getCategoryScores();
    let weightedScore = 0;
    for (const cat of categories) {
      weightedScore += cat.score * cat.weight;
    }

    // Bonus for no mistakes
    const mistakePenalty = state.mistakes.length * 3;
    const finalScore = Math.max(0, Math.min(100, weightedScore - mistakePenalty));

    return finalScore;
  }

  getBestComboStreak(): number {
    return this.combo.streak;
  }

  reset() {
    this.combo = { streak: 0, multiplier: 1, lastGoodAction: 0, timeoutMs: 5000 };
    this.scoreHistory = [];
    this.totalScore = 0;
    this.reachedMilestones = new Set();
    Object.keys(this.categoryScores).forEach(key => {
      this.categoryScores[key] = 0;
    });
  }
}
