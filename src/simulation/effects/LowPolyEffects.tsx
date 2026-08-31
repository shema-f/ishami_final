// ============================================================
// ISHAMI SIMULATION — Low Poly City Visual Effects
// Road markings, building highlights, particles, street lights
// ============================================================

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Animated Dashed Road Lines ────────────────────────────
// Center lines and edge lines that animate along the road

export function RoadMarkings({
  roads,
}: {
  roads: {
    start: [number, number, number];
    end: [number, number, number];
    type?: 'center' | 'edge' | 'crosswalk';
    color?: string;
  }[];
}) {
  return (
    <group>
      {roads.map((road, i) => (
        <RoadLine key={i} {...road} index={i} />
      ))}
    </group>
  );
}

function RoadLine({
  start,
  end,
  type = 'center',
  color,
  index,
}: {
  start: [number, number, number];
  end: [number, number, number];
  type?: 'center' | 'edge' | 'crosswalk';
  color?: string;
  index: number;
}) {
  const ref = useRef<THREE.Line>(null);
  const offsetRef = useRef(0);

  const lineColor = color || (type === 'center' ? '#ffffff' : type === 'edge' ? '#cccccc' : '#ffffff');
  const dashSize = type === 'crosswalk' ? 0.5 : 1.5;
  const gapSize = type === 'crosswalk' ? 0.3 : 1.0;

  const points = useMemo(() => {
    const from = new THREE.Vector3(start[0], 0.06, start[2]);
    const to = new THREE.Vector3(end[0], 0.06, end[2]);
    return [from, to];
  }, [start, end]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    offsetRef.current += delta * 1.5;
    const mat = ref.current.material as THREE.LineDashedMaterial;
    if (mat) {
      mat.dashOffset = -offsetRef.current;
    }
  });

  return (
    <line ref={ref as any} geometry={geometry}>
      <lineDashedMaterial
        color={lineColor}
        transparent
        opacity={type === 'center' ? 0.6 : 0.35}
        dashSize={dashSize}
        gapSize={gapSize}
        linewidth={1}
      />
    </line>
  );
}

// ─── Building Glow Highlights ─────────────────────────────
// Subtle emissive glow on building edges for visual pop

export function BuildingHighlights({
  buildings,
}: {
  buildings: {
    position: [number, number, number];
    size: [number, number, number];
    color?: string;
    glowColor?: string;
  }[];
}) {
  return (
    <group>
      {buildings.map((b, i) => (
        <BuildingGlow key={i} {...b} />
      ))}
    </group>
  );
}

function BuildingGlow({
  position,
  size,
  color = '#ffffff',
  glowColor = '#3b82f6',
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  glowColor?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = 0.3 + Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Building body */}
      <mesh position={[0, size[1] / 2, 0]} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Glow accent strip */}
      <mesh ref={ref} position={[0, size[1] + 0.05, 0]}>
        <boxGeometry args={[size[0] + 0.1, 0.1, size[2] + 0.1]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// ─── Street Light with Glow ───────────────────────────────
// Tall pole with a glowing orb at the top

export function StreetLights({
  positions,
}: {
  positions: [number, number, number][];
}) {
  return (
    <group>
      {positions.map((pos, i) => (
        <StreetLight key={i} position={pos} index={i} />
      ))}
    </group>
  );
}

function StreetLight({
  position,
  index,
}: {
  position: [number, number, number];
  index: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle flicker
    lightRef.current.intensity = 2.5 + Math.sin(t * 2 + index) * 0.3;
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 5, 6]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[0, 5.1, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.3]} />
        <meshStandardMaterial color="#333333" metalness={0.5} />
      </mesh>
      {/* Light orb */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffaa"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        position={[0, 5, 0]}
        color="#ffffcc"
        intensity={2.5}
        distance={15}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}

// ─── Dust / Sparkle Particles ─────────────────────────────
// Floating particles that add atmosphere

export function FloatingParticles({
  count = 50,
  area = 60,
  height = 10,
  color = '#ffffff',
  speed = 0.3,
}: {
  count?: number;
  area?: number;
  height?: number;
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * area,
      y: Math.random() * height,
      z: (Math.random() - 0.5) * area,
      speed: speed * (0.5 + Math.random() * 0.5),
      offset: Math.random() * Math.PI * 2,
      size: 0.03 + Math.random() * 0.05,
    }));
  }, [count, area, height, speed]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.y + Math.sin(t * p.speed * 0.7 + p.offset) * 0.3,
        p.z + Math.cos(t * p.speed + p.offset) * 0.5
      );
      dummy.scale.setScalar(p.size * (1 + Math.sin(t * 2 + p.offset) * 0.3));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Animated Zebra Crossing ──────────────────────────────
