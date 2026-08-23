import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';

/* === Gray asphalt road texture — grayscale fractal-noise data URIs === */

/* Fine grain — the "noise" of the road surface */
const ASPHALT_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

/* Coarse mottle — darker aggregate patches like fresh tarmac */
const ASPHALT_MOTTLE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E")`;

export default function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  // Deterministic dust layout (no layout shift across re-renders)
  const dust = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const rng = (n: number) => {
          const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
          return x - Math.floor(x);
        };
        return {
          left: rng(1) * 100,
          top: rng(2) * 100,
          size: 1 + rng(3) * 2,
          drift: 30 + rng(4) * 70,
          duration: 9 + rng(5) * 11,
          delay: rng(6) * 8,
        };
      }),
    []
  );

  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden"
      aria-hidden="true"
      style={{ backgroundColor: '#333337' }}
    >
      {/* Asphalt depth gradient — road surface, slightly lighter ahead */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #37373b 0%, #333337 45%, #2e2e32 100%)',
        }}
      />

      {/* Coarse asphalt mottle (aggregate patches) */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: ASPHALT_MOTTLE, backgroundSize: '420px 420px', opacity: 0.55 }}
      />

      {/* Fine asphalt grain — the gray noise */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: ASPHALT_GRAIN, backgroundSize: '180px 180px', opacity: 0.45 }}
      />

      {/* Faint longitudinal road wear streaks */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
          opacity: 0.55,
        }}
      />

      {/* Breathing headlight glow ahead on the road */}
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 50% 12%, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Faint brand tint on the asphalt (blue/green, barely there) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 88% 92%, rgba(37,99,235,0.05) 0%, transparent 60%), radial-gradient(ellipse 45% 35% at 6% 78%, rgba(22,163,74,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Dust drifting in the headlights */}
      {dust.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={reduceMotion ? undefined : { y: [0, -p.drift, 0], opacity: [0.04, 0.16, 0.04] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Vignette — road edges fall into shadow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 130% 100% at 50% 35%, transparent 50%, rgba(10, 11, 15, 0.5) 100%)',
        }}
      />
    </div>
  );
}
