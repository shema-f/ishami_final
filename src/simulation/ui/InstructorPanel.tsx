// ============================================================
// ISHAMI SIMULATION — Moto Sensei Instructor Panel
// Reusable instructor with speech bubbles and contextual feedback
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/I18nContext';
import { getStageEnterMessage, getInstructorMessage } from '../core/InstructorMessages';
import type { InstructorStage } from '../core/SimulationState';

interface InstructorPanelProps {
  stage: InstructorStage;
  trigger?: string;
  visible?: boolean;
}

export default function InstructorPanel({
  stage,
  trigger = 'stage_enter',
  visible = true,
}: InstructorPanelProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const prevStageRef = useRef<InstructorStage>(stage);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get message when stage or trigger changes
  useEffect(() => {
    let msg = null;

    if (trigger !== 'stage_enter') {
      msg = getInstructorMessage(stage, trigger, lang);
    }

    if (!msg) {
      msg = getStageEnterMessage(stage, lang);
    }

    if (msg) {
      // Typewriter effect
      setIsTyping(true);
      setMessage('');

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      let i = 0;
      const typeChar = () => {
        if (i < msg!.text.length) {
          setMessage(msg!.text.substring(0, i + 1));
          i++;
          typingTimerRef.current = setTimeout(typeChar, 25);
        } else {
          setIsTyping(false);
        }
      };

      // Small delay before typing starts
      typingTimerRef.current = setTimeout(typeChar, 300);
    }

    prevStageRef.current = stage;

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [stage, trigger, lang]);

  if (!visible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${stage}-${trigger}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute bottom-20 left-4 z-20 max-w-sm pointer-events-auto"
      >
        <div className="relative bg-[#111827]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-0.5 bg-gradient-to-r from-amber-500 to-orange-400" />

          <div className="p-4">
            {/* Instructor identity */}
            <div className="flex items-center gap-3 mb-3">
              {/* Moto Sensei avatar */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                <span className="text-lg">🧑‍🏫</span>
                {/* Speaking indicator */}
                {isTyping && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Moto Sensei
                </div>
                <div className="text-[10px] text-slate-500">
                  {t('sim.instructor_title', 'Your Driving Instructor')}
                </div>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="relative bg-white/5 rounded-xl p-3 border border-white/5">
              {/* Speech bubble pointer */}
              <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white/5 border-l border-t border-white/5 transform rotate-45" />

              <p className="text-sm text-slate-200 leading-relaxed">
                {message}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 animate-pulse align-text-bottom" />
                )}
              </p>
            </div>

            {/* Stage indicator */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {formatStageName(stage)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatStageName(stage: InstructorStage): string {
  return stage
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
