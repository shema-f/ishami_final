import { useEffect } from 'react'
import HeroScene from '../../three/HeroScene'
import HeroContent from './HeroContent'

/**
 * Lazy-loadable bundle that wraps the heavy 3D HeroScene.
 * Receives pre-owned refs from CinematicHero and forwards them.
 */
export default function HeroSceneBundle({ cameraState, carRef, fogState, ambientRef, onReady }) {
  useEffect(() => {
    // Signal that the 3D canvas has mounted
    onReady?.()
  }, [onReady])

  return (
    <>
      <HeroScene
        cameraState={cameraState}
        carRef={carRef}
        fogState={fogState}
        ambientRef={ambientRef}
      />
      <HeroContent />
    </>
  )
}
