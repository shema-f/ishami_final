import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

// ─── Rwandan Palette ───────────────────────────────────────
const RW = {
  blue:   '#14456E',
  yellow: '#C4A800',
  green:  '#1A6B3A',
  blueDark: '#0D2E50',
  gold:   '#D4A017',
  teal:   '#0E7C6B',
  coral:  '#8B3A3A',
  slate:  '#1a2233',
  white:  '#e8e8f0',
  cream:  '#f5e6c8',
  silver: '#8899aa',
}

// ─── Reusable Components ───────────────────────────────────

function StreetLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 3, 4]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 2.9, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.04, 0.04]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.7, 2.8, 0]}>
        <boxGeometry args={[0.2, 0.06, 0.15]} />
        <meshStandardMaterial color="#ffeecc" emissive="#ffcc88" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 4]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.5, 6, 4]} />
        <meshStandardMaterial color="#1a4a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function PineTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.8, 4]} />
        <meshStandardMaterial color="#3a2a18" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.4, 1.2, 5]} />
        <meshStandardMaterial color="#145530" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.3, 0.8, 5]} />
        <meshStandardMaterial color="#1a6035" roughness={0.8} />
      </mesh>
    </group>
  )
}

function ModernBuilding({ position, width = 2, height = 4, depth = 2, color = '#1a2233' }) {
  const glassColor = useMemo(() => {
    const c = new THREE.Color(color)
    c.multiplyScalar(0.4)
    return c
  }, [color])
  const frameColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={frameColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, height / 2, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.9, height * 0.8]} />
        <meshStandardMaterial color={glassColor} metalness={0.3} roughness={0.1} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function Tower({ position, width = 2, height = 12, depth = 2, color = '#0D2E50' }) {
  const windowColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.3), [color])
  return (
    <group position={position}>
      {/* Main shaft */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Glass facade */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.85, height * 0.9]} />
        <meshStandardMaterial color={windowColor} metalness={0.4} roughness={0.05} transparent opacity={0.5} />
      </mesh>
      {/* Crown / top accent */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.15, 0.3, depth + 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, height + 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.5, 4]} />
        <meshStandardMaterial color="#667788" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function KCCDome({ position }) {
  return (
    <group position={position}>
      {/* Dome */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a3050" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[4.2, 4.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a1a2a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Entrance */}
      <mesh position={[0, 1.2, 4.3]}>
        <boxGeometry args={[3, 2.4, 0.3]} />
        <meshStandardMaterial color="#0a1525" metalness={0.3} roughness={0.2} transparent opacity={0.7} />
      </mesh>
      {/* Blue accent light */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#0088ff" emissive="#0066cc" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function Mosque({ position }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[5, 3, 5]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.7} />
      </mesh>
      {/* Minaret */}
      <mesh position={[3, 5, 3]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 8, 8]} />
        <meshStandardMaterial color="#e0d4c0" roughness={0.6} />
      </mesh>
      <mesh position={[3, 9.2, 3]}>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial color="#2a6e3f" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Dome on main */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a6e3f" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function AnimatedTrafficLight({ position, phase = 0 }) {
  const redRef = useRef()
  const yellowRef = useRef()
  const greenRef = useRef()

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() + phase) % 9
    const isRed = t < 4
    const isYellow = t >= 4 && t < 5.5
    const isGreen = t >= 5.5

    if (redRef.current) redRef.current.emissiveIntensity = isRed ? 2.0 : 0.05
    if (yellowRef.current) yellowRef.current.emissiveIntensity = isYellow ? 2.0 : 0.05
    if (greenRef.current) greenRef.current.emissiveIntensity = isGreen ? 2.0 : 0.05
  })

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 3, 4]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.8, 0.06]}>
        <boxGeometry args={[0.16, 0.55, 0.12]} />
        <meshStandardMaterial color="#0a0a11" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.92, 0.13]}>
        <circleGeometry args={[0.04, 6]} />
        <meshStandardMaterial ref={redRef} color="#ff1a1a" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 2.8, 0.13]}>
        <circleGeometry args={[0.04, 6]} />
        <meshStandardMaterial ref={yellowRef} color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, 2.68, 0.13]}>
        <circleGeometry args={[0.04, 6]} />
        <meshStandardMaterial ref={greenRef} color="#00dd00" emissive="#00ff00" emissiveIntensity={0.05} />
      </mesh>
    </group>
  )
}

function StopSign({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.8, 4]} />
        <meshStandardMaterial color="#444455" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.35, 0.35, 0.03, 6]} />
        <meshStandardMaterial color="#cc0000" emissive="#aa0000" emissiveIntensity={0.3} roughness={0.4} metalness={0.2} />
      </mesh>
      <Text position={[0, 2.0, 0.04]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">STOP</Text>
    </group>
  )
}

