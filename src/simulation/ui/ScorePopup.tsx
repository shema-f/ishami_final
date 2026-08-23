// ============================================================
// ISHAMI SIMULATION — Score Popups & Combo Display
// Real-time floating score notifications and combo indicator
// ============================================================

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { ScoreUpdate, ComboState } from '../core/ScoringSystem';

interface ScorePopupProps {
  updates: ScoreUpdate[];
  combo: ComboState;
}

export default function ScorePopup({ updates, combo }: ScorePopupProps) {
  const [visibleUpdates, setVisibleUpdates] = useState<ScoreUpdate[]>([]);

  useEffect(() => {
    if (updates.length === 0) return;
    const latest = updates[updates.length - 1];
    setVisibleUpdates(prev => [...prev.slice(-4), latest]);

    // Remove after animation
    const timer = setTimeout(() => {
      setVisibleUpdates(prev => prev.filter(u => u !== latest));
    }, 2500);

    return () => clearTimeout(timer);
  }, [updates]);

  return (
    <>
      {/* ─── Floating Score Popups ─── */}
      <div className="absolute top-20 right-4 z-30 pointer-events-none flex flex-col gap-1.5">
        <AnimatePresence>
          {visibleUpdates.map((update, i) => (
            <motion.div
              key={`${update.timestamp}-${i}`}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-lg border ${
                  update.type === 'positive'
                    ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                    : update.type === 'negative'
                    ? 'bg-red-500/15 border-red-500/25 text-red-400'
                    : update.type === 'combo'
                    ? 'bg-blue-500/15 border-blue-500/25 text-blue-400'
                    : 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                }`}
              >
                <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
                  {update.delta > 0 ? '+' : ''}{update.delta}
                </span>
                <span className="text-[10px] opacity-75">
                  {update.reason}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── Combo Streak Display ─── */}
      <AnimatePresence>
        {combo.streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-lg">
              {/* Combo fire animation */}
              <div className="relative">
                <motion.span
                  className="text-2xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🔥
                </motion.span>
                {combo.streak >= 10 && (
                  <motion.span
                    className="absolute -top-1 -right-1 text-sm"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-xl font-black text-white tabular-nums"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {combo.streak}
                  </span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Combo
                  </span>
                </div>
                {combo.multiplier > 1 && (
                  <span className="text-[10px] text-purple-400 font-bold">
                    ×{combo.multiplier.toFixed(2)} multiplier
                  </span>
                )}
              </div>

              {/* Combo progress bar */}
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  animate={{ width: `${Math.min((combo.streak % 5) / 5 * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
