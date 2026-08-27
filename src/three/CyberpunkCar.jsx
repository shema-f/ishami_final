import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CyberpunkCar = forwardRef(function CyberpunkCar({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, isHovered = false }, ref) {
  useImperativeHandle(ref, () => groupRef.current, [])

  const groupRef = useRef()
  const headlightsRef = useRef([])
  const taillightsRef = useRef([])
  const wheelRefs = useRef([])
  const underglowRef = useRef()
  const accentMatsRef = useRef([])
  const headlightMeshMatsRef = useRef([])

  const bodyColor = useMemo(() => new THREE.Color('#0a0a0f'), [])
  const accentBlue = useMemo(() => new THREE.Color('#0088ff'), [])
  const accentCyan = useMemo(() => new THREE.Color('#00d4ff'), [])
  const headlightColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const taillightColor = useMemo(() => new THREE.Color('#ff1a1a'), [])
  const glassColor = useMemo(() => new THREE.Color('#112233'), [])
  const rimColor = useMemo(() => new THREE.Color('#222233'), [])

  // Smooth hover factor (lerps toward 0 or 1 each frame)
  const hoverFactor = useRef(0)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const dt = Math.min(state.clock.getDelta(), 0.05)

    // Smooth hover interpolation
    const target = isHovered ? 1 : 0
    hoverFactor.current += (target - hoverFactor.current) * (1 - Math.exp(-8 * dt))
    const hf = hoverFactor.current

    // Subtle idle suspension
    if (groupRef.current) {
      const baseY = position[1] + Math.sin(t * 1.5) * 0.003
      // Tiny lift on hover
      groupRef.current.position.y = baseY + hf * 0.04
      // Subtle scale pulse
      const pulse = scale + hf * 0.015 * scale + Math.sin(t * 2) * hf * 0.005 * scale
      groupRef.current.scale.setScalar(pulse)
    }

    // Wheel rotation
    wheelRefs.current.forEach(wheel => {
      if (wheel) wheel.rotation.z -= 0.02
    })

    // Headlight intensity: idle flicker + hover boost
    headlightsRef.current.forEach(light => {
      if (light) {
        const idle = 3 + Math.sin(t * 4) * 0.3
        light.intensity = idle + hf * 6  // 3→9 on hover
      }
    })

    // Headlight mesh emissive boost
    headlightMeshMatsRef.current.forEach(mat => {
      if (mat) {
        mat.emissiveIntensity = 2 + hf * 4  // 2→6 on hover
      }
    })

    // Accent line emissive boost
    accentMatsRef.current.forEach(mat => {
      if (mat) {
        mat.emissiveIntensity = 0.8 + hf * 1.5  // 0.8→2.3 on hover
      }
    })

    // Underglow intensity boost
    if (underglowRef.current) {
      underglowRef.current.intensity = 0.5 + hf * 1.5  // 0.5→2.0 on hover
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main Body - lower */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 4.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Body - upper cabin */}
      <mesh position={[0, 0.75, -0.3]} castShadow>
        <boxGeometry args={[1.9, 0.5, 2.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Hood slope */}
      <mesh position={[0, 0.55, 1.2]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.15, 1.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 0.55, -1.5]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.15, 1.2]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.02, -0.3]} castShadow>
        <boxGeometry args={[1.8, 0.08, 2.0]} />
        <meshStandardMaterial color={bodyColor} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.82, 0.7]} rotation={[0.45, 0, 0]}>
        <planeGeometry args={[1.7, 0.7]} />
        <meshPhysicalMaterial
          color={glassColor}
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.6}
          transmission={0.4}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.82, -1.4]} rotation={[-0.4, 0, 0]}>
        <planeGeometry args={[1.6, 0.6]} />
        <meshPhysicalMaterial
          color={glassColor}
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.6}
          transmission={0.4}
        />
      </mesh>

      {/* Side windows */}
      <mesh position={[0.96, 0.78, -0.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.0, 0.4]} />
        <meshPhysicalMaterial color={glassColor} transparent opacity={0.5} metalness={0.1} roughness={0.05} />
      </mesh>
      <mesh position={[-0.96, 0.78, -0.3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.0, 0.4]} />
        <meshPhysicalMaterial color={glassColor} transparent opacity={0.5} metalness={0.1} roughness={0.05} />
      </mesh>

      {/* Blue accent line - side */}
      <mesh position={[1.11, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.06, 4.2]} />
        <meshStandardMaterial
          ref={el => { if (el) accentMatsRef.current[0] = el }}
          color={accentBlue}
          emissive={accentBlue}
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[-1.11, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.06, 4.2]} />
        <meshStandardMaterial
          ref={el => { if (el) accentMatsRef.current[1] = el }}
          color={accentBlue}
          emissive={accentBlue}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Blue accent line - front */}
      <mesh position={[0, 0.35, 2.26]}>
        <boxGeometry args={[1.8, 0.04, 0.02]} />
        <meshStandardMaterial
          ref={el => { if (el) accentMatsRef.current[2] = el }}
          color={accentCyan}
          emissive={accentCyan}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Blue accent line - rear */}
      <mesh position={[0, 0.38, -2.26]}>
        <boxGeometry args={[1.6, 0.04, 0.02]} />
        <meshStandardMaterial
          ref={el => { if (el) accentMatsRef.current[3] = el }}
          color={accentCyan}
          emissive={accentCyan}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Headlights (meshes with boosted emissive) */}
      <mesh position={[0.7, 0.42, 2.26]}>
        <boxGeometry args={[0.35, 0.12, 0.05]} />
        <meshStandardMaterial
          ref={el => { if (el) headlightMeshMatsRef.current[0] = el }}
          color={headlightColor}
          emissive={headlightColor}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.7, 0.42, 2.26]}>
        <boxGeometry args={[0.35, 0.12, 0.05]} />
        <meshStandardMaterial
          ref={el => { if (el) headlightMeshMatsRef.current[1] = el }}
          color={headlightColor}
          emissive={headlightColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Headlight point lights */}
      <pointLight
        ref={el => { if (el) headlightsRef.current[0] = el }}
        position={[0.7, 0.42, 2.5]}
        color={headlightColor}
        intensity={3}
        distance={15}
        decay={2}
      />
      <pointLight
        ref={el => { if (el) headlightsRef.current[1] = el }}
        position={[-0.7, 0.42, 2.5]}
        color={headlightColor}
        intensity={3}
        distance={15}
        decay={2}
      />

      {/* Taillights */}
      <mesh position={[0.75, 0.42, -2.26]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color={taillightColor} emissive={taillightColor} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.75, 0.42, -2.26]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color={taillightColor} emissive={taillightColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Taillight glow */}
      <pointLight
        ref={el => { if (el) taillightsRef.current[0] = el }}
        position={[0.75, 0.42, -2.5]}
        color={taillightColor}
        intensity={1}
        distance={8}
        decay={2}
      />
      <pointLight
        ref={el => { if (el) taillightsRef.current[1] = el }}
        position={[-0.75, 0.42, -2.5]}
        color={taillightColor}
        intensity={1}
        distance={8}
        decay={2}
      />

      {/* Wheels */}
      {[
        [0.95, 0.15, 1.4],
        [-0.95, 0.15, 1.4],
        [0.95, 0.15, -1.3],
        [-0.95, 0.15, -1.3]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh ref={el => { if (el) wheelRefs.current[i] = el }} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.08, 8, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
            <meshStandardMaterial color={rimColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 12]} />
            <meshStandardMaterial
              color={accentBlue}
              emissive={accentBlue}
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Underglow — driven by hoverFactor */}
      <rectAreaLight
        ref={underglowRef}
        position={[0, 0.05, 0]}
        width={2.0}
        height={4.0}
        color={accentBlue}
        intensity={0.5}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* ISHAMI license plate - rear */}
      <mesh position={[0, 0.3, -2.27]}>
        <boxGeometry args={[0.5, 0.15, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.3, -2.28]}>
        <boxGeometry args={[0.45, 0.03, 0.005]} />
        <meshStandardMaterial color={accentBlue} emissive={accentBlue} emissiveIntensity={0.5} />
      </mesh>

      {/* Front grille accent */}
      <mesh position={[0, 0.28, 2.26]}>
        <boxGeometry args={[1.2, 0.08, 0.02]} />
        <meshStandardMaterial color="#111122" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Side mirrors */}
      <mesh position={[1.15, 0.7, 0.5]}>
        <boxGeometry args={[0.12, 0.08, 0.15]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[-1.15, 0.7, 0.5]}>
        <boxGeometry args={[0.12, 0.08, 0.15]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  )
})

export default CyberpunkCar
