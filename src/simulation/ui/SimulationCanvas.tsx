// ============================================================
// ISHAMI SIMULATION — 3D Canvas (Enhanced)
// Main scene: City, Car, Camera, Waypoints, Lighting
// With collision detection, road markings, and visual effects
// ============================================================

import { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { VehiclePhysics } from '../vehicle/VehiclePhysics';
import { CollisionSystem } from '../core/CollisionSystem';
import { RoadBoundarySystem } from '../core/RoadBoundarySystem';
import TrafficSystem from './TrafficSystem';
import { LowPolyCityEnvironment, ZebraCrossing, PeopleSpawner, ParkedCar, WaypointMarker as LowPolyWaypointMarker } from './LowPolyCityEnvironment';
import { RoadMarkings as LowPolyRoadMarkings, StreetLights, FloatingParticles, RoadArrow, StopLine as LowPolyStopLine, SpeedBump, LowPolyTree, RoadSegment, AnimatedZebraCrossing } from '../effects/LowPolyEffects';
import type { SimulationState, Waypoint } from '../core/SimulationState';

// ─── GLB Cache ──────────────────────────────────────────────

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

// ─── City Environment ──────────────────────────────────────

function CityEnvironment({ onSceneReady }: { onSceneReady?: (scene: THREE.Object3D) => void }) {
  const { gltf, loading } = useCachedGLB('/models/ISHAMI_CITY1.glb');

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // Notify parent so collision system can scan the scene
    if (onSceneReady && gltf.scene) {
      onSceneReady(gltf.scene);
    }
  }, [gltf, onSceneReady]);

  if (loading || !gltf) return null;

  const scene = gltf.scene.clone(true);
  return (
    <group scale={[0.75, 0.75, 0.75]}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Road Markings ─────────────────────────────────────────
// Dashed center lines and edge lines drawn on roads

function RoadMarkings({ waypoints }: { waypoints: Waypoint[] }) {
  const markings = useMemo(() => {
    const lines: { points: THREE.Vector3[]; color: string; dashed: boolean }[] = [];

    // Draw route lines as road markings
    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const nextWp = waypoints[(i + 1) % waypoints.length];
      const start = new THREE.Vector3(...wp.position);
      const end = new THREE.Vector3(...nextWp.position);
      start.y = 0.12;
      end.y = 0.12;

      // Route guide line
      lines.push({ points: [start, end], color: '#3b82f6', dashed: true });
    }

    return lines;
  }, [waypoints]);

  return (
    <group>
      {markings.map((line, i) => {
        const geom = new THREE.BufferGeometry().setFromPoints(line.points);
        return (
          <line key={i} geometry={geom}>
            <lineDashedMaterial
              color={line.color}
              transparent
              opacity={0.35}
              dashSize={2}
              gapSize={1.5}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

// ─── Collision Spark Effect ────────────────────────────────

function CollisionFlash({ position, active }: { position: THREE.Vector3; active: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current || !meshRef.current) return;
    if (active) {
      ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, 50, 0.3);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 3, 0.2));
      (meshRef.current.material as any).opacity = THREE.MathUtils.lerp(
        (meshRef.current.material as any).opacity, 0.6, 0.15
      );
    } else {
      ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, 0, 0.1);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 0, 0.1));
      (meshRef.current.material as any).opacity = THREE.MathUtils.lerp(
        (meshRef.current.material as any).opacity, 0, 0.1
      );
    }
  });

  return (
    <group position={[position.x, position.y + 1, position.z]}>
      <pointLight ref={ref} color="#ff6600" intensity={0} distance={15} decay={2} />
      <mesh ref={meshRef} scale={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0} />
      </mesh>
    </group>
  );
}

// ─── Car Model ──────────────────────────────────────────────

