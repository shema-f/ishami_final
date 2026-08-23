import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A small glass-style HUD label that floats above the car when hovered.
 * Fades in/out smoothly and always faces the camera (billboard).
 */
export default function CarTooltip({ visible = false, position = [0, 2.2, 0] }) {
  const groupRef = useRef()
  const materialRef = useRef()
  const borderRef = useRef()
  const textRef = useRef()

  // Smooth opacity target
  const opacityTarget = useRef(0)
  const currentOpacity = useRef(0)

  useFrame((state) => {
    if (!groupRef.current) return

    // Smooth fade
    opacityTarget.current = visible ? 1 : 0
    currentOpacity.current += (opacityTarget.current - currentOpacity.current) * 0.08

    const o = currentOpacity.current

    // Apply opacity to materials
    if (materialRef.current) materialRef.current.opacity = o * 0.9
    if (borderRef.current) borderRef.current.opacity = o * 0.6
    if (textRef.current) textRef.current.fillOpacity = o

    // Gentle float
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.08

    // Billboard: always face camera
    groupRef.current.quaternion.copy(state.camera.quaternion)

    // Don't render when fully transparent
    groupRef.current.visible = o > 0.01
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[2.8, 0.5]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#060d1a"
          transparent
          opacity={0}
          metalness={0.6}
          roughness={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Blue border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[2.86, 0.56]} />
        <meshStandardMaterial
          ref={borderRef}
          color="#0088ff"
          emissive="#0088ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Left accent dot */}
      <mesh position={[-1.2, 0, 0.001]}>
        <circleGeometry args={[0.04, 8]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Main text */}
      <Text
        ref={textRef}
        position={[0, 0.04, 0.002]}
        fontSize={0.13}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
        letterSpacing={0.08}
      >
        EXPLORE THE SIMULATOR
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, -0.12, 0.002]}
        fontSize={0.07}
        color="#66aaff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0}
        letterSpacing={0.05}
      >
        Click to start 3D driving
      </Text>
    </group>
  )
}
