import { useState, lazy, Suspense } from 'react'
import useDeviceCapability from '../../hooks/useDeviceCapability'
import FallbackHero from './FallbackHero'

// Lazy-load the scene bundle
const HeroSceneBundle = lazy(() => import('./HeroSceneBundle'))

function HeroLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-[#0a0e14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl overflow-hidden ring-2 ring-white/15 shadow-xl shadow-blue-500/20">
            <img
              src="/apple-touch-icon.png"
              alt="ISHAMI"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -inset-2 border-2 border-blue-500/20 rounded-[1rem]" />
          <div className="absolute -inset-2 border-2 border-transparent border-t-blue-500 rounded-[1rem] animate-spin" />
        </div>
        <div className="text-center">
          <span className="text-white text-lg font-bold tracking-wider block font-[family-name:var(--font-heading)]">
            ISHAMI
          </span>
          <span className="text-slate-400 text-xs tracking-wider mt-1 block">
            Loading...
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CinematicHero() {
  const { isLoading, is3DCapable } = useDeviceCapability()

  if (isLoading) {
    return (
      <section className="relative" style={{ height: '100dvh' }}>
        <HeroLoader />
      </section>
    )
  }

  // Both 3D capable and non-capable devices get the same simplified hero
  // with Kigali background and iPhone mockup
  return (
    <section className="relative" style={{ height: '100dvh', minHeight: '600px' }}>
      <Suspense fallback={<HeroLoader />}>
        <HeroSceneBundle />
      </Suspense>
    </section>
  )
}