function CarModel({
  physics,
  collisionSystem,
  roadBoundarySystem,
  onSpeedUpdate,
  onPositionUpdate,
  onCollision,
  startPos,
}: {
  physics: VehiclePhysics;
  collisionSystem: CollisionSystem;
  roadBoundarySystem: RoadBoundarySystem | null;
  onSpeedUpdate: (speed: number, rpm: number) => void;
  onPositionUpdate?: (pos: THREE.Vector3, rot: number) => void;
  onCollision?: (severity: 'MINOR' | 'WARNING' | 'MAJOR', point: THREE.Vector3) => void;
  startPos?: [number, number, number];
}) {
  const { gltf, loading } = useCachedGLB('/models/modern_cartoon_sports_car.glb');
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  // Validate start position is on a road — snap to nearest road if off-road
  const validatedStartPos = useMemo(() => {
    const rawX = startPos?.[0] ?? 68;
    const rawZ = startPos?.[2] ?? -126;
    if (roadBoundarySystem && !roadBoundarySystem.isOnRoad(rawX, rawZ, 1.5)) {
      const nearest = roadBoundarySystem.getClosestRoadPoint(rawX, rawZ, 1.5);
      if (nearest) {
        console.warn(`[ISHAMI] Start position (${rawX}, ${rawZ}) is off-road. Snapping to nearest road at (${nearest.point.x.toFixed(1)}, ${nearest.point.z.toFixed(1)})`);
        return { x: nearest.point.x, y: (startPos?.[1] ?? 0) + 0.8, z: nearest.point.z };
      }
    }
    return { x: rawX, y: (startPos?.[1] ?? 0) + 0.8, z: rawZ };
  }, [startPos, roadBoundarySystem]);

  const positionRef = useRef(new THREE.Vector3(
    validatedStartPos.x,
    validatedStartPos.y,
    validatedStartPos.z
  ));
  const collisionCooldown = useRef(0);
  const lastCollisionPos = useRef(new THREE.Vector3());
  const offRoadCooldown = useRef(0);

  // Rwanda flag colors: Blue (top), Yellow (middle), Green (bottom)
  const rwandaBlue = useMemo(() => new THREE.Color('#0072C6'), []);
  const rwandaYellow = useMemo(() => new THREE.Color('#FAD201'), []);
  const rwandaGreen = useMemo(() => new THREE.Color('#009E60'), []);

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.envMapIntensity = 0.5;
        child.material.needsUpdate = true;

        // Apply Rwanda flag colors to car body
        const name = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();
        const isBody = name.includes('body') || name.includes('chassis') || name.includes('car') ||
                       matName.includes('body') || matName.includes('paint');
        const isAcccent = name.includes('accent') || name.includes('stripe') || name.includes('detail');

        if (isBody) {
          // Main body: Rwanda blue
          child.material.color = rwandaBlue;
          child.material.metalness = 0.6;
          child.material.roughness = 0.3;
          child.material.needsUpdate = true;
        } else if (isAcccent) {
          // Accent/stripe: Rwanda yellow
          child.material.color = rwandaYellow;
          child.material.emissive = rwandaYellow;
          child.material.emissiveIntensity = 0.15;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [gltf, rwandaBlue, rwandaYellow, rwandaGreen]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const simState = (window as any).__ishami_state || {};

    const result = physics.update(
      {
        speed: Math.abs(physics._smoothSpeed ?? 0),
        gear: simState.gear || 'N',
        clutchPressed: simState.clutchPressed || false,
        brakePressed: simState.brakePressed || false,
        acceleratorPressed: simState.acceleratorPressed || false,
        handbrakeOn: simState.handbrakeOn ?? true,
        engineRunning: simState.engineRunning || false,
        engineStalled: simState.engineStalled || false,
        steeringAngle: simState.steeringAngle || 0,
      } as any,
      delta
    );

    const moveAngle = rotationRef.current;
    const moveSpeed = result.speed;

    // Calculate new position
    let newX = positionRef.current.x + Math.sin(moveAngle) * moveSpeed * delta;
    let newZ = positionRef.current.z + Math.cos(moveAngle) * moveSpeed * delta;
    const newRot = rotationRef.current + result.rotation * delta;

    // ─── Road Boundary Check ───
    // Car must stay on roads — constrain movement to road segments
    if (roadBoundarySystem && Math.abs(moveSpeed) > 0.01) {
      const constrained = roadBoundarySystem.constrainToRoad(
        positionRef.current.x,
        positionRef.current.z,
        newX,
        newZ,
        1.5 // car bounding radius
      );

      if (constrained.constrained) {
        // Car is trying to go off-road — push it back and slow down
        newX = constrained.x;
        newZ = constrained.z;

        // Slow the car when going off-road
        physics._smoothSpeed *= 0.5;

        // Off-road cooldown to avoid spam
        if (offRoadCooldown.current <= 0) {
          offRoadCooldown.current = 0.3;
          if (onCollision) {
            const offRoadPoint = new THREE.Vector3(newX, positionRef.current.y, newZ);
            onCollision('MINOR', offRoadPoint);
          }
        }
      }
    }

    // ─── Collision Detection ───
    const testPos = new THREE.Vector3(newX, positionRef.current.y, newZ);
    const velocity = new THREE.Vector3(
      Math.sin(moveAngle) * moveSpeed,
      0,
      Math.cos(moveAngle) * moveSpeed
    );

    const collision = collisionSystem.checkCollision(testPos, velocity, delta);

    if (collision.hit && collisionCooldown.current <= 0) {
      // Collision happened — bounce back
      const bounceStrength = Math.min(Math.abs(moveSpeed) * 0.8, 8);
      const dir = testPos.clone().sub(collision.contactPoint).normalize();

      positionRef.current.x += dir.x * bounceStrength * delta * 5;
      positionRef.current.z += dir.z * bounceStrength * delta * 5;

      // Slow down on collision
      physics._smoothSpeed *= 0.3;

      // Record collision
      collisionCooldown.current = 0.5; // 500ms cooldown
      lastCollisionPos.current = collision.contactPoint.clone();

      if (onCollision) {
        onCollision(collision.severity, collision.contactPoint);
      }
    } else {
      // No collision — apply movement
      positionRef.current.x = newX;
      positionRef.current.z = newZ;
      rotationRef.current = newRot;
    }

    // Cooldown timers
    if (collisionCooldown.current > 0) {
      collisionCooldown.current -= delta;
    }
    if (offRoadCooldown.current > 0) {
      offRoadCooldown.current -= delta;
    }

    // Update visual position
    groupRef.current.position.copy(positionRef.current);
    groupRef.current.rotation.y = rotationRef.current;

    // Body roll on steering
    const bodyRoll = -result.steeringAngle * 0.06 * Math.min(Math.abs(moveSpeed) * 2, 1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, bodyRoll, 0.1);

    // Slight pitch on braking/acceleration
    const pitch = (simState.acceleratorPressed ? -0.02 : 0) + (simState.brakePressed ? 0.03 : 0);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pitch, 0.1);

    onSpeedUpdate(Math.abs(moveSpeed * 3.6), result.rpm);
    onPositionUpdate?.(positionRef.current, rotationRef.current);

    if (result.stalled) {
      (window as any).__ishami_stalled = true;
    }
  });

  if (loading || !gltf) return null;

  const scene = gltf.scene.clone(true);

  return (
    <group ref={groupRef} position={[validatedStartPos.x, validatedStartPos.y, validatedStartPos.z]}>
      <primitive object={scene} scale={1.4} />
      {/* Ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── Aerial Flyover Camera ────────────────────────────────

function AerialFlyoverCamera({ onComplete, cityModel }: { onComplete: () => void; cityModel?: string }) {
  const { camera } = useThree();
  const startTime = useRef<number | null>(null);
  const baseFov = useRef(55);
  const DURATION = 10;

  const keyframes = useMemo(() => {
    if (cityModel === 'low_poly') {
      // Low poly city is centered at origin
      return [
        { t: 0, pos: [0, 40, 20], lookAt: [0, 0, 0] },
        { t: 0.15, pos: [25, 30, 10], lookAt: [0, 0, 0] },
        { t: 0.3, pos: [30, 25, -15], lookAt: [0, 0, 0] },
        { t: 0.5, pos: [15, 20, -25], lookAt: [0, 0, 0] },
        { t: 0.65, pos: [-15, 18, -15], lookAt: [0, 0, 0] },
        { t: 0.8, pos: [-10, 12, 5], lookAt: [0, 0, 0] },
        { t: 1.0, pos: [0, 8, 12], lookAt: [0, 1, 0] },
      ];
    }
    // Default: old ISHAMI_CITY1 centered at [68, 0, -140]
    return [
      { t: 0, pos: [68, 55, -80], lookAt: [68, 0, -140] },
      { t: 0.15, pos: [100, 40, -120], lookAt: [68, 0, -140] },
      { t: 0.3, pos: [140, 35, -160], lookAt: [68, 0, -140] },
      { t: 0.5, pos: [120, 30, -100], lookAt: [68, 0, -140] },
      { t: 0.65, pos: [30, 25, -120], lookAt: [68, 0, -140] },
      { t: 0.8, pos: [50, 15, -110], lookAt: [68, 0, -130] },
      { t: 1.0, pos: [68, 10, -116], lookAt: [68, 1, -130] },
    ];
  }, [cityModel]);

  const getCurrentTransform = useCallback((progress: number) => {
    let kA = keyframes[0];
    let kB = keyframes[keyframes.length - 1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].t && progress <= keyframes[i + 1].t) {
        kA = keyframes[i];
        kB = keyframes[i + 1];
        break;
      }
    }
    const segT = kB.t === kA.t ? 0 : (progress - kA.t) / (kB.t - kA.t);
    const ease = segT * segT * (3 - 2 * segT);
    return {
      pos: new THREE.Vector3(
        THREE.MathUtils.lerp(kA.pos[0], kB.pos[0], ease),
        THREE.MathUtils.lerp(kA.pos[1], kB.pos[1], ease),
        THREE.MathUtils.lerp(kA.pos[2], kB.pos[2], ease)
      ),
      lookAt: new THREE.Vector3(
        THREE.MathUtils.lerp(kA.lookAt[0], kB.lookAt[0], ease),
        THREE.MathUtils.lerp(kA.lookAt[1], kB.lookAt[1], ease),
        THREE.MathUtils.lerp(kA.lookAt[2], kB.lookAt[2], ease)
      ),
    };
  }, [keyframes]);

  useFrame(() => {
    if (startTime.current === null) startTime.current = 0;
    const elapsed = (camera as any).__aerialElapsed ?? 0;
    const progress = Math.min(elapsed / DURATION, 1);
    const { pos, lookAt } = getCurrentTransform(progress);

    camera.position.lerp(pos, 0.06);
    camera.lookAt(lookAt);

    const altitudeFactor = Math.max(0, (pos.y - 10) / 40);
    const targetFov = 45 + altitudeFactor * 30;
    baseFov.current += (targetFov - baseFov.current) * 0.04;
    camera.fov = baseFov.current;
    camera.updateProjectionMatrix();

    (camera as any).__aerialElapsed = elapsed + (1 / 60);

    if (progress >= 1) {
      (window as any).__ishami_aerialFinished = true;
    }
  });

  return null;
}

// ─── Camera System ──────────────────────────────────────────

// ─── Route Preview Camera ─────────────────────────────────
// Flies along the waypoint path, showing the route to the player

function RoutePreviewCamera({
  waypoints,
  onComplete,
  speedLimit,
  objectives,
}: {
  waypoints: Waypoint[];
  onComplete: () => void;
  speedLimit: number;
  objectives: { id: string; text: string; textRW: string; icon: string }[];
}) {
  const { camera } = useThree();
  const baseFov = useRef(50);
  const progressRef = useRef(0);
  const waypointIndexRef = useRef(0);
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');

  // Build a smooth path through all waypoints
  const pathPoints = useMemo(() => {
    return waypoints.map(wp => new THREE.Vector3(wp.position[0], wp.position[1] + 15, wp.position[2]));
  }, [waypoints]);

  const lookAtPoints = useMemo(() => {
    return waypoints.map(wp => new THREE.Vector3(wp.position[0], 0, wp.position[2]));
  }, [waypoints]);

  useFrame((_, delta) => {
    if (pathPoints.length < 2) return;

    // Total duration scales with number of waypoints
    const totalDuration = waypoints.length * 2.5; // 2.5 seconds per waypoint
    progressRef.current += delta;
    const totalProgress = Math.min(progressRef.current / totalDuration, 1);

    // Map progress to waypoint index
    const wpProgress = totalProgress * (pathPoints.length - 1);
    const idx = Math.floor(wpProgress);
    const frac = wpProgress - idx;

    if (idx >= pathPoints.length - 1) {
      // Finished
      camera.position.copy(pathPoints[pathPoints.length - 1]);
      camera.lookAt(lookAtPoints[lookAtPoints.length - 1]);
      onComplete();
      return;
    }

    // Smooth interpolation between waypoints
    const from = pathPoints[idx];
    const to = pathPoints[idx + 1];
    const lookFrom = lookAtPoints[idx];
    const lookTo = lookAtPoints[idx + 1];
    const ease = frac * frac * (3 - 2 * frac); // smoothstep

    const camPos = new THREE.Vector3().lerpVectors(from, to, ease);
    const targetLook = new THREE.Vector3().lerpVectors(lookFrom, lookTo, ease);

    // Slight orbit around the look point for cinematic feel
    const orbitAngle = progressRef.current * 0.3;
    camPos.x += Math.sin(orbitAngle) * 5;
    camPos.z += Math.cos(orbitAngle) * 5;

    camera.position.lerp(camPos, 0.08);
    camera.lookAt(targetLook);

    // FOV
    baseFov.current = THREE.MathUtils.lerp(baseFov.current, 50, 0.02);
    camera.fov = baseFov.current;
    camera.updateProjectionMatrix();

    // Update current waypoint label for UI
    const newIdx = Math.min(Math.round(wpProgress), waypoints.length - 1);
    if (newIdx !== waypointIndexRef.current) {
      waypointIndexRef.current = newIdx;
      setCurrentLabel(waypoints[newIdx].objective);
      setCurrentObjective(waypoints[newIdx].instruction);
    }
  });

  return null;
}

// ─── Free Camera (Aerial Exploration) ─────────────────────
// WASD to pan, mouse drag to rotate, scroll to zoom

function FreeCamera({
  zoomLevel,
}: {
  zoomLevel: number;
}) {
  const { camera, gl } = useThree();
  const targetPos = useRef(new THREE.Vector3(68, 40, -126));
  const targetLookAt = useRef(new THREE.Vector3(68, 0, -140));
  const yaw = useRef(0);
  const pitch = useRef(-0.6);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dom = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.005;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.005, -1.2, -0.1);
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl]);

  useFrame(() => {
    const keys = (window as any).__ishami_keys || new Set();
    const moveSpeed = 0.5 + zoomLevel * 0.3;

    // WASD panning
    const forward = new THREE.Vector3(
      Math.sin(yaw.current), 0, Math.cos(yaw.current)
    );
    const right = new THREE.Vector3(
      Math.cos(yaw.current), 0, -Math.sin(yaw.current)
    );

    if (keys.has('KeyW') || keys.has('ArrowUp')) targetPos.current.add(forward.clone().multiplyScalar(moveSpeed));
    if (keys.has('KeyS') || keys.has('ArrowDown')) targetPos.current.add(forward.clone().multiplyScalar(-moveSpeed));
    if (keys.has('KeyA') || keys.has('ArrowLeft')) targetPos.current.add(right.clone().multiplyScalar(-moveSpeed));
    if (keys.has('KeyD') || keys.has('ArrowRight')) targetPos.current.add(right.clone().multiplyScalar(moveSpeed));

    // Height from zoom level
    const height = 20 + zoomLevel * 15;
    const lookDist = 30 + zoomLevel * 10;

    const finalPos = new THREE.Vector3(
      targetPos.current.x + Math.sin(yaw.current) * lookDist * Math.cos(pitch.current),
      targetPos.current.y + height,
      targetPos.current.z + Math.cos(yaw.current) * lookDist * Math.cos(pitch.current)
    );

    camera.position.lerp(finalPos, 0.08);
    camera.lookAt(targetPos.current);

    camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.02);
    camera.updateProjectionMatrix();
  });

  return null;
}

// ─── SimulationCamera ──────────────────────────────────────

function SimulationCamera({
  cameraMode,
  speed,
  zoomLevel,
}: {
  cameraMode: 'thirdPerson' | 'cockpit';
  speed: number;
  zoomLevel: number; // 0 = close, 1 = normal, 2 = far, 3 = aerial view
}) {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(68, 8, -116));
  const smoothLookAt = useRef(new THREE.Vector3(68, 1, -130));
  const baseFov = useRef(60);
  const smoothSpeed = useRef(0);

  useFrame(() => {
    const carPos = (window as any).__ishami_carPosition;
    const carRot = (window as any).__ishami_carRotation ?? 0;

    if (!carPos) return;

    smoothSpeed.current = THREE.MathUtils.lerp(smoothSpeed.current, speed, 0.1);
    const spd = smoothSpeed.current;

    let targetPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    let targetFov: number;
    let lerpSpeed: number;

    if (cameraMode === 'cockpit') {
      targetPos = new THREE.Vector3(
        carPos.x + Math.sin(carRot) * 0.3,
        carPos.y + 1.3,
        carPos.z + Math.cos(carRot) * 0.3
      );
      targetLookAt = new THREE.Vector3(
        carPos.x + Math.sin(carRot) * 20,
        carPos.y + 1.2,
        carPos.z + Math.cos(carRot) * 20
      );
      targetFov = 70;
      lerpSpeed = 0.18;
    } else {
      const zoomMult = zoomLevel === 0 ? 0.4 : zoomLevel === 1 ? 1 : zoomLevel === 2 ? 2 : 4;
      const isAerial = zoomLevel >= 3;

      const dist = (10 + spd * 0.15) * zoomMult;
      const height = (4.5 + spd * 0.08) * zoomMult;
      const lookAhead = (4 + spd * 0.2) * (isAerial ? 0.5 : 1);

      targetPos = new THREE.Vector3(
        carPos.x - Math.sin(carRot) * dist,
        carPos.y + height,
        carPos.z - Math.cos(carRot) * dist
      );

      targetLookAt = new THREE.Vector3(
        carPos.x + Math.sin(carRot) * lookAhead,
        carPos.y + (isAerial ? height * 0.3 : 1.0),
        carPos.z + Math.cos(carRot) * lookAhead
      );

      targetFov = isAerial
        ? 55 + Math.min(spd * 0.15, 10)
        : 55 + Math.min(spd * 0.3, 20);
      lerpSpeed = isAerial ? 0.04 : (0.06 + spd * 0.001);
    }

    smoothPos.current.lerp(targetPos, lerpSpeed);
    smoothLookAt.current.lerp(targetLookAt, lerpSpeed * 1.2);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLookAt.current);

    baseFov.current = THREE.MathUtils.lerp(baseFov.current, targetFov, 0.04);
    camera.fov = baseFov.current;
    camera.updateProjectionMatrix();
  });

  return null;
}

// ─── Waypoint Markers ──────────────────────────────────────

function WaypointMarker({
  waypoint,
  isActive,
  isCompleted,
}: {
  waypoint: Waypoint;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = waypoint.position[1] + 0.5 + Math.sin(t * 2) * 0.15;
    ref.current.rotation.y = t * 0.5;
  });

  const color = isCompleted ? '#22c55e' : isActive ? '#f59e0b' : '#3b82f6';
  const opacity = isCompleted ? 0.3 : isActive ? 0.8 : 0.4;

  return (
    <group position={waypoint.position} userData={{ isWaypoint: true }}>
      {/* Floating marker above road — NOT on the road surface */}
      <mesh ref={ref} position={[0, 3.5, 0]} userData={{ isWaypoint: true }}>
        <torusGeometry args={[1.5, 0.12, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.8}
          depthWrite={false}
        />
      </mesh>
      {/* Vertical beam for active waypoint */}
      {isActive && (
        <mesh position={[0, 1.75, 0]} userData={{ isWaypoint: true }}>
          <cylinderGeometry args={[0.03, 0.03, 3.5, 4]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Route Preview Visuals ────────────────────────────────
// Animated route line + START/FINISH labels during route preview

function RoutePreviewVisuals({ waypoints }: { waypoints: Waypoint[] }) {
  const lineRef = useRef<THREE.Line>(null);
  const progressRef = useRef(0);

  // Animated route line that draws itself
  const fullPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < waypoints.length; i++) {
      pts.push(new THREE.Vector3(waypoints[i].position[0], 0.3, waypoints[i].position[2]));
      if (i < waypoints.length - 1) {
        // Add intermediate points for smoother road following
        const next = waypoints[i + 1];
        const mid = new THREE.Vector3(
          (waypoints[i].position[0] + next.position[0]) / 2,
          0.3,
          (waypoints[i].position[2] + next.position[2]) / 2
        );
        pts.push(mid);
      }
    }
    // Close the loop
    pts.push(new THREE.Vector3(waypoints[0].position[0], 0.3, waypoints[0].position[2]));
    return pts;
  }, [waypoints]);

  // Draw progress animation
  const visibleGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(fullPoints.length * 3);
    fullPoints.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // Start with zero draw range
    geom.setDrawRange(0, 0);
    return geom;
  }, [fullPoints]);

  useFrame((_, delta) => {
    progressRef.current = Math.min(progressRef.current + delta * 0.8, 1);
    const count = Math.floor(progressRef.current * fullPoints.length);
    visibleGeom.setDrawRange(0, Math.max(1, count));
  });

  const startPos = waypoints[0]?.position || [0, 0, 0];
  const endPos = waypoints[waypoints.length - 1]?.position || [0, 0, 0];

  return (
    <group>
      {/* Animated route line */}
      <line ref={lineRef as any} geometry={visibleGeom}>
        <lineBasicMaterial color="#3b82f6" linewidth={2} transparent opacity={0.8} />
      </line>

      {/* Glowing trail on top */}
      <line ref={lineRef as any} geometry={visibleGeom}>
        <lineBasicMaterial color="#60a5fa" linewidth={1} transparent opacity={0.4} />
      </line>

      {/* START label */}
      <group position={[startPos[0], startPos[1] + 6, startPos[2]]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
        <pointLight color="#22c55e" intensity={3} distance={20} />
        <Text
          position={[0, 2.5, 0]}
          fontSize={2.5}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#000000"
        >
          START
        </Text>
      </group>

      {/* FINISH label */}
      <group position={[endPos[0], endPos[1] + 6, endPos[2]]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
        <pointLight color="#ef4444" intensity={3} distance={20} />
        <Text
          position={[0, 2.5, 0]}
          fontSize={2.5}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#000000"
        >
          FINISH
        </Text>
      </group>

      {/* Intermediate waypoint dots */}
      {waypoints.slice(1, -1).map((wp, i) => (
        <group key={wp.id} position={[wp.position[0], wp.position[1] + 1.5, wp.position[2]]}>
          <mesh>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
          <Text
            position={[0, 2, 0]}
            fontSize={1.5}
            color="#f59e0b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {`${i + 1}`}
          </Text>
        </group>
      ))}
    </group>
  );
}

// ─── Lighting ──────────────────────────────────────────────

function SceneLighting() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <>
      <ambientLight color="#667799" intensity={isMobile ? 0.6 : 0.4} />
      <directionalLight
        position={[10, 15, 8]}
        color="#ddeeff"
        intensity={isMobile ? 1.5 : 1.8}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-far={isMobile ? 30 : 50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-5, 8, 3]} color="#8899bb" intensity={isMobile ? 0.6 : 0.8} />
      <hemisphereLight skyColor="#8899bb" groundColor="#222233" intensity={isMobile ? 0.4 : 0.5} />
    </>
  );
}

