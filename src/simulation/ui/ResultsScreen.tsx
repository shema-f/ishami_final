// ============================================================
// ISHAMI SIMULATION — Results Screen
// Polished post-mission evaluation with scoring and medals
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, RotateCcw, Home, ChevronRight, Zap, Target, Shield, Gauge, Car } from 'lucide-react';
import type { SimulationState, ScoreCategory, Mistake } from '../core/SimulationState';
import { GUIDED_START_CONFIG } from '../scenarios/GuidedStartConfig';

interface ResultsScreenProps {
  state: SimulationState;
  onRetry: () => void;
  onReturn: () => void;
}

export default function ResultsScreen({ state, onRetry, onReturn }: ResultsScreenProps) {
  const [showScore, setShowScore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowScore(true), 500);
    const t2 = setTimeout(() => setShowDetails(true), 1200);
    const t3 = setTimeout(() => setShowActions(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const score = state.totalScore;
  const medal = getMedal(score);
  const passed = score >= 70;

  // Separate mistakes and good points
  const warnings = state.mistakes.filter((m) => m.severity === 'WARNING' || m.severity === 'ERROR');
  const completedObjectives = state.waypoints.filter((wp) => wp.completed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto py-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-lg mx-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#111827]/95 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Top accent */}
          <div className={`h-1 ${passed ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} />

          <div className="p-8">
            {/* Mission Complete Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              {passed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
                  className="text-5xl mb-3"
                >
                  {medal.emoji}
                </motion.div>
              )}
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                {passed ? 'Mission Complete' : 'Practice Required'}
              </div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {GUIDED_START_CONFIG.title}
              </h2>
              <p className="text-sm text-blue-400 mt-1">
                {GUIDED_START_CONFIG.titleRW || 'Gutangira Gutwara'}
              </p>
            </motion.div>

            {/* Score Display */}
            <AnimatePresence>
              {showScore && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-center mb-6"
                >
                  <div className="relative inline-block">
                    <div className="text-6xl font-bold text-white tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
                      {Math.round(score)}
                    </div>
                    <div className="text-lg text-slate-400">/ 100</div>
                  </div>

                  {/* Medal */}
                  <div className="mt-2 text-sm font-bold" style={{ color: medal.color }}>
                    {medal.label}
                  </div>

                  {/* XP */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/20"
                  >
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400">+{GUIDED_START_CONFIG.xpReward} XP</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Score Breakdown */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 mb-6"
                >
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Score Breakdown
                  </div>

                  {state.scoreCategories.map((cat, i) => (
                    <ScoreRow key={cat.name} category={cat} delay={i * 0.1} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mistakes & Good Work */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 mb-6"
                >
                  {/* Mistakes */}
                  {warnings.length > 0 && (
                    <div>
                      <div className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">
                        ⚠️ What to Improve
                      </div>
                      <div className="space-y-1.5">
                        {warnings.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/15">
                            <span className="text-xs">⚠️</span>
                            <span className="text-xs text-slate-300">{m.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Good Work */}
                  <div>
                    <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-2">
                      ✓ Good Work
                    </div>
                    <div className="space-y-1.5">
                      {state.seatbeltFastened && <GoodPoint text="Seatbelt fastened" />}
                      {state.mirrorsChecked.left && state.mirrorsChecked.right && state.mirrorsChecked.rear && (
                        <GoodPoint text="Mirror checks completed" />
                      )}
                      {state.seatAdjusted && <GoodPoint text="Driving position adjusted" />}
                      {state.engineRunning && <GoodPoint text="Correct starting procedure" />}
                      {completedObjectives.length > 0 && (
                        <GoodPoint text={`${completedObjectives.length} checkpoints reached`} />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <button
                    onClick={onRetry}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all hover:-translate-y-0.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry Mission
                  </button>
                  <button
                    onClick={onReturn}
                    className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Return to Simulations
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative gradients */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Score Row ────────────────────────────────────────────

function ScoreRow({ category, delay }: { category: ScoreCategory; delay: number }) {
  const icons: Record<string, any> = {
    VEHICLE_CONTROL: Gauge,
    SAFETY: Shield,
    TRAFFIC_COMPLIANCE: Target,
    STEERING: Car,
    SPEED_CONTROL: Gauge,
  };
  const Icon = icons[category.name] || Target;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400 uppercase tracking-wider font-bold">
            {category.name.replace('_', ' ')}
          </span>
          <span className="text-white font-bold tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
            {Math.round(category.score)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${category.score}%` }}
            transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background:
                category.score >= 80
                  ? 'linear-gradient(to right, #22c55e, #4ade80)'
                  : category.score >= 60
                  ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                  : 'linear-gradient(to right, #ef4444, #f87171)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Good Point ──────────────────────────────────────────

function GoodPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
      <span className="text-xs">✓</span>
      <span className="text-xs text-slate-300">{text}</span>
    </div>
  );
}

// ─── Medal Helper ─────────────────────────────────────────

function getMedal(score: number) {
  if (score >= 90) return { emoji: '🥇', label: 'Gold Medal', color: '#F59E0B' };
  if (score >= 80) return { emoji: '🥈', label: 'Silver Medal', color: '#94A3B8' };
  if (score >= 70) return { emoji: '🥉', label: 'Bronze Medal', color: '#D97706' };
  return { emoji: '📚', label: 'Practice Required', color: '#6B7280' };
}
