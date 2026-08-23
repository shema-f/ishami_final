import { motion } from 'motion/react'
import HeroContent from './HeroContent'

/**
 * Lightweight fallback hero for mobile and low-end devices.
 * Uses CSS gradients and simple motion animations instead of WebGL.
 * Shares the same HeroContent overlay for consistent text/CTA.
 */
export default function FallbackHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100dvh', // dynamic viewport height handles mobile browser chrome
        background: '#0a0e14',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── Animated gradient sky ─────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0a0e14 0%, #0d1b2a 30%, #1b2838 55%, #0a0e14 100%)',
        }}
      />

      {/* ── City silhouette (CSS shapes) ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] sm:h-[45%] pointer-events-none">
        {/* Background buildings */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 opacity-40">
          {[18, 28, 15, 35, 22, 12, 30, 20, 25, 14, 32, 18, 26].map((h, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-t-sm"
              style={{
                width: `${3 + (i % 3)}%`,
                height: `${h}%`,
                background: `linear-gradient(180deg, #111828 0%, #0a1018 100%)`,
                boxShadow: '0 0 8px rgba(0,136,255,0.05)',
              }}
            />
          ))}
        </div>

        {/* Midground buildings */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0 sm:gap-0.5 px-4 sm:px-8 opacity-60">
          {[22, 35, 18, 40, 28, 15, 38, 25, 30].map((h, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-t-sm relative"
              style={{
                width: `${4 + (i % 3) * 2}%`,
                height: `${h}%`,
                background: `linear-gradient(180deg, #151e2e 0%, #0c131e 100%)`,
              }}
            >
              {/* Window lights */}
              <div className="absolute inset-1 grid grid-cols-2 gap-0.5 opacity-50">
                {Array.from({ length: Math.floor(h / 4) }).map((_, j) => (
                  <div
                    key={j}
                    className="w-full h-1 rounded-full"
                    style={{
                      background:
                        Math.random() > 0.4
                          ? 'rgba(255,238,180,0.4)'
                          : 'rgba(0,136,255,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* KCC dome silhouette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-50">
          <div
            className="rounded-t-full"
            style={{
              width: 'clamp(80px, 20vw, 120px)',
              height: 'clamp(40px, 10vw, 60px)',
              background:
                'linear-gradient(180deg, #1a2540 0%, #0f1825 100%)',
              boxShadow: '0 0 20px rgba(0,136,255,0.08)',
            }}
          />
        </div>

        {/* Road surface */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 sm:h-8"
          style={{
            background:
              'linear-gradient(180deg, #111822 0%, #0a0e14 100%)',
          }}
        />

        {/* Road center line */}
        <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-6 sm:w-8 rounded-full"
              style={{
                background: 'rgba(255,255,200,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Animated car silhouette ───────────────────────────── */}
      <motion.div
        initial={{ x: '-20%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        {/* Car body */}
        <div className="relative" style={{ width: 'clamp(100px, 30vw, 140px)', height: 'clamp(35px, 10vw, 50px)' }}>
          {/* Lower body */}
          <div
            className="absolute bottom-2 left-0 right-0 h-5 rounded-sm"
            style={{
              background:
                'linear-gradient(90deg, #0a0a12 0%, #111122 50%, #0a0a12 100%)',
              boxShadow: '0 0 15px rgba(0,136,255,0.15)',
            }}
          />
          {/* Upper cabin */}
          <div
            className="absolute bottom-7 left-4 right-4 h-4 rounded-t-sm"
            style={{
              background: 'linear-gradient(180deg, #0d0d18 0%, #0a0a12 100%)',
            }}
          />
          {/* Windshield */}
          <div
            className="absolute bottom-7 left-3 w-3 h-4 rounded-tl-sm"
            style={{
              background: 'rgba(20,40,70,0.6)',
            }}
          />
          {/* Headlights */}
          <div
            className="absolute bottom-3 right-0 w-1.5 h-1 rounded-full"
            style={{
              background: '#fff',
              boxShadow: '0 0 8px #fff, 0 0 20px rgba(255,255,255,0.5)',
            }}
          />
          {/* Taillights */}
          <div
            className="absolute bottom-3 left-0 w-1.5 h-1 rounded-full"
            style={{
              background: '#ff1a1a',
              boxShadow: '0 0 6px #ff1a1a',
            }}
          />
          {/* Blue accent */}
          <div
            className="absolute bottom-2 left-1 right-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, #0088ff, transparent)',
              boxShadow: '0 0 4px #0088ff',
            }}
          />
          {/* Wheels */}
          <div
            className="absolute bottom-0 left-3 w-3 h-3 rounded-full"
            style={{ background: '#111', border: '1px solid #222' }}
          />
          <div
            className="absolute bottom-0 right-3 w-3 h-3 rounded-full"
            style={{ background: '#111', border: '1px solid #222' }}
          />
          {/* Headlight beam */}
          <div
            className="absolute bottom-2 -right-12 w-12 h-6 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(ellipse at left center, rgba(255,255,255,0.4) 0%, transparent 70%)',
            }}
          />
        </div>
      </motion.div>

      {/* ── Floating particles (CSS only) ────────────────────── */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: '#0088ff',
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            opacity: 0.2 + Math.random() * 0.3,
          }}
          animate={{
            y: [0, -15 - Math.random() * 20, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Streetlights ──────────────────────────────────────── */}
      {[15, 35, 65, 85].map((left, i) => (
        <div
          key={i}
          className="absolute bottom-8 pointer-events-none"
          style={{ left: `${left}%` }}
        >
          <div
            className="w-0.5 h-16 mx-auto"
            style={{ background: '#222233' }}
          />
          <div
            className="w-4 h-1 -ml-2 rounded-full"
            style={{
              background: '#ffcc88',
              boxShadow: '0 4px 20px rgba(255,200,120,0.3)',
            }}
          />
        </div>
      ))}

      {/* ── Shared hero text overlay ──────────────────────────── */}
      <HeroContent />
    </section>
  )
}
