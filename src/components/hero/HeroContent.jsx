import { motion } from 'motion/react'
import { Link } from 'react-router'
import { ArrowRight, Play, CheckCircle, Users, Shield, Star } from 'lucide-react'
import { useTranslation } from '../../contexts/I18nContext'

export default function HeroContent() {
  const { t, lang } = useTranslation()
  const isRw = lang === 'rw'

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center w-full pt-16 lg:pt-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center lg:text-left pointer-events-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                {isRw ? "Rwanda's #1 AI Driving Instructor" : "Rwanda's #1 AI Driving Instructor"}
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="mb-4 sm:mb-6">
              {isRw ? (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-heading)] leading-[1.1]"
                  >
                    Kora Rimwe,
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-1 font-[family-name:var(--font-heading)] leading-[1.1]"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                      Utsinde.
                    </span>
                  </motion.h1>
                </>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-heading)] leading-[1.1]"
                  >
                    Pass Once,
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-1 font-[family-name:var(--font-heading)] leading-[1.1]"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                      Pass Well.
                    </span>
                  </motion.h1>
                </>
              )}
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              {isRw
                ? "Igisha amategeko y'umuhanda mu Rwanda mu buryo bworoshye kandi butangaje. Wige, kora ibizamini, kandi uba umwunganizi w'umushoferi wizewe."
                : "Master Rwanda traffic rules the easy and fun way. Learn, practice quizzes, and become a confident driving instructor."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10"
            >
              <Link
                to="/quiz"
                className="group px-7 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                {isRw ? 'Tangura Kwiga Ubufree' : 'Start Learning Free'}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/ai-assistant"
                className="px-7 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base border border-white/20 hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                {isRw ? 'Reba Moto Sensei AI' : 'Try Moto Sensei AI'}
              </Link>
            </motion.div>

            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-8 sm:mb-10"
            >
              {[
                { icon: '🤖', label_en: 'AI Instructor', label_rw: 'AI Instructor', sub_en: 'Moto-Sensei', sub_rw: 'Moto-Sensei' },
                { icon: '🏎️', label_en: '3D Simulation', label_rw: '3D Simulation', sub_en: 'Practice safely', sub_rw: 'Jya inama neza' },
                { icon: '📋', label_en: 'Quizzes', label_rw: 'Ibizamini', sub_en: 'Proven & trusted', sub_rw: 'Byemejwe' },
                { icon: '🏆', label_en: 'Certificate', label_rw: 'Icyemezo', sub_en: 'Official ISHAMI', sub_rw: 'ISHAMI yo mu karubanda' },
              ].map((tag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl">{tag.icon}</span>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-white block">{isRw ? tag.label_rw : tag.label_en}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400">{isRw ? tag.sub_rw : tag.sub_en}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side — 3D iPhone mockup (handled by HeroSceneBundle) */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Bottom Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-20 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left badge - Verified by Rwanda Police */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  {isRw ? 'Ibyemejwe na Polisi y\'u Rwanda' : 'Verified by Rwanda Police'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isRw ? 'Amategeko 2023' : 'Traffic Rules 2023'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center ml-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>

            {/* Right badge - Users */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} flex items-center justify-center border-2 border-[#0a0e14]`}>
                    <Users className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">5K+</span>
                <span className="text-[10px] text-slate-400">{isRw ? 'Abiga natwe' : 'Active learners'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-emerald-400"
          />
        </motion.div>
        <span className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider uppercase">
          {isRw ? 'Kanda hasi' : 'Scroll'}
        </span>
      </motion.div>
    </div>
  )
}