function SpeedLimitSign({ position, speed = 40, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.8, 4]} />
        <meshStandardMaterial color="#444455" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.0, 0.005]}>
        <ringGeometry args={[0.28, 0.35, 16]} />
        <meshStandardMaterial color="#cc0000" emissive="#aa0000" emissiveIntensity={0.15} />
      </mesh>
      <Text position={[0, 2.0, 0.02]} fontSize={0.18} color="#000000" anchorX="center" anchorY="middle" fontWeight="bold">
        {String(speed)}
      </Text>
    </group>
  )
}

// ─── Road Segment ──────────────────────────────────────────
function RoadSegment({ position, rotation = [0, 0, 0], length = 40, width = 12 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#151520" roughness={0.25} metalness={0.3} />
      </mesh>
      {/* Center dashed line */}
      {Array.from({ length: Math.floor(length / 2) }).map((_, i) => (
        <mesh key={`cl${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -length / 2 + 1 + i * 2]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Side lines */}
      {[-width / 2 + 0.5, width / 2 - 0.5].map((x, idx) => (
        <mesh key={`sl${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.08, length]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Sidewalk Block ────────────────────────────────────────
function Sidewalk({ position, width = 12, length = 10 }) {
  return (
    <group position={position}>
      {[-(width / 2 + 1), width / 2 + 1].map((x, idx) => (
        <mesh key={idx} position={[x, 0.12, 0]}>
          <boxGeometry args={[2, 0.15, length]} />
          <meshStandardMaterial color="#2a2a33" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Main City Component ───────────────────────────────────
export default function City() {
  const treePositions = useMemo(() => {
    const positions = []
    const xs = [-252, -216, -180, -144, -108, -72, -36, 0, 36, 72, 108, 144, 180, 216, 252]
    const zs = [-252, -216, -180, -144, -108, -72, -36, 0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360]
    let seed = 42
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    xs.forEach((x) => {
      zs.forEach((z) => {
        if (rand() < 0.12) {
          const side = rand() > 0.5 ? 1 : -1
          const offsetX = side * (6 + rand() * 4)
          const offsetZ = (rand() - 0.5) * 8
          const scale = 0.7 + rand() * 0.8
          positions.push({ x: x + offsetX, z: z + offsetZ, scale })
        }
      })
    })
    while (positions.length < 200) {
      const rx = -280 + rand() * 560
      const rz = -280 + rand() * 640
      const scale = 0.7 + rand() * 0.8
      positions.push({ x: rx, z: rz, scale })
    }
    return positions.slice(0, 220)
  }, [])

  const trunkRef = useRef()
  const canopyRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    if (!trunkRef.current || !canopyRef.current) return
    treePositions.forEach((pos, i) => {
      dummy.position.set(pos.x, 0.6 * pos.scale, pos.z)
      dummy.scale.set(pos.scale, pos.scale, pos.scale)
      dummy.updateMatrix()
      trunkRef.current.setMatrixAt(i, dummy.matrix)
      dummy.position.set(pos.x, 1.4 * pos.scale, pos.z)
      dummy.updateMatrix()
      canopyRef.current.setMatrixAt(i, dummy.matrix)
    })
    trunkRef.current.instanceMatrix.needsUpdate = true
    canopyRef.current.instanceMatrix.needsUpdate = true
  }, [treePositions, dummy])

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* ROADS — Grid layout                                  */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Main N-S road (Z axis) — the car's road */}
      <RoadSegment position={[0, 0, 0]} length={60} width={12} />

      {/* Cross street 1 */}
      <RoadSegment position={[0, 0, -15]} rotation={[0, Math.PI / 2, 0]} length={50} width={10} />

      {/* Cross street 2 */}
      <RoadSegment position={[0, 0, 15]} rotation={[0, Math.PI / 2, 0]} length={50} width={10} />

      {/* Cross street 3 — far north */}
      <RoadSegment position={[0, 0, -30]} rotation={[0, Math.PI / 2, 0]} length={44} width={8} />

      {/* Cross street 4 — far south */}
      <RoadSegment position={[0, 0, 30]} rotation={[0, Math.PI / 2, 0]} length={44} width={8} />

      {/* Parallel road east */}
      <RoadSegment position={[22, 0, 0]} length={60} width={10} />

      {/* Parallel road west */}
      <RoadSegment position={[-22, 0, 0]} length={60} width={10} />

      {/* Extra far parallel road east */}
      <RoadSegment position={[40, 0, 0]} length={60} width={8} />

      {/* Extra far parallel road west */}
      <RoadSegment position={[-40, 0, 0]} length={60} width={8} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* EXPANDED NS ROADS full grid                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {[-252, -216, -180, -144, -108, -72, -36, 0, 36, 72, 108, 144, 180, 216, 252].map(x => (
        <RoadSegment key={`ns-x${x}`} position={[x, 0, 54]} length={720} width={x % 72 === 0 ? 12 : 10} />
      ))}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* EXPANDED EW ROADS full grid                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {[-252, -216, -180, -144, -108, -72, -36, 0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360].map(z => (
        <RoadSegment key={`ew-z${z}`} position={[18, 0, z]} rotation={[0, Math.PI / 2, 0]} length={600} width={z % 72 === 0 ? 12 : 10} />
      ))}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SCENARIO AREA DISTINCTIVE FEATURES                   */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Highway zone (X=-270) — divided highway parallel roads */}
      <RoadSegment position={[-276, 0, 54]} length={720} width={8} />
      <RoadSegment position={[-264, 0, 54]} length={720} width={8} />

      {/* Hill start (X=-180, Z=306+) — yellow rumble strips every 18 units */}
      {Array.from({ length: Math.floor((400 - 306) / 18) }).map((_, i) => (
        <mesh key={`rumble-${i}`} position={[-180, 0.05, 306 + i * 18]}>
          <boxGeometry args={[8, 0.06, 0.4]} />
          <meshStandardMaterial color="#FFD700" emissive="#DAA520" emissiveIntensity={0.3} roughness={0.7} />
        </mesh>
      ))}

      {/* Stadium parking area (Z=180+, X=90-144) — extra perpendicular EW parking aisles */}
      <RoadSegment position={[117, 0, 198]} rotation={[0, Math.PI / 2, 0]} length={80} width={8} />
      <RoadSegment position={[117, 0, 216]} rotation={[0, Math.PI / 2, 0]} length={80} width={8} />

      {/* School zone (Z=-198 to -162, X=-198) — extra zebra crossings */}
      {[-198, -180, -162].map((zCross, zi) => (
        <group key={`school-zebra-${zi}`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={`sz-${zi}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-202 + i * 1.2, 0.025, zCross]}>
              <planeGeometry args={[0.5, 2.5]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      ))}

      {/* East tunnel exit (Z=252 area) — road marker */}
      <group position={[36, 0, 252]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 2, 4]} />
          <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.08]} />
          <meshStandardMaterial color="#1a4a8a" emissive="#0E7C6B" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2.2, 0.06]} fontSize={0.18} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          TUNNEL
        </Text>
      </group>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK A — North-West (tall residential/commercial)    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ModernBuilding position={[-8, 0, -8]} width={3} height={6} depth={3} color={RW.blue} />
      <ModernBuilding position={[-8, 0, -2]} width={2.5} height={4} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[-12, 0, -10]} width={3.5} height={8} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[-12, 0, -4]} width={2.5} height={5} depth={2.5} color={RW.teal} />
      <Tower position={[-16, 0, -8]} width={3} height={14} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[-16, 0, -2]} width={3} height={6} depth={3} color={RW.blue} />
      <ModernBuilding position={[-10, 0, -14]} width={2} height={3} depth={2} color={RW.green} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK B — North-East (commercial district)            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ModernBuilding position={[8, 0, -8]} width={3} height={7} depth={3} color={RW.yellow} />
      <ModernBuilding position={[8, 0, -2]} width={2.5} height={5} depth={2.5} color={RW.green} />
      <Tower position={[12, 0, -8]} width={3} height={16} depth={3} color="#0a1e3a" />
      <ModernBuilding position={[12, 0, -2]} width={3} height={6} depth={3} color={RW.blue} />
      <ModernBuilding position={[16, 0, -10]} width={2.5} height={4} depth={2.5} color={RW.gold} />
      <ModernBuilding position={[16, 0, -4]} width={2} height={8} depth={2} color={RW.blueDark} />
      <ModernBuilding position={[10, 0, -14]} width={2.5} height={3.5} depth={2} color={RW.coral} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK C — Central (government / KCC area)             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ModernBuilding position={[-8, 0, 4]} width={2.5} height={4} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[-8, 0, 10]} width={2} height={5} depth={2} color={RW.green} />
      <Tower position={[-14, 0, 7]} width={3.5} height={12} depth={3.5} color={RW.blueDark} />
      <ModernBuilding position={[-14, 0, 12]} width={3} height={5} depth={3} color={RW.blue} />
      <ModernBuilding position={[-18, 0, 8]} width={2.5} height={7} depth={2.5} color={RW.teal} />
      <ModernBuilding position={[-10, 0, 16]} width={2} height={3} depth={2} color={RW.yellow} />

      {/* KCC Dome — iconic Kigali landmark */}
      <KCCDome position={[0, 0, 22]} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK D — South-East (mixed use)                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ModernBuilding position={[8, 0, 4]} width={2.5} height={5} depth={2.5} color={RW.blue} />
      <ModernBuilding position={[8, 0, 10]} width={2} height={4} depth={2} color={RW.yellow} />
      <Tower position={[14, 0, 7]} width={3} height={10} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[14, 0, 13]} width={2.5} height={6} depth={2.5} color={RW.green} />
      <ModernBuilding position={[18, 0, 6]} width={2} height={3.5} depth={2} color={RW.gold} />
      <ModernBuilding position={[18, 0, 12]} width={2.5} height={7} depth={2.5} color={RW.blue} />
      <ModernBuilding position={[10, 0, 16]} width={2} height={3} depth={2} color={RW.coral} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK E — Far West (residential hillside)              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Tower position={[-30, 0, -5]} width={3} height={18} depth={3} color="#0a1e3a" />
      <ModernBuilding position={[-30, 0, 5]} width={3} height={6} depth={3} color={RW.blue} />
      <ModernBuilding position={[-34, 0, -8]} width={2.5} height={4} depth={2.5} color={RW.green} />
      <ModernBuilding position={[-34, 0, 2]} width={2} height={5} depth={2} color={RW.yellow} />
      <ModernBuilding position={[-28, 0, 10]} width={3} height={8} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[-38, 0, -4]} width={2.5} height={3} depth={2} color={RW.teal} />
      <ModernBuilding position={[-36, 0, 8]} width={2} height={4.5} depth={2} color={RW.gold} />
      <ModernBuilding position={[-32, 0, -14]} width={2} height={6} depth={2} color={RW.blue} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK F — Far East (business park)                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Tower position={[30, 0, -5]} width={3.5} height={15} depth={3.5} color={RW.blueDark} />
      <ModernBuilding position={[30, 0, 5]} width={3} height={7} depth={3} color={RW.blue} />
      <ModernBuilding position={[34, 0, -8]} width={2.5} height={5} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[34, 0, 2]} width={2} height={4} depth={2} color={RW.green} />
      <ModernBuilding position={[28, 0, 10]} width={3} height={9} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[38, 0, -3]} width={2.5} height={3.5} depth={2} color={RW.coral} />
      <ModernBuilding position={[36, 0, 8]} width={2} height={5.5} depth={2} color={RW.teal} />
      <ModernBuilding position={[32, 0, -14]} width={2.5} height={6} depth={2.5} color={RW.blue} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK G — South-West (mosque area)                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Mosque position={[-28, 0, 16]} />
      <ModernBuilding position={[-34, 0, 16]} width={2.5} height={4} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[-30, 0, 24]} width={2} height={3} depth={2} color={RW.green} />
      <ModernBuilding position={[-26, 0, 24]} width={3} height={5} depth={2.5} color={RW.blue} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK H — South-Center (Convention area)               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <ModernBuilding position={[-8, 0, 22]} width={2.5} height={5} depth={2.5} color={RW.blue} />
      <ModernBuilding position={[8, 0, 22]} width={2.5} height={4.5} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[0, 0, 30]} width={3} height={6} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[-14, 0, 26]} width={2} height={3.5} depth={2} color={RW.green} />
      <ModernBuilding position={[14, 0, 26]} width={2} height={4} depth={2} color={RW.teal} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK I — North Center (towers)                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Tower position={[0, 0, -22]} width={3.5} height={20} depth={3.5} color="#0a1e3a" />
      <Tower position={[-6, 0, -24]} width={3} height={14} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[6, 0, -22]} width={3} height={8} depth={3} color={RW.blue} />
      <ModernBuilding position={[0, 0, -28]} width={2.5} height={5} depth={2.5} color={RW.yellow} />
      <ModernBuilding position={[-10, 0, -22]} width={2} height={6} depth={2} color={RW.green} />
      <ModernBuilding position={[10, 0, -26]} width={2.5} height={4} depth={2.5} color={RW.gold} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BLOCK J — Far background (skyline)                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Tower position={[-24, 0, -28]} width={3} height={22} depth={3} color="#0a1830" />
      <Tower position={[24, 0, -26]} width={3.5} height={18} depth={3} color="#0a1e3a" />
      <Tower position={[-38, 0, -22]} width={3} height={12} depth={3} color={RW.blueDark} />
      <Tower position={[38, 0, -20]} width={3} height={14} depth={3} color="#0a1830" />
      <ModernBuilding position={[-20, 0, -30]} width={4} height={8} depth={3} color={RW.blue} />
      <ModernBuilding position={[20, 0, -30]} width={4} height={10} depth={3} color={RW.blueDark} />
      <ModernBuilding position={[0, 0, -35]} width={3} height={6} depth={3} color={RW.teal} />
      <ModernBuilding position={[-30, 0, -32]} width={3} height={7} depth={3} color={RW.green} />
      <ModernBuilding position={[30, 0, -32]} width={3} height={5} depth={3} color={RW.yellow} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* INTERSECTIONS — Traffic Lights                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AnimatedTrafficLight position={[5, 0, -15]} phase={0} />
      <AnimatedTrafficLight position={[-5, 0, -15]} phase={3} />
      <AnimatedTrafficLight position={[5, 0, 15]} phase={4.5} />
      <AnimatedTrafficLight position={[-5, 0, 15]} phase={6} />
      <AnimatedTrafficLight position={[5, 0, -30]} phase={1.5} />
      <AnimatedTrafficLight position={[-5, 0, -30]} phase={7} />
      <AnimatedTrafficLight position={[5, 0, 30]} phase={2} />
      <AnimatedTrafficLight position={[-5, 0, 30]} phase={5} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TRAFFIC SIGNS                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <StopSign position={[5.5, 0, 6]} rotation={[0, -Math.PI / 2, 0]} />
      <SpeedLimitSign position={[5.5, 0, -4]} speed={40} rotation={[0, -Math.PI / 2, 0]} />
      <SpeedLimitSign position={[-5.5, 0, 0]} speed={40} rotation={[0, Math.PI / 2, 0]} />
      <StopSign position={[5.5, 0, -14]} rotation={[0, -Math.PI / 2, 0]} />
      <SpeedLimitSign position={[-5.5, 0, 14]} speed={50} rotation={[0, Math.PI / 2, 0]} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STREET LIGHTS — Along main roads                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      {/* Main N-S road */}
      {[-25, -15, -5, 5, 15, 25].map((z) => (
        <StreetLight key={`ns${z}`} position={[-5.5, 0, z]} />
      ))}
      {[-25, -15, -5, 5, 15, 25].map((z) => (
        <StreetLight key={`ns2${z}`} position={[5.5, 0, z]} />
      ))}
      {/* Cross streets */}
      {[-20, -10, 10, 20].map((x) => (
        <StreetLight key={`ew${x}`} position={[x, 0, -14]} />
      ))}
      {[-20, -10, 10, 20].map((x) => (
        <StreetLight key={`ew2${x}`} position={[x, 0, 14]} />
      ))}
      {/* Far roads */}
      {[-30, -15, 0, 15, 30].map((z) => (
        <StreetLight key={`fw${z}`} position={[-21, 0, z]} />
      ))}
      {[-30, -15, 0, 15, 30].map((z) => (
        <StreetLight key={`fw2${z}`} position={[21, 0, z]} />
      ))}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TREES — Instanced mesh (~220 trees across grid)      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <instancedMesh ref={trunkRef} args={[undefined, undefined, treePositions.length]} castShadow={false}>
        <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
        <meshStandardMaterial color="#6b4423" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, treePositions.length]} castShadow={false}>
        <sphereGeometry args={[0.5, 6, 4]} />
        <meshStandardMaterial color="#1a4a2a" roughness={0.8} />
      </instancedMesh>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ZEBRA CROSSINGS                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`zb1-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-3 + i * 1.2, 0.025, 8]}>
          <planeGeometry args={[0.5, 2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`zb2-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2 + i * 1, 0.025, -14]}>
          <planeGeometry args={[0.4, 1.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`zb3-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2 + i * 1, 0.025, 15]}>
          <planeGeometry args={[0.4, 1.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ROAD ARROWS & SPEED BUMPS                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.025, -5]}>
        <coneGeometry args={[0.3, 0.8, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.025, 10]} rotation={[0, Math.PI, 0]}>
        <coneGeometry args={[0.3, 0.8, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {[0, 12, -12].map((z, i) => (
        <mesh key={`bump${i}`} position={[0, 0.04, z]}>
          <boxGeometry args={[8, 0.06, 0.3]} />
          <meshStandardMaterial color="#333344" roughness={0.6} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GROUND PLANE — expanded to full scenario range       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 50]} receiveShadow>
        <planeGeometry args={[700, 800]} />
        <meshStandardMaterial color="#0a0e14" roughness={1} />
      </mesh>
    </group>
  )
}
