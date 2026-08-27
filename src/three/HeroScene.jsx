import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import CyberpunkCar from './CyberpunkCar'
import City from './City'
import CarTooltip from './CarTooltip'

// ─── Cinematic Camera ────────────────────────────────────────────

function CinematicCamera({ cameraState, hoverActive }) {
  const { camera } = useThree()
  const _lookAt = useRef(new THREE.Vector3())
  const _mouseOffset = useRef(new THREE.Vector3())
  const _hoverPush = useRef(0)
  const _baseFov = useRef(42)

  // ── Idle orbit state ───────────────────────────────────────
  const _lastInteraction = useRef(Date.now())
  const _orbitAngle = useRef(0)
  const _orbitActive = useRef(0) // smooth 0→1 ramp
  const _scrollActive = useRef(false)

  const markInteraction = useCallback(() => {
    _lastInteraction.current = Date.now()
  }, [])

  const handleMouseMove = useCallback((e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = -(e.clientY / window.innerHeight) * 2 + 1
    _mouseOffset.current.set(nx * 0.4, ny * 0.2, 0)
    markInteraction()
  }, [markInteraction])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    // Also detect scroll to pause orbit
    const handleScroll = () => { _scrollActive.current = true; markInteraction() }
    const clearScroll = () => { setTimeout(() => { _scrollActive.current = false }, 200) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scrollend', clearScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', clearScroll)
    }
  }, [handleMouseMove, markInteraction])

  useFrame((state, delta) => {
    if (!cameraState.current) return
    const { pos, lookAt } = cameraState.current

    // Smooth hover push factor
    const hoverTarget = hoverActive.current ? 1 : 0
    _hoverPush.current += (hoverTarget - _hoverPush.current) * 0.04
    const hp = _hoverPush.current

    const pushZ = hp * -1.2
    const pushY = hp * -0.3

    // ── Idle orbit logic ──────────────────────────────────────
    const idleTime = (Date.now() - _lastInteraction.current) / 1000
    const shouldOrbit = idleTime > 3 && !_scrollActive.current
    const orbitTarget = shouldOrbit ? 1 : 0
    _orbitActive.current += (orbitTarget - _orbitActive.current) * 0.02

    // Slowly advance orbit angle when active
    if (_orbitActive.current > 0.01) {
      _orbitAngle.current += delta * 0.12 * _orbitActive.current // ~7°/s at full
    }

    const oa = _orbitActive.current
    const angle = _orbitAngle.current

    // Orbit radius matches the initial camera distance from car
    const orbitRadius = 6.5
    const orbitHeight = 2.5

    // Base position from GSAP keyframes
    let camX = pos[0]
    let camY = pos[1]
    let camZ = pos[2]

    // Blend in orbit offset
    if (oa > 0.01) {
      const orbitX = Math.sin(angle) * orbitRadius
      const orbitZ = Math.cos(angle) * orbitRadius
      // Blend between GSAP position and orbit position
      camX = THREE.MathUtils.lerp(camX, orbitX, oa * 0.3)
      camY = THREE.MathUtils.lerp(camY, orbitHeight, oa * 0.2)
      camZ = THREE.MathUtils.lerp(camZ, orbitZ, oa * 0.3)
    }

    const target = new THREE.Vector3(
      camX + _mouseOffset.current.x * (1 - oa * 0.7),
      camY + _mouseOffset.current.y * (1 - oa * 0.7) + pushY,
      camZ + pushZ * (1 - oa * 0.5)
    )

    camera.position.lerp(target, 0.06)

    // Dynamic FOV: widen during aerial phases (camera high up = aerial)
    const isAerial = pos[1] > 12
    const targetFov = isAerial ? 65 : 42
    _baseFov.current += (targetFov - _baseFov.current) * 0.04
    camera.fov = _baseFov.current
    camera.updateProjectionMatrix()

    // Look-at always targets the car center
    const lookAtTarget = new THREE.Vector3(
      lookAt[0],
      lookAt[1] + hp * 0.1,
      lookAt[2] + hp * 0.5
    )
    _lookAt.current.copy(lookAtTarget)
    camera.lookAt(_lookAt.current)
  })

  return null
}

// ─── Floating HUD Labels ─────────────────────────────────────────

function FloatingLabel({ position, text, delay = 0 }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + delay * 0.001) * 0.1
      ref.current.lookAt(state.camera.position)
    }
  })

  if (!visible) return null

  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[2.2, 0.4]} />
        <meshStandardMaterial
          color="#0a1122"
          transparent
          opacity={0.85}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[2.25, 0.45]} />
        <meshStandardMaterial
          color="#003366"
          emissive="#004488"
          emissiveIntensity={0.15}
          transparent
          opacity={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}

// ─── Lighting ────────────────────────────────────────────────────

