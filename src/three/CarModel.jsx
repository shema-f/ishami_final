import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Center, Text } from '@react-three/drei'
import * as THREE from 'three'

// Preload the GLB
const gltfCache = {}

function useCachedGLTF(path) {
  const [gltf, setGltf] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (gltfCache[path]) {
      setGltf(gltfCache[path])
      setLoading(false)
      return
    }
    const loader = new GLTFLoader()
    loader.load(
      path,
      (g) => {
        gltfCache[path] = g
        setGltf(g)
        setLoading(false)
      },
      undefined,
      (err) => {
        console.error('Failed to load GLB:', path, err)
        setLoading(false)
      }
    )
  }, [path])

  return { gltf, loading }
}

// Rwanda flag colors
const RWANDA_COLORS = {
  blue: new THREE.Color('#00A1DE'),
  yellow: new THREE.Color('#FAD201'),
  green: new THREE.Color('#20603D'),
}

const CarModel = forwardRef(function CarModel({ position = [0, 0.7, 0], rotation = [0, 0, 0], scale = 1, isHovered = false }, ref) {
  const groupRef = useRef()
  const { gltf, loading } = useCachedGLTF('/models/ISHAMI_CAR.glb')

  // Expose the group ref
  useImperativeHandle(ref, () => groupRef.current, [])

  // Smooth hover factor
  const hoverFactor = useRef(0)
  const emissiveMats = useRef([])

  // Collect emissive materials on first render
  const collectedMats = useRef(false)

  useEffect(() => {
    if (!gltf || collectedMats.current) return
    collectedMats.current = true

    // Load the GLB as-is — reduce env reflections so painted textures show through
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        // Reduce environment reflections so the car's painted colors are visible
        child.material.envMapIntensity = 0.4
        child.material.needsUpdate = true

        // Collect emissive-capable materials for hover glow boost
        if (child.material.emissiveIntensity > 0) {
          emissiveMats.current.push({
            mat: child.material,
            baseEmissive: child.material.emissiveIntensity,
          })
        }
      }
    })
  }, [gltf])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const dt = Math.min(state.clock.getDelta(), 0.05)

    // Smooth hover
    const target = isHovered ? 1 : 0
    hoverFactor.current += (target - hoverFactor.current) * (1 - Math.exp(-8 * dt))
    const hf = hoverFactor.current

    if (groupRef.current) {
      // Subtle idle suspension (tiny bounce)
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.005 + hf * 0.05

      // Subtle scale pulse on hover
      const baseScale = scale
      const pulse = baseScale + hf * 0.015 + Math.sin(t * 2) * hf * 0.005
      groupRef.current.scale.setScalar(pulse)
    }

    // Boost emissive materials on hover
    emissiveMats.current.forEach(({ mat, baseEmissive }) => {
      if (mat) {
        mat.emissiveIntensity = baseEmissive + hf * 2.5
      }
    })
  })

  if (loading || !gltf) return null

  // Clone the scene so each instance gets its own material refs
  const scene = gltf.scene.clone(true)

  // Apply Rwanda flag colors to the car body
  // The GLB model likely has material names or we can color the main body
  scene.traverse((child) => {
    if (child.isMesh) {
      // Apply a subtle blue tint to the car body (Rwanda's dominant flag color)
      // This gives the car a Rwanda-themed appearance
      const originalColor = child.material.color.clone()
      
      // Blend with Rwanda blue for body panels
      child.material.color.lerp(RWANDA_COLORS.blue, 0.3)
      
      // Add subtle emissive glow in Rwanda colors
      child.material.emissive = RWANDA_COLORS.blue.clone()
      child.material.emissiveIntensity = 0.1
      child.material.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Center>
        <primitive object={scene} />
        {/* ISHAMI text on the car hood */}
        <group position={[0, 0.45, 0.8]} rotation={[-0.1, 0, 0]}>
          <Text
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
            fontWeight="bold"
          >
            ISHAMI
          </Text>
          {/* Text glow effect */}
          <Text
            position={[0, 0, -0.001]}
            fontSize={0.16}
            color="#00A1DE"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
            fontWeight="bold"
          >
            ISHAMI
          </Text>
        </group>
        {/* Rwanda flag colors on the side */}
        <group position={[0, 0.3, 0]}>
          {/* Blue stripe */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.5, 0.08, 0.02]} />
            <meshStandardMaterial color="#00A1DE" emissive="#00A1DE" emissiveIntensity={0.3} />
          </mesh>
          {/* Yellow stripe */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[2.5, 0.08, 0.02]} />
            <meshStandardMaterial color="#FAD201" emissive="#FAD201" emissiveIntensity={0.3} />
          </mesh>
          {/* Green stripe */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[2.5, 0.08, 0.02]} />
            <meshStandardMaterial color="#20603D" emissive="#20603D" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </Center>
    </group>
  )
})

export default CarModel