// Pulsing zebra crossing that draws attention

export function AnimatedZebraCrossing({
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
  const groupRef = useRef<THREE.Group>(null);

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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle pulse
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.01;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {stripes.map((s, i) => (
        <mesh key={i} position={[s.x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[s.w, width]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.6}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      {/* Edge glow lines */}
      <mesh position={[0, 0.03, width / 2 + 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.1]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.03, -width / 2 - 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.1]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ─── Road Surface with Markings ───────────────────────────
// Renders a textured road segment with lane markings

export function RoadSegment({
  start,
  end,
  width = 6,
  color = '#2a2a2a',
}: {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const { position, rotation, length } = useMemo(() => {
    const from = new THREE.Vector3(start[0], 0, start[2]);
    const to = new THREE.Vector3(end[0], 0, end[2]);
    const dir = to.clone().sub(from);
    const len = dir.length();
    const mid = from.clone().lerp(to, 0.5);
    const angle = Math.atan2(dir.x, dir.z);

    return {
      position: [mid.x, -0.05, mid.z] as [number, number, number],
      rotation: [0, angle, 0] as [number, number, number],
      length: len,
    };
  }, [start, end]);

  return (
    <group>
      {/* Road surface */}
      <mesh position={position} rotation={rotation} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Center dashed line */}
      <RoadLine
        start={[start[0], 0.06, start[2]]}
        end={[end[0], 0.06, end[2]]}
        type="center"
        color="#ffffff"
        index={0}
      />
    </group>
  );
}

// ─── Stop Line ────────────────────────────────────────────

export function StopLine({
  position,
  rotation = 0,
  width = 4,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, width]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

// ─── Direction Arrow on Road ──────────────────────────────

export function RoadArrow({
  position,
  rotation = 0,
  color = '#ffffff',
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.5);
    s.lineTo(0.6, 0.5);
    s.lineTo(0.3, 0.5);
    s.lineTo(0.3, -1.5);
    s.lineTo(-0.3, -1.5);
    s.lineTo(-0.3, 0.5);
    s.lineTo(-0.6, 0.5);
    s.closePath();
    return s;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Parking Bay Lines ────────────────────────────────────

export function ParkingBayLines({
  positions,
  rotation = 0,
  bayWidth = 2.5,
  bayLength = 5,
  color = '#ffffff',
}: {
  positions: [number, number, number][];
  rotation?: number;
  bayWidth?: number;
  bayLength?: number;
  color?: string;
}) {
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos} rotation={[0, rotation, 0]}>
          {/* Left line */}
          <mesh position={[-bayWidth / 2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, bayLength]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} />
          </mesh>
          {/* Right line */}
          <mesh position={[bayWidth / 2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, bayLength]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} />
          </mesh>
          {/* Back line */}
          <mesh position={[0, 0.03, -bayLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bayWidth, 0.08]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Speed Bump ───────────────────────────────────────────

export function SpeedBump({
  position,
  rotation = 0,
  width = 5,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[width, 0.15, 0.6]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.2} />
      </mesh>
      {/* Black stripes */}
      {[-0.15, 0.15].map((z, i) => (
        <mesh key={i} position={[0, 0.16, z]}>
          <boxGeometry args={[width, 0.02, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Tree Decoration ──────────────────────────────────────

export function LowPolyTree({
  position,
  scale = 1,
  trunkColor = '#8B4513',
  leafColor = '#228B22',
}: {
  position: [number, number, number];
  scale?: number;
  trunkColor?: string;
  leafColor?: string;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.6, 6]} />
        <meshStandardMaterial color={trunkColor} />
      </mesh>
      {/* Leaves - stacked cones */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.8, 1.2, 6]} />
        <meshStandardMaterial color={leafColor} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.5, 0.8, 6]} />
        <meshStandardMaterial color={leafColor} />
      </mesh>
    </group>
  );
}
