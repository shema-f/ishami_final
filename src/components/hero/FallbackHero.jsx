import { motion } from 'motion/react'
import HeroContent from './HeroContent'

/**
 * Fallback hero with Kigali city background and 3D iPhone mockup.
 * Used on mobile and low-end devices.
 */
export default function FallbackHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100dvh',
        background: '#0a0e14',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── Kigali Night City Background ────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src="/kigali.png"
          alt="Kigali City Night"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14]/95 via-[#0a0e14]/80 to-[#0a0e14]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-[#0a0e14]/50" />
      </div>

      {/* ── iPhone Mockup (Desktop/Tablet only, right side) ─────── */}
      <div className="hidden lg:flex absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, x: 80, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
          style={{ perspective: '1000px' }}
        >
          {/* iPhone Frame */}
          <div className="relative w-[280px] xl:w-[300px]">
            {/* Glow behind phone */}
            <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-purple-500/10 rounded-full blur-[60px]" />
            
            {/* Phone body */}
            <div className="relative bg-[#1a1a2e] rounded-[3rem] p-3 shadow-2xl shadow-black/50 border border-white/10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a2e] rounded-b-2xl z-10" />
              
              {/* Screen */}
              <div className="relative rounded-[2.3rem] overflow-hidden bg-[#080c18]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-1">
                  <span className="text-[10px] font-semibold text-white">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2.5 border border-white/60 rounded-sm relative">
                      <div className="absolute inset-0.5 bg-emerald-400 rounded-[1px]" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                {/* App Screen Content */}
                <div className="px-4 pb-6">
                  {/* App Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold block">Muraho!</span>
                      <span className="text-slate-400 text-[9px]">Moto-Sensei • Online</span>
                    </div>
                  </div>

                  {/* AI Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-xs font-bold block">Iga byihuse,</span>
                        <span className="text-blue-100 text-xs block">Kora Neza.</span>
                        <span className="text-blue-200 text-[9px] block mt-1">Witeguye gutangira?</span>
                        <button className="mt-2 px-3 py-1 bg-white/20 text-white text-[9px] font-semibold rounded-lg">
                          Tangira
                        </button>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-2xl">🧑🏿‍🏫</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Quiz Button */}
                  <div className="bg-emerald-500 rounded-xl p-3 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-sm">→</span>
                    </div>
                    <span className="text-white text-xs font-bold">Tangira Ikizami</span>
                  </div>

                  {/* Categories */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-[10px] font-semibold">Ibyiciro</span>
                      <span className="text-blue-400 text-[9px]">Reba byose</span>
                    </div>
                    <div className="flex gap-2">
                      {['🛑', '⚠️', '🅿️', '🔄'].map((emoji, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-xl p-2 text-center">
                          <span className="text-lg">{emoji}</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">
                            {['Stop', 'Warning', 'Parking', 'Round'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-[10px] font-semibold">Ibikunzwe cyane</span>
                      <span className="text-blue-400 text-[9px]">Reba byose</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { emoji: '🛑', title: 'STOP Sign', lessons: '12 amasomo' },
                        { emoji: '🔄', title: 'Roundabouts', lessons: '8 amasomo' },
                        { emoji: '⚠️', title: 'Give Way', lessons: '9 amasomo' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-xl p-2 overflow-hidden">
                          <div className="w-full h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-1.5">
                            <span className="text-xl">{item.emoji}</span>
                          </div>
                          <span className="text-[9px] text-white font-semibold block">{item.title}</span>
                          <span className="text-[8px] text-slate-400">{item.lessons}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="flex items-center justify-around mt-4 pt-3 border-t border-white/10">
                    {['🏠', '📖', '✅', '👤'].map((emoji, i) => (
                      <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                        <span className="text-sm">{emoji}</span>
                        <span className="text-[7px]">
                          {['Ahabanza', 'Kwiga', 'Ikizamini', 'Profile'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
              className="absolute -top-3 -right-3 bg-white rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-1"
            >
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-gray-900 text-xs font-bold">4.9</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Floating particles ────────────────────────────────── */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
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

      {/* ── Shared hero text overlay ──────────────────────────── */}
      <HeroContent />
    </section>
  )
}
