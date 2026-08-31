// ============================================================
// ISHAMI SIMULATION — Mobile Touch Controls (Landscape Optimized)
// Left thumb: steering | Right thumb: pedals | Top: gears + actions
// Designed for landscape mode on smartphones
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';

interface MobileControlsProps {
  onAccelerate: (pressed: boolean) => void;
  onBrake: (pressed: boolean) => void;
  onClutch: (pressed: boolean) => void;
  onSteer: (angle: number) => void;
  onHandbrake: () => void;
  onGearSelect: (gear: string) => void;
  onCameraToggle: () => void;
  currentGear: string;
  engineRunning: boolean;
}

export default function MobileControls({
  onAccelerate,
  onBrake,
  onClutch,
  onSteer,
  onHandbrake,
  onGearSelect,
  onCameraToggle,
  currentGear,
  engineRunning,
}: MobileControlsProps) {
  const steerRef = useRef<HTMLDivElement>(null);
  const [steerAngle, setSteerAngle] = useState(0);
  const [isSteering, setIsSteering] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  // ─── Steering Wheel (Left side of screen) ─────────────

  const handleSteerStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    setIsSteering(true);
  }, []);

  const handleSteerMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!steerRef.current || touchIdRef.current === null) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const rect = steerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dx = touch.clientX - centerX;
    const maxAngle = rect.width / 2;
    const angle = Math.max(-1, Math.min(1, dx / maxAngle));

    setSteerAngle(angle);
    onSteer(angle);
  }, [onSteer]);

  const handleSteerEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      touchIdRef.current = null;
      setIsSteering(false);
      setSteerAngle(0);
      onSteer(0);
    }
  }, [onSteer]);

  // ─── Pedals (Right side of screen) ───────────────────

  const handlePedalStart = useCallback((type: 'accel' | 'brake' | 'clutch') => (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'accel') onAccelerate(true);
    else if (type === 'brake') onBrake(true);
    else if (type === 'clutch') onClutch(true);
  }, [onAccelerate, onBrake, onClutch]);

  const handlePedalEnd = useCallback((type: 'accel' | 'brake' | 'clutch') => (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'accel') onAccelerate(false);
    else if (type === 'brake') onBrake(false);
    else if (type === 'clutch') onClutch(false);
  }, [onAccelerate, onBrake, onClutch]);

  // ─── Gyroscope Steering ───────────────────────────────

  useEffect(() => {
    let active = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const gamma = e.gamma || 0;
      const normalized = Math.max(-1, Math.min(1, gamma / 30));
      if (Math.abs(normalized) > 0.05) {
        setSteerAngle(normalized);
        onSteer(normalized);
      } else {
        setSteerAngle(0);
        onSteer(0);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      active = true;
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [onSteer]);

  const gears = ['N', '1', '2', 'R'];

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none" style={{ touchAction: 'none' }}>

      {/* ═══ LEFT SIDE: Steering Wheel ═══ */}
      <div className="absolute left-3 bottom-3 pointer-events-auto flex flex-col items-center gap-2">
        {/* Clutch button — small, above steering wheel */}
        <button
          onTouchStart={handlePedalStart('clutch')}
          onTouchEnd={handlePedalEnd('clutch')}
          className="w-11 h-11 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-[9px] font-bold text-white/60 active:bg-yellow-500/25 active:border-yellow-500/40 active:text-yellow-300 transition-colors"
        >
          CLT
        </button>

        {/* Steering Wheel — main touch area */}
        <div
          ref={steerRef}
          onTouchStart={handleSteerStart}
          onTouchMove={handleSteerMove}
          onTouchEnd={handleSteerEnd}
          className="relative w-28 h-28 rounded-full bg-[#111827]/80 border-2 border-white/10 flex items-center justify-center touch-none"
        >
          {/* Outer ring */}
          <div className="absolute inset-2 rounded-full border border-white/5" />

          {/* Inner rotating wheel */}
          <div
            className="w-20 h-20 rounded-full border-3 border-blue-500/40 flex items-center justify-center"
            style={{
              transform: `rotate(${steerAngle * 45}deg)`,
              borderWidth: '3px',
              background: `radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <span className="text-[10px] text-blue-400">●</span>
            </div>
          </div>

          {/* Left/Right indicators */}
          <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full transition-colors ${steerAngle < -0.1 ? 'bg-red-400' : 'bg-white/5'}`} />
          <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full transition-colors ${steerAngle > 0.1 ? 'bg-red-400' : 'bg-white/5'}`} />

          {/* Label */}
          <div className="absolute -bottom-4 text-[8px] text-slate-600 font-medium tracking-wider">STEER</div>
        </div>
      </div>

      {/* ═══ RIGHT SIDE: Pedals ═══ */}
      <div className="absolute right-3 bottom-3 pointer-events-auto flex items-end gap-1.5">
        {/* Clutch pedal */}
        <button
          onTouchStart={handlePedalStart('clutch')}
          onTouchEnd={handlePedalEnd('clutch')}
          className="w-10 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-slate-600 active:bg-yellow-500/20 active:border-yellow-500/30 active:text-yellow-300 transition-colors"
        >
          CLT
        </button>

        {/* Brake pedal — medium height */}
        <button
          onTouchStart={handlePedalStart('brake')}
          onTouchEnd={handlePedalEnd('brake')}
          className="w-12 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-500 active:bg-red-500/20 active:border-red-500/30 active:text-red-400 transition-colors"
        >
          BRK
        </button>

        {/* Gas pedal — tallest */}
        <button
          onTouchStart={handlePedalStart('accel')}
          onTouchEnd={handlePedalEnd('accel')}
          className="w-12 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-500 active:bg-green-500/20 active:border-green-500/30 active:text-green-400 transition-colors"
        >
          GAS
        </button>
      </div>

      {/* ═══ TOP CENTER: Gear Selector ═══ */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1.5">
        {gears.map(g => (
          <button
            key={g}
            onTouchStart={(e) => { e.preventDefault(); onGearSelect(g); }}
            className={`w-9 h-9 rounded-lg text-[10px] font-bold transition-all ${
              currentGear === g
                ? g === 'R'
                  ? 'bg-red-500/30 border-2 border-red-500/50 text-red-300'
                  : g === 'N'
                  ? 'bg-amber-500/30 border-2 border-amber-500/50 text-amber-300'
                  : 'bg-blue-500/30 border-2 border-blue-500/50 text-white'
                : 'bg-white/5 border border-white/10 text-slate-600 active:bg-white/10'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ═══ TOP RIGHT: Quick Actions ═══ */}
      <div className="absolute top-2 right-3 pointer-events-auto flex gap-1.5">
        <button
          onTouchStart={(e) => { e.preventDefault(); onCameraToggle(); }}
          className="w-9 h-9 rounded-lg bg-[#111827]/70 border border-white/10 flex items-center justify-center text-slate-500 active:text-white active:bg-white/10 transition-colors"
        >
          📷
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onHandbrake(); }}
          className="w-9 h-9 rounded-lg bg-[#111827]/70 border border-white/10 flex items-center justify-center text-slate-500 active:text-amber-400 active:bg-amber-500/10 transition-colors"
        >
          🔧
        </button>
      </div>

      {/* ═══ STEERING ANGLE FEEDBACK ═══ */}
      {isSteering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="px-2 py-1 rounded-full bg-[#111827]/80 border border-white/10">
            <span className="text-[9px] text-blue-400 font-mono">
              {Math.round(steerAngle * 100)}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
