import { useEffect, Suspense } from 'react'
import HeroContent from './HeroContent'
import IPhoneScene from './IPhoneScene'

/**
 * Hero scene bundle with Kigali city background and 3D iPhone model.
 */
export default function HeroSceneBundle({ onReady }) {
  useEffect(() => {
    onReady?.()
  }, [onReady])

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Kigali City Background */}
      <div className="absolute inset-0">
        <img
          src="/kigali.png"
          alt="Kigali City Night"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14]/95 via-[#0a0e14]/70 to-[#0a0e14]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-[#0a0e14]/60" />
      </div>

      {/* 3D iPhone Scene */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        }>
          <IPhoneScene />
        </Suspense>
      </div>

      {/* Hero Text Content */}
      <HeroContent />
    </section>
  )
}