// ─── Ground Plane ──────────────────────────────────────────

function Ground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow={!isMobile}>
      <planeGeometry args={[isMobile ? 200 : 500, isMobile ? 200 : 500]} />
      <meshStandardMaterial color="#1e2330" roughness={1} />
    </mesh>
  );
}

// ─── FPS Counter ────────────────────────────────────────
// Measures frame rate and stores it on window for the HUD to read

function FPSCounter() {
  const frames = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsRef = useRef(0);

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;
    if (elapsed >= 1000) {
      fpsRef.current = Math.round((frames.current * 1000) / elapsed);
      frames.current = 0;
      lastTime.current = now;
      (window as any).__ishami_fps = fpsRef.current;
    }
  });

  return null;
}

// ─── Scene Contents ────────────────────────────────────────

function DynamicFog({ phase }: { phase: string }) {
  const fogRef = useRef<THREE.Fog>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame(() => {
    if (!fogRef.current) return;
    const targetNear = phase === 'aerial' ? 10 : isMobile ? 50 : 80;
    const targetFar = phase === 'aerial' ? (isMobile ? 250 : 400) : (isMobile ? 180 : 300);
    fogRef.current.near += (targetNear - fogRef.current.near) * 0.03;
    fogRef.current.far += (targetFar - fogRef.current.far) * 0.03;
  });

  return <fog ref={fogRef} attach="fog" args={['#1a1e2a', 50, 180]} />;
}

