// ============================================================
// ISHAMI SIMULATION — Vehicle Preparation Panel
// Interactive step-by-step vehicle preparation system
// ============================================================

import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, Power, CheckCircle2, MousePointer2, Keyboard, ArrowDown,
} from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import type { InstructorStage, SimulationState, GearState } from '../core/SimulationState';

interface PreparationPanelProps {
  stage: InstructorStage;
  state: SimulationState;
  onSeatAdjust: () => void;
  onMirrorCheck: (mirror: 'left' | 'right' | 'rear') => void;
  onSeatbeltFasten: () => void;
  onClutchToggle: (pressed: boolean) => void;
  onHandbrakeToggle: () => void;
  onGearSelect: (gear: GearState) => void;
  onEngineStart: () => void;
}

const PREP_STAGES: InstructorStage[] = [
  'SEAT_ADJUSTMENT',
  'MIRROR_CHECK',
  'SEATBELT',
  'HANDBRAKE',
  'GEAR_CHECK',
  'ENGINE_START',
  'FIRST_GEAR',
];

const STEP_ICONS: Record<string, string> = {
  SEAT_ADJUSTMENT: '💺',
  MIRROR_CHECK: '🔍',
  SEATBELT: '🔒',
  HANDBRAKE: '🔧',
  GEAR_CHECK: '⚙️',
  ENGINE_START: '🔑',
  FIRST_GEAR: '➡️',
};

const STEP_LABELS: Record<string, string> = {
  SEAT_ADJUSTMENT: 'Driving Position',
  MIRROR_CHECK: 'Mirror Check',
  SEATBELT: 'Seatbelt',
  HANDBRAKE: 'Handbrake',
  GEAR_CHECK: 'Neutral Gear',
  ENGINE_START: 'Start Engine',
  FIRST_GEAR: 'First Gear',
};

const STEP_HINTS: Record<string, string> = {
  SEAT_ADJUSTMENT: 'Click the button below or press ENTER',
  MIRROR_CHECK: 'Click each mirror to check it',
  SEATBELT: 'Click the button or press ENTER',
  HANDBRAKE: 'Click the button or press SPACE',
  GEAR_CHECK: 'Press N for neutral',
  ENGINE_START: 'Hold SHIFT (clutch) + press ENTER',
  FIRST_GEAR: 'Press 1 for first gear',
};

function isStageComplete(stage: InstructorStage, state: SimulationState): boolean {
  switch (stage) {
    case 'SEAT_ADJUSTMENT': return state.seatAdjusted;
    case 'MIRROR_CHECK': return state.mirrorsChecked.left && state.mirrorsChecked.right && state.mirrorsChecked.rear;
    case 'SEATBELT': return state.seatbeltFastened;
    case 'HANDBRAKE': return !state.handbrakeOn;
    case 'GEAR_CHECK': return state.gear === 'N';
    case 'ENGINE_START': return state.engineRunning;
    case 'FIRST_GEAR': return state.gear === '1';
    default: return false;
  }
}

