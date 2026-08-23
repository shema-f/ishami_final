// ============================================================
// ISHAMI SIMULATION — Traffic System
// AI cars driving on roads + traffic lights at intersections
// ============================================================

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Traffic Light ─────────────────────────────────────────

interface TrafficLightData {
  position: [number, number, number];
  rotation: number;
  greenDuration: number;
  yellowDuration: number;
  redDuration: number;
  offset: number; // time offset so lights don't all sync
}

function TrafficLight({ data }: { data: TrafficLightData }) {
  const meshRef = useRef<THREE.Group>(null);
  const redRef = useRef<THREE.Mesh>(null);
  const yellowRef = useRef<THREE.Mesh>(null);
  const greenRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(data.offset);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const cycle = data.greenDuration + data.yellowDuration + data.redDuration;
    const phase = t % cycle;

    const isRed = phase >= data.greenDuration + data.yellowDuration;
    const isYellow = phase >= data.greenDuration && !isRed;
    const isGreen = !isRed && !isYellow;

    if (redRef.current) {
      (redRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isRed ? 3 : 0.1;
      (redRef.current.material as THREE.MeshStandardMaterial).opacity = isRed ? 1 : 0.2;
    }
    if (yellowRef.current) {
      (yellowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isYellow ? 3 : 0.1;
      (yellowRef.current.material as THREE.MeshStandardMaterial).opacity = isYellow ? 1 : 0.2;
    }
    if (greenRef.current) {
      (greenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isGreen ? 3 : 0.1;
      (greenRef.current.material as THREE.MeshStandardMaterial).opacity = isGreen ? 1 : 0.2;
    }
  });

  return (
    <group ref={meshRef} position={data.position} rotation={[0, data.rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Housing */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[0.6, 1.8, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Red light */}
      <mesh ref={redRef} position={[0, 5.5, 0.21]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Yellow light */}
      <mesh ref={yellowRef} position={[0, 5, 0.21]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Green light */}
      <mesh ref={greenRef} position={[0, 4.5, 0.21]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.1}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// ─── AI Car ────────────────────────────────────────────────

interface AICarData {
  id: string;
  color: number;
  speed: number;
  path: [number, number, number][];
}

function AICar({ data, playerPosition }: { data: AICarData; playerPosition: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const speedRef = useRef(data.speed);

  // Simple car body
  const carColor = useMemo(() => new THREE.Color(data.color), [data.color]);

  useFrame((_, delta) => {
    if (!groupRef.current || data.path.length < 2) return;

    // Move along path
    progressRef.current += speedRef.current * delta * 0.01;

    // Loop through path
    const totalLen = data.path.length;
    const idx = Math.floor(progressRef.current) % totalLen;
    const nextIdx = (idx + 1) % totalLen;
    const frac = progressRef.current - Math.floor(progressRef.current);

    const from = data.path[idx];
    const to = data.path[nextIdx];

    // Position
    const x = THREE.MathUtils.lerp(from[0], to[0], frac);
    const z = THREE.MathUtils.lerp(from[2], to[2], frac);

    groupRef.current.position.set(x, 0.6, z);

    // Rotation — face direction of travel
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      const targetRot = Math.atan2(dx, dz);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRot,
        0.1
      );
    }

    // Slow down near player
    const distToPlayer = groupRef.current.position.distanceTo(playerPosition);
    if (distToPlayer < 15) {
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, data.speed * 0.3, 0.05);
    } else {
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, data.speed, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 3.2]} />
        <meshStandardMaterial color={carColor} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.7, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.45, 1.6]} />
        <meshStandardMaterial color={carColor} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.7, 0.6]}>
        <boxGeometry args={[1.3, 0.35, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.7, -1]}>
        <boxGeometry args={[1.3, 0.35, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.5, 0.3, 1.61]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.5, 0.3, 1.61]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.5, 0.3, -1.61]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5, 0.3, -1.61]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Wheels */}
      {[[-0.8, 0, 0.9], [0.8, 0, 0.9], [-0.8, 0, -0.9], [0.8, 0, -0.9]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Default Traffic Config ────────────────────────────────
// Traffic lights at major intersections around the city

const DEFAULT_TRAFFIC_LIGHTS: TrafficLightData[] = [
  // Coffee Shop area intersection
  { position: [68, 0, -126], rotation: 0, greenDuration: 12, yellowDuration: 3, redDuration: 12, offset: 0 },
  { position: [72, 0, -126], rotation: Math.PI, greenDuration: 12, yellowDuration: 3, redDuration: 12, offset: 15 },

  // North road intersection
  { position: [68, 0, -180], rotation: 0, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 5 },
  { position: [72, 0, -180], rotation: Math.PI, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 20 },

  // East road intersection
  { position: [144, 0, -162], rotation: Math.PI / 2, greenDuration: 11, yellowDuration: 3, redDuration: 11, offset: 3 },
  { position: [144, 0, -158], rotation: -Math.PI / 2, greenDuration: 11, yellowDuration: 3, redDuration: 11, offset: 18 },

  // South road intersection
  { position: [144, 0, -126], rotation: Math.PI, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 7 },

  // West road intersection
  { position: [108, 0, -90], rotation: -Math.PI / 2, greenDuration: 12, yellowDuration: 3, redDuration: 12, offset: 10 },

  // Hospital district
  { position: [-126, 0, -54], rotation: 0, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 2 },
  { position: [-126, 0, -90], rotation: Math.PI, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 17 },

  // Stadium area
  { position: [90, 0, 216], rotation: Math.PI / 2, greenDuration: 12, yellowDuration: 3, redDuration: 12, offset: 8 },

  // Convention Centre
  { position: [0, 0, -36], rotation: 0, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 4 },
  { position: [0, 0, -72], rotation: Math.PI, greenDuration: 10, yellowDuration: 2, redDuration: 10, offset: 19 },
];

// Default AI car paths — loop around major roads
const DEFAULT_AI_CARS: AICarData[] = [
  // Car 1: Coffee Shop loop (north → east → south → west)
  {
    id: 'ai_1',
    color: 0xcc3333,
    speed: 12,
    path: [
      [68, 0, -126], [68, 0, -180], [108, 0, -180], [144, 0, -180],
      [144, 0, -126], [144, 0, -90], [108, 0, -90], [68, 0, -90],
      [68, 0, -126],
    ],
  },
  // Car 2: West district loop
  {
    id: 'ai_2',
    color: 0x3366cc,
    speed: 10,
    path: [
      [-126, 0, -54], [-126, 0, -90], [-90, 0, -90], [-54, 0, -90],
      [-54, 0, -108], [-54, 0, -144], [-90, 0, -144], [-126, 0, -144],
      [-126, 0, -108], [-126, 0, -54],
    ],
  },
  // Car 3: North-South highway run
  {
    id: 'ai_3',
    color: 0x33cc66,
    speed: 15,
    path: [
      [68, 0, -252], [68, 0, -198], [68, 0, -162], [68, 0, -126],
      [68, 0, -90], [68, 0, -54], [68, 0, -18], [68, 0, 18],
      [68, 0, 54], [68, 0, 18], [68, 0, -18], [68, 0, -54],
      [68, 0, -90], [68, 0, -126], [68, 0, -162], [68, 0, -198],
      [68, 0, -252],
    ],
  },
  // Car 4: East district patrol
  {
    id: 'ai_4',
    color: 0xcccc33,
    speed: 8,
    path: [
      [180, 0, -90], [216, 0, -90], [216, 0, -54], [216, 0, -18],
      [180, 0, -18], [180, 0, -54], [180, 0, -90],
    ],
  },
  // Car 5: Stadium circuit
  {
    id: 'ai_5',
    color: 0xff6600,
    speed: 9,
    path: [
      [144, 0, -126], [144, 0, -90], [144, 0, 180], [144, 0, 216],
      [90, 0, 216], [90, 0, 180], [90, 0, -126], [144, 0, -126],
    ],
  },
  // Car 6: Convention Centre loop
  {
    id: 'ai_6',
    color: 0x9933cc,
    speed: 11,
    path: [
      [0, 0, -36], [0, 0, -72], [36, 0, -72], [72, 0, -72],
      [72, 0, -36], [36, 0, 0], [0, 0, 0], [0, 0, -36],
    ],
  },
];

// ─── Exported Traffic System ───────────────────────────────

export default function TrafficSystem({
  trafficLights,
  aiVehicles,
  visible = true,
}: {
  trafficLights?: { position: [number, number, number]; rotation: number }[];
  aiVehicles?: { position: [number, number, number]; color: number; speed: number; path: [number, number, number][] }[];
  visible?: boolean;
}) {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3());

  // Track player position
  useFrame(() => {
    const carPos = (window as any).__ishami_carPosition;
    if (carPos) {
      playerPos.current.copy(carPos);
    }
  });

  // Use defaults or scenario-specific data
  const lights = trafficLights && trafficLights.length > 0
    ? trafficLights.map((l, i) => ({
        ...l,
        greenDuration: 10 + (i % 3),
        yellowDuration: 3,
        redDuration: 10 + (i % 3),
        offset: i * 5,
      }))
    : DEFAULT_TRAFFIC_LIGHTS;

  const cars = aiVehicles && aiVehicles.length > 0
    ? aiVehicles
    : DEFAULT_AI_CARS;

  if (!visible) return null;

  return (
    <group>
      {/* Traffic Lights */}
      {lights.map((light, i) => (
        <TrafficLight
          key={`tl_${i}`}
          data={light}
        />
      ))}

      {/* AI Cars */}
      {cars.map((car) => (
        <AICar
          key={car.id}
          data={car}
          playerPosition={playerPos.current}
        />
      ))}
    </group>
  );
}