function SceneContents({
  onSpeedUpdate,
  waypoints,
  cameraMode,
  phase,
  onAerialComplete,
  onRoutePreviewComplete,
  onCollision,
  startPos,
  zoomLevel,
  speedLimit,
  objectives,
  cityModel,
  trafficLights,
  aiVehicles,
  pedestrians,
}: {
  onSpeedUpdate: (speed: number, rpm: number) => void;
  waypoints: Waypoint[];
  cameraMode: 'thirdPerson' | 'cockpit';
  phase: string;
  onAerialComplete?: () => void;
  onRoutePreviewComplete?: () => void;
  onCollision?: (severity: 'MINOR' | 'WARNING' | 'MAJOR', point: THREE.Vector3) => void;
  startPos?: [number, number, number];
  zoomLevel: number;
  speedLimit?: number;
  objectives?: { id: string; text: string; textRW: string; icon: string }[];
  cityModel?: 'default' | 'low_poly';
  trafficLights?: { position: [number, number, number]; rotation: number }[];
  aiVehicles?: { position: [number, number, number]; color: number; speed: number; path: [number, number, number][] }[];
  pedestrians?: { position: [number, number, number]; path: [number, number, number][]; speed: number }[];
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const physics = useMemo(() => new VehiclePhysics(), []);
  const collisionSystem = useMemo(() => new CollisionSystem(), []);
  const roadBoundarySystem = useMemo(() => {
    if (cityModel === 'low_poly') {
      return RoadBoundarySystem.createLowPolyRoads();
    }
    // Build roads dynamically from the scenario's waypoint path
    // so the car always starts and drives on roads for any scenario
    const wpPositions: [number, number, number][] = waypoints.map(wp => wp.position as [number, number, number]);
    return RoadBoundarySystem.createFromWaypoints(wpPositions, 8);
  }, [cityModel, waypoints]);
  const speedRef = useRef(0);
  const collisionFlashPos = useRef(new THREE.Vector3());
  const [flashActive, setFlashActive] = useState(false);

  // Store physics globally for the page to read
  useEffect(() => {
    (window as any).__ishami_physics = physics;
  }, [physics]);

  // Auto-generate colliders from city scene
  const handleCityScene = useCallback((scene: THREE.Object3D) => {
    collisionSystem.clear();
    collisionSystem.generateFromScene(scene, 'building');

  }, [collisionSystem]);

  // Callback to receive actual car position from CarModel
  const handleCarPosition = useCallback((pos: THREE.Vector3, rot: number) => {
    (window as any).__ishami_carPosition = pos.clone();
    (window as any).__ishami_carRotation = rot;
  }, []);

  // Collision handler
  const handleCollision = useCallback((severity: 'MINOR' | 'WARNING' | 'MAJOR', point: THREE.Vector3) => {
    collisionFlashPos.current = point.clone();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);
    if (onCollision) onCollision(severity, point);
  }, [onCollision]);

  return (
    <>
      <FPSCounter />
      <SceneLighting />
      <DynamicFog phase={phase} />

      <Ground />
      {/* City model selection */}
      {cityModel === 'low_poly' ? (
        <LowPolyCityEnvironment onSceneReady={handleCityScene} />
      ) : (
        <CityEnvironment onSceneReady={handleCityScene} />
      )}
      <TrafficSystem
        visible={phase === 'driving' || phase === 'preparation' || phase === 'route_preview'}
        trafficLights={trafficLights}
        aiVehicles={aiVehicles}
        cityModel={cityModel}
      />
      <RoadMarkings waypoints={waypoints} />

      <CarModel
        physics={physics}
        collisionSystem={collisionSystem}
        roadBoundarySystem={roadBoundarySystem}
        onSpeedUpdate={(speed, rpm) => {
          speedRef.current = speed;
          onSpeedUpdate(speed, rpm);
        }}
        onPositionUpdate={handleCarPosition}
        onCollision={handleCollision}
        startPos={startPos}
      />

      {/* Collision flash effect */}
      <CollisionFlash position={collisionFlashPos.current} active={flashActive} />

      {/* Aerial flyover camera */}
      {phase === 'aerial' && onAerialComplete && (
        <AerialFlyoverCamera onComplete={onAerialComplete} cityModel={cityModel} />
      )}

      {/* Route preview camera — flies along the waypoint path */}
      {phase === 'route_preview' && onRoutePreviewComplete && (
        <RoutePreviewCamera
          waypoints={waypoints}
          onComplete={onRoutePreviewComplete}
          speedLimit={speedLimit || 30}
          objectives={objectives || []}
        />
      )}

      {/* Free exploration camera — at aerial zoom during briefing */}
      {phase === 'briefing' && zoomLevel >= 3 && (
        <FreeCamera zoomLevel={zoomLevel} />
      )}

      {/* Normal chase camera */}
      {(phase === 'preparation' || phase === 'driving' || phase === 'briefing') && (
        <SimulationCamera
          cameraMode={cameraMode}
          speed={speedRef.current}
          zoomLevel={zoomLevel}
        />
      )}

      {/* Waypoint markers — only show during driving/preparation */}
      {(phase === 'driving' || phase === 'preparation') &&
        waypoints.map((wp, i) => (
          <WaypointMarker
            key={wp.id}
            waypoint={wp}
            isActive={i === ((window as any).__ishami_currentWp || 0)}
            isCompleted={wp.completed}
          />
        ))
      }

      {/* Route preview: animated route line + start/finish labels */}
      {phase === 'route_preview' && (
        <RoutePreviewVisuals waypoints={waypoints} />
      )}

      {/* Low Poly City: Pedestrians & Zebra Crossings */}
      {cityModel === 'low_poly' && phase === 'driving' && pedestrians && pedestrians.length > 0 && (
        <PeopleSpawner
          paths={pedestrians.map((p, i) => ({
            id: `ped_${i}`,
            start: p.position,
            end: p.path[p.path.length - 1] || p.position,
            speed: p.speed,
            delay: i * 2,
          }))}
        />
      )}

      {/* Low Poly City: Zebra Crossings at pedestrian waypoints */}
      {cityModel === 'low_poly' && phase === 'driving' && pedestrians && pedestrians.map((ped, i) => (
        <ZebraCrossing
          key={`zebra_${i}`}
          position={[ped.position[0], 0.01, ped.position[2] + 2]}
          width={3}
          length={6}
        />
      ))}

      {/* LOW POLY CITY: ROAD SURFACES + MARKINGS */}
      {cityModel === 'low_poly' && (<>
        {/* Main horizontal road — top lane (west to east) */}
        <RoadSegment start={[-25, 0, -3.5]} end={[5, 0, -3.5]} width={3.5} color="#2d2d2d" />
        {/* Main horizontal road — bottom lane (east to west) */}
        <RoadSegment start={[-25, 0, -7]} end={[5, 0, -7]} width={3.5} color="#2d2d2d" />
        {/* Center divider between lanes */}
        <mesh position={[-10, 0.04, -5.25]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[30, 0.15]} />
          <meshStandardMaterial color="#ffdd00" emissive="#ffaa00" emissiveIntensity={0.3} />
        </mesh>
        {/* Side road 1 — x=-15 */}
        <RoadSegment start={[-15, 0, -3.5]} end={[-15, 0, -7]} width={3.5} color="#2d2d2d" />
        {/* Side road 2 — x=-5 */}
        <RoadSegment start={[-5, 0, -3.5]} end={[-5, 0, -7]} width={3.5} color="#2d2d2d" />
        {/* Side road 3 — x=3 */}
        <RoadSegment start={[3, 0, -3.5]} end={[3, 0, -7]} width={3.5} color="#2d2d2d" />
        {/* Top edge line */}
        <mesh position={[-10, 0.05, -1.8]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[30, 0.08]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
        {/* Bottom edge line */}
        <mesh position={[-10, 0.05, -8.7]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[30, 0.08]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
        {/* Animated center dashed lines — top lane */}
        <LowPolyRoadMarkings roads={[          
          { start: [-25, 0, -3.5], end: [5, 0, -3.5], type: 'center', color: '#ffffff' },
          { start: [-25, 0, -7], end: [5, 0, -7], type: 'center', color: '#ffffff' },
          { start: [-15, 0, -3.5], end: [-15, 0, -7], type: 'center', color: '#ffffff' },
          { start: [-5, 0, -3.5], end: [-5, 0, -7], type: 'center', color: '#ffffff' },
          { start: [3, 0, -3.5], end: [3, 0, -7], type: 'center', color: '#ffffff' },
        ]} />
        {/* Zebra crossings at intersections */}
        <AnimatedZebraCrossing position={[-15, 0.03, -5.25]} rotation={0} width={3.5} length={3} />
        <AnimatedZebraCrossing position={[-5, 0.03, -5.25]} rotation={0} width={3.5} length={3} />
        <AnimatedZebraCrossing position={[3, 0.03, -5.25]} rotation={0} width={3.5} length={3} />
        {/* Direction arrows on main road */}
        <RoadArrow position={[-20, 0, -3.5]} rotation={0} color="#ffffff" />
        <RoadArrow position={[-13, 0, -3.5]} rotation={0} color="#ffffff" />
        <RoadArrow position={[0, 0, -3.5]} rotation={0} color="#ffffff" />
        <RoadArrow position={[-20, 0, -7]} rotation={Math.PI} color="#ffffff" />
        <RoadArrow position={[-10, 0, -7]} rotation={Math.PI} color="#ffffff" />
        <RoadArrow position={[2, 0, -7]} rotation={Math.PI} color="#ffffff" />
        {/* Stop lines at intersections */}
        <LowPolyStopLine position={[-12.5, 0, -3.5]} width={3} />
        <LowPolyStopLine position={[-7.5, 0, -3.5]} width={3} />
        <LowPolyStopLine position={[0.5, 0, -3.5]} width={3} />
        {/* Street lights at corners */}
        <StreetLights positions={[          
          [-15, 0, -1.5], [-15, 0, -9],
          [-5, 0, -1.5], [-5, 0, -9],
          [3, 0, -1.5], [3, 0, -9],
          [-22, 0, -5], [5, 0, -5],
        ]} />
        <FloatingParticles count={isMobile ? 6 : 20} area={25} height={6} color="#aaccff" speed={0.1} />
      </>)}
      {/* LOW POLY CITY: DRIVING PHASE MARKINGS */}
      {cityModel === 'low_poly' && phase === 'driving' && (<>
        {!isMobile && <><SpeedBump position={[-17, 0, -5.25]} width={3.5} />
        <SpeedBump position={[1, 0, -5.25]} width={3.5} /></>}
        {!isMobile && <><LowPolyTree position={[-24, 0, -2]} leafColor="#2d8a4e" scale={0.6} />
        <LowPolyTree position={[-24, 0, -8.5]} leafColor="#3aaf60" scale={0.6} />
        <LowPolyTree position={[6, 0, -2]} leafColor="#2d8a4e" scale={0.6} />
        <LowPolyTree position={[6, 0, -8.5]} leafColor="#3aaf60" scale={0.6} />
        <LowPolyTree position={[-9, 0, -1.5]} leafColor="#44bb66" scale={0.5} />
        <LowPolyTree position={[-9, 0, -9]} leafColor="#339955" scale={0.5} /></>}
      </>)}

      <Environment preset="city" background={false} />
    </>
  );
}

// ─── Exported Canvas ───────────────────────────────────────

export default function SimulationCanvas({
  onSpeedUpdate,
  waypoints,
  cameraMode,
  phase,
  onReady,
  onAerialComplete,
  onRoutePreviewComplete,
  onCollision,
  startPos,
  zoomLevel = 1,
  speedLimit,
  objectives,
  cityModel = 'default',
  trafficLights,
  aiVehicles,
  pedestrians,
}: {
  onSpeedUpdate: (speed: number, rpm: number) => void;
  waypoints: Waypoint[];
  cameraMode: 'thirdPerson' | 'cockpit';
  phase?: string;
  onReady?: () => void;
  onAerialComplete?: () => void;
  onRoutePreviewComplete?: () => void;
  onCollision?: (severity: 'MINOR' | 'WARNING' | 'MAJOR', point: THREE.Vector3) => void;
  startPos?: [number, number, number];
  zoomLevel?: number;
  speedLimit?: number;
  objectives?: { id: string; text: string; textRW: string; icon: string }[];
  cityModel?: 'default' | 'low_poly';
  trafficLights?: { position: [number, number, number]; rotation: number }[];
  aiVehicles?: { position: [number, number, number]; color: number; speed: number; path: [number, number, number][] }[];
  pedestrians?: { position: [number, number, number]; path: [number, number, number][]; speed: number }[];
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <Canvas
      shadows={isMobile ? false : 'soft'}
      camera={{ position: [0, 12, 20], fov: 60, near: 0.1, far: isMobile ? 300 : 500 }}
      gl={{
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: 'high-performance',
      }}
      dpr={isSmall ? [1, 1] : isMobile ? [1, 1.5] : [1, 2]}
      style={{ background: '#1a1e2a' }}
      onCreated={onReady}
    >
      <Suspense fallback={null}>
        <SceneContents
          onSpeedUpdate={onSpeedUpdate}
          waypoints={waypoints}
          cameraMode={cameraMode}
          phase={phase || 'loading'}
          onAerialComplete={onAerialComplete}
          onRoutePreviewComplete={onRoutePreviewComplete}
          onCollision={onCollision}
          startPos={startPos}
          zoomLevel={zoomLevel}
          speedLimit={speedLimit}
          objectives={objectives}
          cityModel={cityModel}
          trafficLights={trafficLights}
          aiVehicles={aiVehicles}
          pedestrians={pedestrians}
        />
      </Suspense>
    </Canvas>
  );
}
