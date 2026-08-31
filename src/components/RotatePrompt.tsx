// ============================================================
// ISHAMI — Rotate to Landscape Prompt
// Shows overlay on mobile when in portrait mode during simulation
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function getIsPortrait(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
}

function getIsMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.innerWidth <= 768);
}

export default function RotatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      setShowPrompt(mobile && getIsPortrait());
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', () => {
      // Small delay to let browser settle after rotation
      setTimeout(check, 200);
    });

    return () => {
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-[#0d1117]/98 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          {/* Animated rotate icon */}
          <motion.div
            animate={{
              rotate: [0, 0, 90, 90, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8"
          >
            <div className="w-20 h-12 bg-[#111827] border-2 border-white/20 rounded-xl flex items-center justify-center relative">
              <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-white/30" />
              <div className="text-2xl">📱</div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rotate Your Device
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-400 text-center max-w-xs mb-2"
          >
            The driving simulation works best in <span className="text-blue-400 font-semibold">landscape mode</span>.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-slate-500"
          >
            Turn your phone sideways to play
          </motion.p>

          {/* Landscape preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-3"
          >
            {/* Portrait (dimmed) */}
            <div className="w-10 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">📱</span>
            </div>
            <span className="text-slate-500 text-lg">→</span>
            {/* Landscape (highlighted) */}
            <div className="w-16 h-10 bg-blue-500/10 border-2 border-blue-500/40 rounded-lg flex items-center justify-center">
              <span className="text-lg">📱</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
