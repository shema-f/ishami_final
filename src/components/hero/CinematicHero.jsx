import { useRef, useEffect, useState, lazy, Suspense } from 'react'
import useDeviceCapability from '../../hooks/useDeviceCapability'
import FallbackHero from './FallbackHero'

// ── Lazy-load the heavy 3D scene ────────────────────────────────
const HeroSceneBundle = lazy(() => import('./HeroSceneBundle'))

// ── Lightweight loading spinner ──────────────────────────────────
function HeroLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-[#0a0e14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* ISHAMI Logo / Favicon with pulse animation */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl overflow-hidden ring-2 ring-white/15 shadow-xl shadow-blue-500/20">
            <img
              src="/apple-touch-icon.png"
              alt="ISHAMI"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Spinning ring around the logo */}
          <div className="absolute -inset-2 border-2 border-blue-500/20 rounded-[1rem]" />
          <div className="absolute -inset-2 border-2 border-transparent border-t-blue-500 rounded-[1rem] animate-spin" />
        </div>
        <div className="text-center">
          <span className="text-white text-lg font-bold tracking-wider block font-[family-name:var(--font-heading)]">
            ISHAMI
          </span>
          <span className="text-slate-400 text-xs tracking-wider mt-1 block">
            Loading 3D Experience...
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main exported component ──────────────────────────────────────

export default function CinematicHero() {
  const { isLoading, is3DCapable } = useDeviceCapability()

  if (isLoading) {
    return (
      <section className="relative" style={{ height: '100dvh' }}>
        <HeroLoader />
      </section>
    )
  }

  if (!is3DCapable) {
    return <FallbackHero />
  }

  return <Hero3DWrapper />
}

// ── 3D wrapper ──────────────────────────────────────────────────

function Hero3DWrapper() {
  const heroRef = useRef(null)
  const stickyRef = useRef(null)
  const fadeRef = useRef(null)

  // Shared refs — CinematicHero owns them, passes them to the lazy bundle
  const cameraState = useRef({ pos: [5, 2.2, 6], lookAt: [0, 0.5, 0.5] })
  const fogState = useRef({ near: 15, far: 50 })
  const ambientRef = useRef({ intensity: 0.5 })
  const carRef = useRef(null)

  // ── Dynamic import of GSAP ──────────────────────────────────
  const [gsapCtx, setGsapCtx] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [gsapMod, stMod, kfMod, interpMod] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('../../animations/heroKeyframes'),
        import('../../animations/interpolate'),
      ])
      if (cancelled) return
      gsapMod.default.registerPlugin(stMod.ScrollTrigger)
      setGsapCtx({
        gsap: gsapMod.default,
        ScrollTrigger: stMod.ScrollTrigger,
        keyframes: kfMod,
        interpolate: interpMod.interpolateKeyframes,
      })
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ── GSAP ScrollTrigger ──────────────────────────────────────
  useEffect(() => {
    if (!gsapCtx || !heroRef.current) return

    const { gsap, ScrollTrigger, keyframes, interpolate } = gsapCtx
    const { cameraKeyframes, carKeyframes, fogKeyframes, ambientKeyframes } = keyframes

    const camMarkers = [0, 0.12, 0.30, 0.45, 0.55, 0.65, 0.82, 0.92, 1.0]
    const carMarkers = [0, 0.45, 0.50, 0.55, 0.65, 0.82, 1.0]
    const fogMarkers = [0, 0.45, 0.65, 0.82, 1.0]
    const ambMarkers = [0, 0.45, 0.65, 0.82, 1.0]

    const proxy = { progress: 0 }

    const tl = gsap.to(proxy, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        pin: stickyRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const p = proxy.progress

        // Camera
        const cam = interpolate(cameraKeyframes, p, camMarkers)
        cameraState.current = { pos: cam.pos, lookAt: cam.lookAt }

        // Car
        const car = interpolate(carKeyframes, p, carMarkers)
        if (carRef.current) {
          carRef.current.position.set(car.pos[0], car.pos[1], car.pos[2])
          carRef.current.rotation.y = car.rotY
        }

        // Fog
        const fog = interpolate(fogKeyframes, p, fogMarkers)
        fogState.current = { near: fog.near, far: fog.far }

        // Ambient
        const amb = interpolate(ambientKeyframes, p, ambMarkers)
        ambientRef.current = { intensity: amb.intensity }

        // Fade overlay (appears in last 20% of scroll)
        if (fadeRef.current) {
          const fadeProgress = Math.max(0, (p - 0.8) / 0.2) // 0→1 in last 20%
          fadeRef.current.style.opacity = fadeProgress
        }
      },
    })

    return () => {
      tl.kill()
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(st => st.kill())
      }
    }
  }, [gsapCtx])

  return (
    <section
      ref={heroRef}
      className="relative"
      style={{ height: '300vh' }}
    >
      {/* Sticky inner: pinned at top, fills viewport while scrolling */}
      <div
        ref={stickyRef}
        className="relative w-full"
        style={{ height: '100dvh' }}
      >
        <div className="absolute inset-0">
          <Suspense fallback={<HeroLoader />}>
            <HeroSceneBundle
              cameraState={cameraState}
              carRef={carRef}
              fogState={fogState}
              ambientRef={ambientRef}
            />
          </Suspense>
        </div>

        {/* Top gradient for navbar readability */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0e14]/80 to-transparent pointer-events-none z-10" />

        {/* Fade-out overlay at end of scroll */}
        <div
          ref={fadeRef}
          className="absolute inset-0 bg-[#0a0e14] pointer-events-none z-20"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  )
}
