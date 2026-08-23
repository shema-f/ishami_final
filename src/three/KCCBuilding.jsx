import { useMemo } from 'react'
import * as THREE from 'three'

export default function KCCBuilding({ position = [0, 0, 0], scale = 1 }) {
  const glassColor = useMemo(() => new THREE.Color('#1a2a44'), [])
  const frameColor = useMemo(() => new THREE.Color('#334466'), [])
  const roofColor = useMemo(() => new THREE.Color('#223355'), [])
  const accentColor = useMemo(() => new THREE.Color('#0088ff'), [])
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Main base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 6]} />
        <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Glass facade - front */}
      <mesh position={[0, 1.8, 3.01]}>
        <planeGeometry args={[7.5, 2.4]} />
        <meshPhysicalMaterial 
          color={glassColor} 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.7}
          transmission={0.3}
        />
      </mesh>
      
      {/* Glass facade - back */}
      <mesh position={[0, 1.8, -3.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[7.5, 2.4]} />
        <meshPhysicalMaterial 
          color={glassColor} 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.7}
          transmission={0.3}
        />
      </mesh>
      
      {/* Glass facade - sides */}
      <mesh position={[4.01, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.5, 2.4]} />
        <meshPhysicalMaterial 
          color={glassColor} 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.7}
          transmission={0.3}
        />
      </mesh>
      <mesh position={[-4.01, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.5, 2.4]} />
        <meshPhysicalMaterial 
          color={glassColor} 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.7}
          transmission={0.3}
        />
      </mesh>
      
      {/* KCC Signature Dome */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <sphereGeometry args={[4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={roofColor} 
          metalness={0.8} 
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Dome accent ring */}
      <mesh position={[0, 3.0, 0]}>
        <torusGeometry args={[4.2, 0.08, 8, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Vertical frame lines */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 3.02]}>
          <boxGeometry args={[0.08, 2.5, 0.02]} />
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      
      {/* Horizontal frame lines */}
      {[0.8, 1.8, 2.8].map((y, i) => (
        <mesh key={`h${i}`} position={[0, y, 3.02]}>
          <boxGeometry args={[8, 0.06, 0.02]} />
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      
      {/* Entrance canopy */}
      <mesh position={[0, 0.3, 3.5]} castShadow>
        <boxGeometry args={[3, 0.1, 1.2]} />
        <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Canopy supports */}
      <mesh position={[1.3, 0.15, 3.8]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.3, 0.15, 3.8]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Interior lights visible through glass */}
      <pointLight position={[0, 1.5, 0]} color="#ffeedd" intensity={2} distance={8} decay={2} />
      
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[9, 0.1, 7]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}
