// ============================================================
// ISHAMI SIMULATION — Mission Briefing Screen
// Professional mission introduction before gameplay
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, MapPin, Star, ChevronRight, BookOpen } from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { GUIDED_START_CONFIG } from '../scenarios/GuidedStartConfig';

interface MissionBriefingProps {
  onStart: () => void;
  scenario?: typeof GUIDED_START_CONFIG;
}

export default function MissionBriefing({ onStart, scenario = GUIDED_START_CONFIG }: MissionBriefingProps) {
  const { t, lang } = useTranslation();
  const [showObjectives, setShowObjectives] = useState(false);
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowObjectives(true), 600);
    const timer2 = setTimeout(() => setShowStart(true), 1200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-2xl mx-4"
      >
        {/* Glass card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />

          <div className="p-8">
            {/* Mission header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Mission 01
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {scenario.difficulty}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {lang === 'rw' ? scenario.titleRW : scenario.title}
              </h1>
              <p className="text-lg text-blue-400 font-medium mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Gutangira Gutwara
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-300 text-sm leading-relaxed mb-6"
            >
              {lang === 'rw' ? scenario.descriptionRW : scenario.description}
            </motion.p>

            {/* Meta info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{scenario.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'rw' ? scenario.locationRW : scenario.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" />
                <span>+{scenario.xpReward} XP</span>
              </div>
            </motion.div>

            {/* Objectives */}
            <AnimatePresence>
              {showObjectives && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Objectives
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {scenario.objectives.map((obj, i) => (
                      <motion.div
                        key={obj.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.06 }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5"
                      >
                        <span className="text-base">{obj.icon}</span>
                        <span className="text-sm text-slate-300">
                          {lang === 'rw' ? obj.textRW : obj.text}
                        </span>
                        <span className="ml-auto text-xs text-slate-500 font-mono">✓</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start button */}
            <AnimatePresence>
              {showStart && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <button
                    onClick={onStart}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Start Training
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative gradient */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}
