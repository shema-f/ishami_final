import { motion } from 'motion/react'
import { useTranslation } from '../../contexts/I18nContext'

/**
 * Lightweight CSS 3D iPhone mockup — no GLB needed.
 * Fast loading, looks great, and shows the app preview.
 */
export default function IPhoneScene() {
  const { lang } = useTranslation()
  
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Glow behind phone */}
      <div className="absolute w-80 h-80 bg-gradient-to-br from-emerald-500/15 via-blue-500/10 to-purple-500/10 rounded-full blur-[80px]" />
      
      {/* iPhone Container with 3D perspective */}
      <motion.div
        initial={{ opacity: 0, x: 80, rotateY: -15 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          rotateY: 0,
          y: [0, -8, 0]
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5 },
          x: { duration: 1, delay: 0.5 },
          rotateY: { duration: 1.2, delay: 0.5 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
        }}
        className="relative"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Phone Frame */}
        <div 
          className="relative w-[240px] sm:w-[270px] xl:w-[300px]"
          style={{ 
            transform: 'rotateY(-5deg) rotateX(2deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Shadow on ground */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-6 bg-black/30 rounded-full blur-xl" />
          
          {/* Phone body */}
          <div className="relative bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2e] rounded-[2.8rem] p-[10px] shadow-2xl shadow-black/60 border border-white/10">
            {/* Side buttons */}
            <div className="absolute -right-[3px] top-[80px] w-[3px] h-10 bg-[#3a3a4e] rounded-r" />
            <div className="absolute -right-[3px] top-[110px] w-[3px] h-14 bg-[#3a3a4e] rounded-r" />
            <div className="absolute -left-[3px] top-[90px] w-[3px] h-6 bg-[#3a3a4e] rounded-l" />
            
            {/* Screen */}
            <div className="relative rounded-[2.2rem] overflow-hidden bg-[#080c18]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a2e] rounded-full z-20" />
              
              {/* Status Bar */}
              <div className="relative flex items-center justify-between px-5 pt-3 pb-1 z-10">
                <span className="text-[9px] font-semibold text-white">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-2 border border-white/50 rounded-[2px] relative">
                    <div className="absolute inset-[1px] bg-emerald-400 rounded-[1px]" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
              
              {/* App Content */}
              <div className="px-3 pb-4">
                {/* App Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">MS</span>
                    </div>
                    <div>
                      <span className="text-white text-[9px] font-bold block leading-tight">Muraho!</span>
                      <span className="text-slate-400 text-[7px] leading-tight">Moto-Sensei</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="text-[8px]">🔍</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center relative">
                      <span className="text-[8px]">🔔</span>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* AI Welcome Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 mb-2 shadow-lg shadow-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-white text-[10px] font-bold block leading-tight">Iga byihuse,</span>
                      <span className="text-blue-100 text-[10px] font-bold block leading-tight">Kora Neza.</span>
                      <span className="text-blue-200 text-[8px] block mt-0.5">Witeguye gutangira?</span>
                      <button className="mt-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur text-white text-[8px] font-semibold rounded-md">
                        Tangira
                      </button>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ml-1">
                      <span className="text-xl">🧑🏿‍🏫</span>
                    </div>
                  </div>
                </div>

                {/* Start Quiz */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-2.5 mb-2 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <span className="text-white text-[10px] font-bold">Tangira Ikizami</span>
                </div>

                {/* Categories */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-[9px] font-semibold">Ibyiciro</span>
                    <span className="text-blue-400 text-[7px]">Reba byose →</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { emoji: '🛑', label: 'Byose' },
                      { emoji: '⚠️', label: 'Ibimenyetso' },
                      { emoji: '🅿️', label: 'Ibikoresho' },
                    ].map((cat, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-lg p-1.5 text-center border border-white/5">
                        <span className="text-sm">{cat.emoji}</span>
                        <span className="text-[7px] text-slate-400 block mt-0.5">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-[9px] font-semibold">Ibikunzwe cyane</span>
                    <span className="text-blue-400 text-[7px]">Reba byose →</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { emoji: '🛑', title: 'STOP', count: '12' },
                      { emoji: '🔄', title: 'Rond-point', count: '8' },
                      { emoji: '⚠️', title: 'Give Way', count: '9' },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-lg overflow-hidden border border-white/5">
                        <div className="h-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                          <span className="text-sm">{item.emoji}</span>
                        </div>
                        <div className="p-1">
                          <span className="text-[8px] text-white font-semibold block leading-tight">{item.title}</span>
                          <span className="text-[7px] text-slate-400">{item.count} amasomo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="flex items-center justify-around mt-3 pt-2 border-t border-white/10">
                  {[
                    { emoji: '🏠', label: 'Ahabanza', active: true },
                    { emoji: '📖', label: 'Kwiga', active: false },
                    { emoji: '✅', label: 'Ikizamini', active: false },
                    { emoji: '👤', label: 'Profile', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-blue-400' : 'text-slate-500'}`}>
                      <span className="text-xs">{item.emoji}</span>
                      <span className="text-[6px] font-medium">{item.label}</span>
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
            transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
            className="absolute -top-2 -right-2 bg-white rounded-xl px-2.5 py-1 shadow-lg flex items-center gap-0.5 z-30"
          >
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-gray-900 text-[11px] font-bold">4.9</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating AI response bubble */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute top-1/3 -left-8 xl:left-4"
      >
        <div className="bg-[#0d1225]/90 backdrop-blur-xl rounded-2xl rounded-bl-sm p-3 border border-white/10 shadow-xl max-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white text-[6px] font-bold">M</span>
            </div>
            <span className="text-[8px] text-slate-400 font-medium">Moto-Sensei</span>
          </div>
          <p className="text-slate-200 text-[8px] leading-relaxed">
            {lang === 'rw' 
              ? "Muraho! Ndi Moto-Sensei. Ukwiye gufasha iki ku mategeko y'umuhanda?" 
              : "Hi! I'm Moto-Sensei. What would you like to learn about traffic rules?"}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
