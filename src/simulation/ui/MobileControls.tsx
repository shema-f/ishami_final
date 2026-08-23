// ============================================================
// ISHAMI SIMULATION — Mobile Touch Controls
// Steering wheel, pedals, and gear controls for mobile
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

  // ─── Steering Wheel ──────────────────────────────────

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

  // ─── Pedals ───────────────────────────────────────────

  const handlePedalStart = useCallback((type: 'accel' | 'brake' | 'clutch') => (e: React.TouchEvent) => {
    e.preventDefault();
    if (type === 'accel') onAccelerate(true);
    else if (type === 'brake') onBrake(true);
    else if (type === 'clutch') onClutch(true);
  }, [onAccelerate, onBrake, onClutch]);

  const handlePedalEnd = useCallback((type: 'accel' | 'brake' | 'clutch') => (e: React.TouchEvent) => {
    e.preventDefault();
    if (type === 'accel') onAccelerate(false);
    else if (type === 'brake') onBrake(false);
    else if (type === 'clutch') onClutch(false);
  }, [onAccelerate, onBrake, onClutch]);

  // ─── Gyroscope Steering ───────────────────────────────

  useEffect(() => {
    let lastGamma = 0;
    let active = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const gamma = e.gamma || 0; // left/right tilt (-90 to 90)
      const normalized = Math.max(-1, Math.min(1, gamma / 30));
      // Only use if significant
      if (Math.abs(normalized) > 0.05) {
        setSteerAngle(normalized);
        onSteer(normalized);
      } else {
        setSteerAngle(0);
        onSteer(0);
      }
      lastGamma = gamma;
    };

    // Check if device orientation is available
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
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* ─── Left Side: Steering + Clutch ─── */}
      <div className="absolute left-4 bottom-4 pointer-events-auto flex flex-col items-center gap-3">
        {/* Clutch Button */}
        <button
          onTouchStart={handlePedalStart('clutch')}
          onTouchEnd={handlePedalEnd('clutch')}
          className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white active:bg-blue-500/30 active:border-blue-500/50 transition-colors select-none"
        >
          CLT
        </button>

        {/* Steering Wheel */}
        <div
          ref={steerRef}
          onTouchStart={handleSteerStart}
          onTouchMove={handleSteerMove}
          onTouchEnd={handleSteerEnd}
          className="relative w-36 h-36 rounded-full bg-[#111827]/80 border-2 border-white/10 flex items-center justify-center select-none touch-none"
        >
          {/* Outer ring */}
          <div className="absolute inset-2 rounded-full border-2 border-white/5" />

          {/* Steering wheel visual */}
          <div
            className="w-24 h-24 rounded-full border-4 border-blue-500/50 flex items-center justify-center transition-transform"
            style={{
              transform: `rotate(${steerAngle * 45}deg)`,
              background: `radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)`,
            }}
          >
            {/* Center hub */}
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-xs text-blue-400">●</span>
            </div>
          </div>

          {/* Left/Right indicators */}
          <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-colors ${steerAngle < -0.1 ? 'bg-red-400' : 'bg-white/10'}`} />
          <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-colors ${steerAngle > 0.1 ? 'bg-red-400' : 'bg-white/10'}`} />

          {/* Angle display */}
          <div className="absolute -bottom-1 text-[9px] text-slate-500 font-mono">
            {Math.round(steerAngle * 100)}°
          </div>
        </div>
      </div>

      {/* ─── Right Side: Pedals + Gears ─── */}
      <div className="absolute right-4 bottom-4 pointer-events-auto flex flex-col items-center gap-2">
        {/* Gear Selector */}
        <div className="flex gap-1.5 mb-2">
          {gears.map(g => (
            <button
              key={g}
              onTouchStart={(e) => { e.preventDefault(); onGearSelect(g); }}
              className={`w-10 h-10 rounded-xl text-xs font-bold select-none transition-all ${
                currentGear === g
                  ? 'bg-blue-500/30 border-2 border-blue-500/50 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-500 active:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Pedals */}
        <div className="flex gap-2 items-end">
          {/* Clutch (left pedal) */}
          <button
            onTouchStart={handlePedalStart('clutch')}
            onTouchEnd={handlePedalEnd('clutch')}
            className="w-12 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500 active:bg-yellow-500/20 active:border-yellow-500/30 active:text-yellow-400 transition-colors select-none"
          >
            CLT
          </button>

          {/* Brake (middle pedal) */}
          <button
            onTouchStart={handlePedalStart('brake')}
            onTouchEnd={handlePedalEnd('brake')}
            className="w-12 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500 active:bg-red-500/20 active:border-red-500/30 active:text-red-400 transition-colors select-none"
          >
            BRK
          </button>

          {/* Accelerator (right pedal) */}
          <button
            onTouchStart={handlePedalStart('accel')}
            onTouchEnd={handlePedalEnd('accel')}
            className="w-12 h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500 active:bg-green-500/20 active:border-green-500/30 active:text-green-400 transition-colors select-none"
          >
            GAS
          </button>
        </div>
      </div>

      {/* ─── Top Right: Quick Actions ─── */}
      <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
        <button
          onTouchStart={(e) => { e.preventDefault(); onCameraToggle(); }}
          className="p-2.5 rounded-xl bg-[#111827]/80 border border-white/10 text-slate-400 active:text-white active:bg-white/10 transition-colors select-none"
        >
          📷
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onHandbrake(); }}
          className="p-2.5 rounded-xl bg-[#111827]/80 border border-white/10 text-slate-400 active:text-amber-400 active:bg-amber-500/10 transition-colors select-none"
        >
          🔧
        </button>
      </div>

      {/* ─── Steering Angle Indicator ─── */}
      {isSteering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="px-3 py-1.5 rounded-full bg-[#111827]/90 border border-white/10">
            <span className="text-xs text-blue-400 font-mono">
              Steering: {Math.round(steerAngle * 100)}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
