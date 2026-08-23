import { motion } from 'motion/react'
import { Link } from 'react-router'
import { ArrowRight, Car, Sparkles } from 'lucide-react'

export default function HeroContent() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center lg:text-left pointer-events-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm text-blue-400 font-medium">Learn Traffic Rules Smarter</span>
            </motion.div>

            {/* Heading — scales from 2xl to 6xl across breakpoints */}
            <div className="mb-3 sm:mb-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-[1.65rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-[family-name:var(--font-heading)] leading-[1.05]"
              >
                PASS YOUR
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-[1.65rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-[family-name:var(--font-heading)] leading-[1.05]"
              >
                RWANDA DRIVING
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="text-[1.65rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-[family-name:var(--font-heading)] leading-[1.05]"
              >
                TEST WITH
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-[1.65rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-0.5 sm:mt-1"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 font-[family-name:var(--font-heading)] leading-[1.05] inline-block"
                  style={{
                    textShadow: '0 0 40px rgba(0, 136, 255, 0.3)',
                    filter: 'drop-shadow(0 0 20px rgba(0, 136, 255, 0.2))'
                  }}
                >
                  CONFIDENCE
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="text-xs sm:text-sm md:text-base text-slate-400 mb-4 sm:mb-5 max-w-sm sm:max-w-md mx-auto lg:mx-0 leading-relaxed backdrop-blur-sm bg-black/30 p-2.5 sm:p-3 rounded-xl border border-white/5"
            >
              Master Rwanda traffic rules through interactive learning, AI assistance, quizzes, and realistic 3D driving simulations.
            </motion.p>

            {/* Buttons — full-width on mobile, inline on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/quiz"
                className="group w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl sm:rounded-[14px] font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Start Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/simulation"
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl text-slate-200 rounded-xl sm:rounded-[14px] font-semibold text-sm sm:text-base border border-white/20 hover:bg-white/15 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4 shrink-0" />
                Explore 3D Simulation
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side — empty, 3D car shows here via Canvas */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator — with safe-area padding for notched phones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-blue-400"
          />
        </motion.div>
        <span className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider uppercase">Scroll to explore</span>
      </motion.div>

      {/* Bottom gradient fade — taller on mobile to clear browser UI */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 'clamp(3rem, 8vh, 6rem)',
          background: 'linear-gradient(to top, #0a0e14, transparent)',
        }}
      />
    </div>
  )
}