function SceneLighting({ ambientRef }) {
  const ambientLightRef = useRef()

  useFrame(() => {
    if (ambientRef?.current && ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientRef.current.intensity
    }
  })

  return (
    <>
      {/* Ambient — lower so painted textures show through */}
      <ambientLight ref={ambientLightRef} color="#4a5a7a" intensity={0.3} />

      {/* Key light — main directional, wider shadow for full city */}
      <directionalLight
        position={[8, 12, 8]}
        color="#aabbdd"
        intensity={1.6}
        castShadow
        shadow-mapSize={[256, 256]}
        shadow-camera-far={60}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {/* Fill + rim — no shadow, just light */}
      <directionalLight position={[-5, 6, 2]} color="#7799cc" intensity={1.0} />

      {/* Hemisphere — cheap ambient fill */}
      <hemisphereLight skyColor="#5a6a8a" groundColor="#1a1a22" intensity={0.6} />
    </>
  )
}

// ─── Fog ─────────────────────────────────────────────────────────

function SceneFog({ fogState }) {
  const fogRef = useRef()

  useFrame(() => {
    if (fogState?.current && fogRef.current) {
      fogRef.current.near = fogState.current.near
      fogRef.current.far = fogState.current.far
    }
  })

  return <fog ref={fogRef} attach="fog" args={['#0a0e14', 20, 80]} />
}

// ─── Atmosphere ──────────────────────────────────────────────────

function AtmosphericEffects() {
  // Lightweight — just a few subtle particles
  return null
}

// ─── Car Headlights (point lights attached to scene) ─────────────

function CarHeadlights({ hoverActive }) {
  const leftRef = useRef()
  const rightRef = useRef()
  const hp = useRef(0)

  useFrame((state) => {
    const target = hoverActive.current ? 1 : 0
    hp.current += (target - hp.current) * 0.04
    const t = state.clock.getElapsedTime()
    const base = 4.0 + Math.sin(t * 3) * 0.2

    if (leftRef.current) leftRef.current.intensity = base + hp.current * 2
    if (rightRef.current) rightRef.current.intensity = base + hp.current * 2
  })

  return (
    <group scale={[1.8, 1.8, 1.8]}>
      {/* Headlights — bright, pointing forward and down onto road */}
      <pointLight
        ref={leftRef}
        position={[0.65, 0.15, 2.8]}
        color="#fff8e0"
        intensity={4.0}
        distance={15}
        decay={1.5}
      />
      <pointLight
        ref={rightRef}
        position={[-0.65, 0.15, 2.8]}
        color="#fff8e0"
        intensity={4.0}
        distance={15}
        decay={1.5}
      />
      {/* Central headlight beam — broad wash on the road ahead */}
      <pointLight
        position={[0, 0.05, 3.5]}
        color="#fff5d0"
        intensity={3.0}
        distance={10}
        decay={1.5}
      />
      {/* Taillights — brighter red glow */}
      <pointLight position={[0.7, 0.2, -2.5]} color="#ff2222" intensity={1.0} distance={8} decay={2} />
      <pointLight position={[-0.7, 0.2, -2.5]} color="#ff2222" intensity={1.0} distance={8} decay={2} />
    </group>
  )
}

// ─── Clickable Car Wrapper ───────────────────────────────────────

function InteractiveCar({ carRef, hoverActive, onNavigate }) {
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    hoverActive.current = true
    document.body.style.cursor = 'pointer'
  }, [hoverActive])

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation()
    setHovered(false)
    hoverActive.current = false
    document.body.style.cursor = 'auto'
  }, [hoverActive])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (onNavigate) onNavigate()
  }, [onNavigate])

  return (
    <group
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Car placed on the road: y=0.7 lifts tires to road surface (model bottom ~0.69 below center) */}
      {/* Slight Y rotation gives a dynamic three-quarter angle view */}
      <CyberpunkCar
        ref={carRef}
        position={[0, 0.7, 0]}
        rotation={[0, -0.15, 0]}
        scale={1.8}
        isHovered={hovered}
      />
      <CarHeadlights hoverActive={hoverActive} />
      <CarTooltip visible={hovered} position={[0, 4.0, 0]} />
    </group>
  )
}

// ─── Scene Root ──────────────────────────────────────────────────

function SceneContents({ cameraState, carRef, fogState, ambientRef, hoverActive }) {
  return (
    <>
      <SceneFog fogState={fogState} />
      <SceneLighting ambientRef={ambientRef} />
      <AtmosphericEffects />

      <CinematicCamera cameraState={cameraState} hoverActive={hoverActive} />

      <InteractiveCar
        carRef={carRef}
        hoverActive={hoverActive}
        onNavigate={() => {
          const el = document.getElementById('simulation')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <City />

      {/* City environment — provides reflections on car body */}
      <Environment preset="city" background={false} />
    </>
  )
}

// ─── Exported Canvas wrapper ─────────────────────────────────────

export default function HeroScene({ cameraState, carRef, fogState, ambientRef }) {
  const hoverActive = useRef(false)

  return (
    <Canvas
      shadows={{ type: THREE.BasicShadowMap }}
      camera={{ position: [5, 2.2, 6], fov: 42, near: 0.1, far: 150 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        powerPreference: 'default',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      dpr={[1, 1]}
      style={{
        background: 'linear-gradient(180deg, #0a0e14 0%, #1a1a2e 50%, #0a0e14 100%)',
      }}
    >
      <Suspense fallback={null}>
        <SceneContents
          cameraState={cameraState}
          carRef={carRef}
          fogState={fogState}
          ambientRef={ambientRef}
          hoverActive={hoverActive}
        />
      </Suspense>
    </Canvas>
  )
}
