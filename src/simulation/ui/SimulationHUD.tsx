// ============================================================
// ISHAMI SIMULATION — Training HUD
// Clean in-game overlay: speed, objectives, status, controls
// ============================================================

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Camera, Volume2, VolumeX, Settings, RotateCcw, Keyboard } from 'lucide-react';
import type { SimulationState, InstructorStage } from '../core/SimulationState';

interface SimulationHUDProps {
  state: SimulationState;
  speed: number;
  rpm: number;
  onPause?: () => void;
  onCameraChange?: () => void;
  onMute?: () => void;
  isMuted?: boolean;
}

// Stage progress indicator
const STAGE_ORDER: InstructorStage[] = [
  'SEAT_ADJUSTMENT',
  'MIRROR_CHECK',
  'SEATBELT',
  'HANDBRAKE',
  'GEAR_CHECK',
  'ENGINE_START',
  'FIRST_GEAR',
  'MOVEMENT',
  'STEERING',
  'STOP',
  'COMPLETION',
];

export default function SimulationHUD({
  state,
  speed,
  rpm,
  onPause,
  onCameraChange,
  onMute,
  isMuted = false,
}: SimulationHUDProps) {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const currentStageIndex = STAGE_ORDER.indexOf(state.instructorStage);
  const progress = ((currentStageIndex + 1) / STAGE_ORDER.length) * 100;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Top Left — Mission Info */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="bg-[#111827]/80 backdrop-blur-lg rounded-2xl border border-white/10 px-4 py-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
            Mission 01
          </div>
          <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            GUIDED START
          </div>
          <div className="text-xs text-blue-400 mt-0.5">
            Gutangira Gutwara
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-32">
            <div className="flex justify-between text-[9px] text-slate-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Right — Speed */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="bg-[#111827]/80 backdrop-blur-lg rounded-2xl border border-white/10 px-5 py-3 text-right">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
            Speed
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
              {Math.round(speed)}
            </span>
            <span className="text-sm text-slate-400">km/h</span>
          </div>

          {/* Speed bar */}
          <div className="mt-2 w-24">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.min((speed / 40) * 100, 100)}%`,
                  background: speed > 30 ? '#ef4444' : speed > 20 ? '#f59e0b' : '#22c55e',
                }}
              />
            </div>
          </div>

          {/* Gear indicator */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">Gear</span>
            <span className="text-lg font-bold text-white tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
              {state.gear}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Center — Status Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-[#111827]/80 backdrop-blur-lg rounded-2xl border border-white/10 px-4 py-2 flex items-center gap-4">
          <StatusIndicator label="SEATBELT" active={state.seatbeltFastened} />
          <StatusIndicator label="ENGINE" active={state.engineRunning} />
          <StatusIndicator label="HANDBRAKE" active={!state.handbrakeOn} warning={state.handbrakeOn} />
          <div className="w-px h-6 bg-white/10" />
          <StatusIndicator
            label="CLUTCH"
            active={state.clutchPressed}
            warning={state.clutchPressed}
          />
        </div>
      </div>

      {/* Bottom Right — Controls */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onCameraChange}
            className="p-2 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            title="Change Camera (C)"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={onMute}
            className="p-2 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onPause}
            className="p-2 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            title="Pause"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls Hint (fades out) */}
      <AnimatePresence>
        {showControls && state.instructorStage === 'MOVEMENT' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-[#111827]/90 backdrop-blur-lg rounded-2xl border border-white/10 px-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Controls</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-400">
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">W/S</kbd> Accelerate / Brake</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">A/D</kbd> Steer</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">SHIFT</kbd> Clutch</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">SPACE</kbd> Handbrake</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">1/2/R</kbd> Gears</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">C</kbd> Camera</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mistake toast */}
      <AnimatePresence>
        {state.mistakes.length > 0 && (
          <MistakeToast
            key={state.mistakes[state.mistakes.length - 1].id}
            mistake={state.mistakes[state.mistakes.length - 1]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Status Indicator ─────────────────────────────────────

function StatusIndicator({
  label,
  active,
  warning = false,
}: {
  label: string;
  active: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          active ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : warning ? 'bg-amber-400' : 'bg-slate-600'
        }`}
      />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
        {label} {active ? '✓' : ''}
      </span>
    </div>
  );
}

// ─── Mistake Toast ─────────────────────────────────────────

function MistakeToast({ mistake }: { mistake: { severity: string; message: string } }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const colors = {
    INFO: 'border-blue-500/30 bg-blue-500/10',
    WARNING: 'border-amber-500/30 bg-amber-500/10',
    ERROR: 'border-red-500/30 bg-red-500/10',
  };

  const icons = {
    INFO: 'ℹ️',
    WARNING: '⚠️',
    ERROR: '🚨',
  };

  const severity = mistake.severity as keyof typeof colors;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-24 right-4 pointer-events-none"
    >
      <div className={`rounded-xl border px-4 py-3 backdrop-blur-lg ${colors[severity] || colors.INFO}`}>
        <div className="flex items-center gap-2">
          <span>{icons[severity] || 'ℹ️'}</span>
          <span className="text-sm text-white font-medium">{mistake.message}</span>
        </div>
      </div>
    </motion.div>
  );
}
