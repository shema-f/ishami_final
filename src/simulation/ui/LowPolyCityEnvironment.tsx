// ============================================================
// ISHAMI SIMULATION — Low Poly City Environment
// Loads the low_poly_city GLTF scene + animated people
// Used for the new driving scenarios (start, traffic flow, etc.)
// ============================================================

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ─── GLB/GLTF Cache ─────────────────────────────────────────

const glbCache: Record<string, any> = {};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

function useCachedGLB(path: string) {
  const [gltf, setGltf] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (glbCache[path]) {
      setGltf(glbCache[path]);
      setLoading(false);
      return;
    }
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      path,
      (g) => {
        glbCache[path] = g;
        setGltf(g);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load GLB:', path, err);
        setLoading(false);
      }
    );
  }, [path]);

  return { gltf, loading };
}

// ─── Low Poly City ──────────────────────────────────────────

export function LowPolyCityEnvironment({ onSceneReady }: { onSceneReady?: (scene: THREE.Object3D) => void }) {
  const { gltf, loading } = useCachedGLB('/models/low_poly_city/scene.gltf');

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    if (onSceneReady && gltf.scene) {
      onSceneReady(gltf.scene);
    }
  }, [gltf, onSceneReady]);

  if (loading || !gltf) return null;

  const scene = gltf.scene.clone(true);
  return (
    <group scale={[1, 1, 1]}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Animated Low Poly People ──────────────────────────────
// Loads wip_lowpoly_people_2.glb and places animated pedestrians

interface PedestrianPath {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  speed: number;
  delay: number; // stagger start
}

function AnimatedPedestrian({
  model,
  path,
  time,
}: {
  model: any;
  path: PedestrianPath;
  time: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const adjustedTime = Math.max(0, time - path.delay);
  const totalDist = new THREE.Vector3(...path.start).distanceTo(new THREE.Vector3(...path.end));
  const cycleTime = totalDist / path.speed;
  const progress = cycleTime > 0 ? (adjustedTime % (cycleTime * 2)) / cycleTime : 0;
  const pingPong = progress <= 1 ? progress : 2 - progress;

  useFrame(() => {
    if (!groupRef.current) return;
    const from = new THREE.Vector3(...path.start);
    const to = new THREE.Vector3(...path.end);
    const pos = from.lerp(to, pingPong);
    groupRef.current.position.copy(pos);

    // Face direction of travel
    const dir = to.clone().sub(from);
    if (dir.length() > 0.01) {
      groupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
    }

    // Simple walk cycle bob
    groupRef.current.position.y = path.start[1] + Math.abs(Math.sin(adjustedTime * 6)) * 0.05;
  });

  if (!model?.scene) return null;

  const cloned = model.scene.clone(true);
  return (
    <group ref={groupRef}>
      <primitive object={cloned} scale={[0.06, 0.06, 0.06]} />
    </group>
  );
}

// ─── Zebra Crossing Visual ─────────────────────────────────

export function ZebraCrossing({
  position,
  rotation = 0,
  width = 4,
  length = 8,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
  length?: number;
}) {
  const stripes = useMemo(() => {
    const result: { x: number; w: number }[] = [];
    const stripeCount = 6;
    const gap = length / (stripeCount * 2);
    for (let i = 0; i < stripeCount; i++) {
      result.push({
        x: -length / 2 + gap + i * gap * 2,
        w: gap * 0.8,
      });
    }
    return result;
  }, [length]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {stripes.map((s, i) => (
        <mesh key={i} position={[s.x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[s.w, width]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Stop Line Visual ──────────────────────────────────────

export function StopLine({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ─── Road Line Markings ────────────────────────────────────

export function RoadLines({
  waypoints,
}: {
  waypoints: { position: [number, number, number] }[];
}) {
  const lines = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (const wp of waypoints) {
      pts.push(new THREE.Vector3(wp.position[0], 0.05, wp.position[2]));
    }
    return pts;
  }, [waypoints]);

  if (lines.length < 2) return null;

  const geom = new THREE.BufferGeometry().setFromPoints(lines);

  return (
    <group>
      <line geometry={geom}>
        <lineDashedMaterial
          color="#3b82f6"
          transparent
          opacity={0.4}
          dashSize={1.5}
          gapSize={1}
          linewidth={1}
        />
      </line>
    </group>
  );
}

// ─── Parking Spot Markers ──────────────────────────────────

export function ParkingSpots({
  spots,
}: {
  spots: { position: [number, number, number]; rotation?: number; occupied?: boolean }[];
}) {
  return (
    <group>
      {spots.map((spot, i) => (
        <group key={i} position={spot.position} rotation={[0, spot.rotation || 0, 0]}>
          {/* Parking bay outline */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2, 4]} />
            <meshStandardMaterial
              color={spot.occupied ? '#ef4444' : '#22c55e'}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center dot */}
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color={spot.occupied ? '#ef4444' : '#22c55e'}
              emissive={spot.occupied ? '#ef4444' : '#22c55e'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Static Parked Car (for parking scenarios) ─────────────

export function ParkedCar({
  position,
  rotation = 0,
  color = 0x666666,
}: {
  position: [number, number, number];
  rotation?: number;
  color?: number;
}) {
  const carColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 3.2]} />
        <meshStandardMaterial color={carColor} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.6]} />
        <meshStandardMaterial color={carColor} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.75, 0.6]}>
        <boxGeometry args={[1.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
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

// ─── Waypoint Marker (for low poly city) ───────────────────

export function WaypointMarker({
  waypoint,
  isActive,
  isCompleted,
}: {
  waypoint: { position: [number, number, number] };
  isActive: boolean;
  isCompleted: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = 2.5 + Math.sin(t * 2) * 0.15;
    ref.current.rotation.y = t * 0.5;
  });

  const color = isCompleted ? '#22c55e' : isActive ? '#f59e0b' : '#3b82f6';
  const opacity = isCompleted ? 0.3 : isActive ? 0.8 : 0.4;

  return (
    <group position={waypoint.position}>
      <mesh ref={ref} position={[0, 2.5, 0]}>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} depthWrite={false} />
      </mesh>
      {isActive && (
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.5, 4]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// ─── People Spawner ────────────────────────────────────────

export function PeopleSpawner({ paths }: { paths: PedestrianPath[] }) {
  const { gltf: peopleModel } = useCachedGLB('/models/low_poly_city/wip_-_lowpoly_people_-_2.glb');
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    setTime((t) => t + delta);
  });

  if (!peopleModel) return null;

  return (
    <group>
      {paths.map((path) => (
        <AnimatedPedestrian
          key={path.id}
          model={peopleModel}
          path={path}
          time={time}
        />
      ))}
    </group>
  );
}