export default function PreparationPanel({
  stage,
  state,
  onSeatAdjust,
  onMirrorCheck,
  onSeatbeltFasten,
  onClutchToggle,
  onHandbrakeToggle,
  onGearSelect,
  onEngineStart,
}: PreparationPanelProps) {
  const { t, lang } = useTranslation();
  const stageIndex = PREP_STAGES.indexOf(stage);
  const isActive = stageIndex >= 0 && stageIndex <= PREP_STAGES.indexOf('FIRST_GEAR');

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-4 top-24 z-20 pointer-events-auto"
    >
      <div className="bg-[#111827]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden w-80">
        <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400" />

        <div className="p-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">
            {t('sim.vehicle_prep', 'Vehicle Preparation')}
          </div>

          {/* Step list */}
          <div className="space-y-1.5">
            {PREP_STAGES.map((s) => {
              const isCurrent = s === stage;
              const done = isStageComplete(s, state);
              return (
                <div
                  key={s}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isCurrent && !done
                      ? 'bg-blue-500/15 border border-blue-500/25'
                      : done
                      ? 'bg-emerald-500/10 border border-emerald-500/15'
                      : 'bg-white/3 border border-transparent'
                  }`}
                >
                  <span className="text-sm">{STEP_ICONS[s]}</span>
                  <span className={`text-xs font-medium flex-1 ${
                    isCurrent && !done ? 'text-white' : done ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {STEP_LABELS[s]}
                  </span>
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && !done && (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── ACTION AREA ─── The big clickable button for the current step */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <AnimatePresence mode="wait">
              {stage === 'SEAT_ADJUSTMENT' && !state.seatAdjusted && (
                <motion.div key="seat" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text={STEP_HINTS.SEAT_ADJUSTMENT} />
                  <button
                    onClick={onSeatAdjust}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-blue-500/20 border-2 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all group active:scale-95"
                  >
                    <span className="text-xl">💺</span>
                    <span className="text-sm text-white font-bold flex-1 text-left">Adjust Driving Position</span>
                    <MousePointer2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">ENTER</kbd>
                  </p>
                </motion.div>
              )}

              {stage === 'MIRROR_CHECK' && (
                <motion.div key="mirrors" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text="Click each mirror button to check it" />
                  <div className="space-y-2">
                    {(['left', 'right', 'rear'] as const).map((mirror) => (
                      <button
                        key={mirror}
                        onClick={() => onMirrorCheck(mirror)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95 ${
                          state.mirrorsChecked[mirror]
                            ? 'bg-emerald-500/15 border-2 border-emerald-500/25'
                            : 'bg-white/5 border-2 border-white/15 hover:bg-white/10 hover:border-white/25'
                        }`}
                      >
                        <Eye className={`w-5 h-5 ${state.mirrorsChecked[mirror] ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className={`text-sm font-bold flex-1 text-left capitalize ${state.mirrorsChecked[mirror] ? 'text-emerald-400' : 'text-white'}`}>
                          {mirror} Mirror
                        </span>
                        {state.mirrorsChecked[mirror] && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {!state.mirrorsChecked[mirror] && <MousePointer2 className="w-4 h-4 text-slate-500" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {stage === 'SEATBELT' && !state.seatbeltFastened && (
                <motion.div key="seatbelt" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text={STEP_HINTS.SEATBELT} />
                  <button
                    onClick={onSeatbeltFasten}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-blue-500/20 border-2 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all group active:scale-95"
                  >
                    <span className="text-xl">🔒</span>
                    <span className="text-sm text-white font-bold flex-1 text-left">Fasten Seatbelt</span>
                    <MousePointer2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">ENTER</kbd>
                  </p>
                </motion.div>
              )}

              {stage === 'HANDBRAKE' && state.handbrakeOn && (
                <motion.div key="handbrake" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text={STEP_HINTS.HANDBRAKE} />
                  <button
                    onClick={onHandbrakeToggle}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-blue-500/20 border-2 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all group active:scale-95"
                  >
                    <span className="text-xl">🔧</span>
                    <span className="text-sm text-white font-bold flex-1 text-left">Release Handbrake</span>
                    <MousePointer2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">SPACE</kbd>
                  </p>
                </motion.div>
              )}

              {stage === 'GEAR_CHECK' && state.gear !== 'N' && (
                <motion.div key="gear" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text="Press N for neutral gear" />
                  <div className="grid grid-cols-4 gap-2">
                    {(['N', '1', '2', 'R'] as GearState[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => onGearSelect(g)}
                        className={`py-3 rounded-xl text-base font-bold transition-all active:scale-95 ${
                          state.gear === g && g === 'N'
                            ? 'bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-400'
                            : state.gear === g
                            ? 'bg-blue-500/20 border-2 border-blue-500/30 text-blue-400'
                            : 'bg-white/5 border-2 border-white/15 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">N</kbd>
                  </p>
                </motion.div>
              )}

              {stage === 'ENGINE_START' && (
                <motion.div key="engine" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text="Hold SHIFT (clutch), then click Start Engine" />
                  {/* Status grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <StatusBox label="Clutch" active={state.clutchPressed} />
                    <StatusBox label="Gear" active={state.gear === 'N'} value={state.gear} />
                    <StatusBox label="Brake" active={state.handbrakeOn} />
                  </div>

                  {/* Clutch toggle */}
                  <button
                    onClick={() => onClutchToggle(!state.clutchPressed)}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all mb-2 active:scale-95 ${
                      state.clutchPressed
                        ? 'bg-blue-500/25 border-2 border-blue-500/30 text-blue-300'
                        : 'bg-white/5 border-2 border-white/15 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {state.clutchPressed ? '🎹 Clutch HELD — release to start' : '🎹 Hold SHIFT for Clutch'}
                  </button>

                  {/* Engine start */}
                  <button
                    onClick={onStart}
                    disabled={!state.clutchPressed || state.gear !== 'N' || !state.handbrakeOn}
                    className={`w-full py-4 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      state.clutchPressed && state.gear === 'N' && state.handbrakeOn
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl'
                        : 'bg-white/5 border-2 border-white/10 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Power className="w-5 h-5" />
                    {state.engineRunning ? '✅ Engine Running!' : '🔑 Start Engine'}
                  </button>

                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or hold <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">SHIFT</kbd> + press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">ENTER</kbd>
                  </p>
                </motion.div>
              )}

              {stage === 'FIRST_GEAR' && state.gear !== '1' && (
                <motion.div key="firstgear" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActionHint text="Press 1 for first gear" />
                  <div className="grid grid-cols-4 gap-2">
                    {(['N', '1', '2', 'R'] as GearState[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => onGearSelect(g)}
                        className={`py-3 rounded-xl text-base font-bold transition-all active:scale-95 ${
                          state.gear === g && g === '1'
                            ? 'bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-400'
                            : state.gear === g
                            ? 'bg-blue-500/20 border-2 border-blue-500/30 text-blue-400'
                            : 'bg-white/5 border-2 border-white/15 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">1</kbd>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Action Hint ──────────────────────────────────────────

function ActionHint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <Keyboard className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
      <span className="text-[11px] text-amber-300 font-medium">{text}</span>
    </div>
  );
}

// ─── Status Box ───────────────────────────────────────────

function StatusBox({ label, active, value }: { label: string; active: boolean; value?: string }) {
  return (
    <div className={`text-center p-2 rounded-lg ${active ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-white/5 border border-white/5'}`}>
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className={`text-xs font-bold ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
        {value || (active ? '✓' : '—')}
      </div>
    </div>
  );
}
