// ============================================================
// ISHAMI SIMULATION — Aerial City Background
// Renders the real ISHAMI_CITY1.glb 3D city from a slow, high
// aerial orbit and uses it as the backdrop of the scenario
// selection screen (a "live aerial picture" of the 3D city).
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const CITY_MODEL_PATH = '/models/ISHAMI_CITY1.glb';
const CITY_SCALE = 0.75;
const CITY_CACHE_KEY = '__ishamiCityGltf';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

interface CityBounds {
  center: THREE.Vector3;
  radius: number; // fits the whole city — orbit just outside of it
}

// Load (and cache on window) so the heavy GLB is parsed only once per session,
// even when the in-game canvas loads it right after.
function loadCityGltf(onReady: (gltf: any, bounds: CityBounds) => void, onError: () => void): () => void {
  let cancelled = false;
  try {
    const cached = (window as any)[CITY_CACHE_KEY];
    if (cached?.gltf) {
      onReady(cached.gltf, cached.bounds);
      return () => { cancelled = true; };
    }
  } catch { /* ignore */ }

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    CITY_MODEL_PATH,
    (gltf) => {
      if (cancelled) return;
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      // Measure where the city actually sits so the orbit always frames it.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3()).multiplyScalar(CITY_SCALE);
      const size = box.getSize(new THREE.Vector3()).length();
      const bounds: CityBounds = { center, radius: Math.max(30, (size * CITY_SCALE) / 2) };
      try {
        (window as any)[CITY_CACHE_KEY] = { gltf, bounds };
      } catch { /* ignore */ }
      onReady(gltf, bounds);
    },
    undefined,
    (err) => {
      console.error('Failed to load ISHAMI city GLB:', err);
      if (!cancelled) onError();
    }
  );
  return () => { cancelled = true; };
}

// ─── Slow aerial orbit camera ─────────────────────────────

function AerialOrbitCamera({ bounds }: { bounds: CityBounds }) {
  const { camera } = useThree();
  const angle = useRef(Math.PI * 0.35);
  const altitude = useRef(0);

  useEffect(() => {
    camera.near = 0.5;
    camera.far = 2000;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = Math.min(delta, 0.05);
    angle.current += speed * 0.05; // slow cinematic circle

    const c = bounds.center;
    const radius = bounds.radius * 2.1;
    const targetAlt = Math.max(35, bounds.radius * 0.95 + 30);
    // gentle breathing + tilt so it feels like a drone flyover
    altitude.current += (targetAlt + Math.sin(t * 0.1) * (targetAlt * 0.15) - altitude.current) * 0.012;

    const x = c.x + Math.cos(angle.current) * radius;
    const z = c.z + Math.sin(angle.current) * radius;
    camera.position.lerp(new THREE.Vector3(x, altitude.current, z), 0.035);
    camera.lookAt(c.x, c.y + 8, c.z);
  });

  return null;
}

function CityRig({ gltf }: { gltf: any }) {
  const scene = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!gltf || !scene.current) return;
    scene.current.clear();
    const clone = gltf.scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    scene.current.add(clone);
  }, [gltf]);

  return <group ref={scene} scale={[CITY_SCALE, CITY_SCALE, CITY_SCALE]} />;
}

function CityLights() {
  return (
    <>
      <ambientLight color="#7a93c9" intensity={0.95} />
      <directionalLight position={[120, 220, 60]} color="#ffffff" intensity={1.15} />
      <directionalLight position={[-90, 130, -90]} color="#93b8ff" intensity={0.5} />
      <hemisphereLight skyColor="#8fb0ff" groundColor="#16202f" intensity={0.6} />
    </>
  );
}

function AerialScene({ gltf, bounds }: { gltf: any; bounds: CityBounds }) {
  return (
    <>
      <CityLights />
      <CityRig gltf={gltf} />
      <AerialOrbitCamera bounds={bounds} />
    </>
  );
}

/**
 * Full-viewport fixed background: the ISHAMI 3D city from above, gently
 * drifting. Shows a navy "grid" fallback while the model streams in, so the
 * page is always usable.
 */
export default function AerialCityBackground() {
  const [city, setCity] = useState<{ gltf: any; bounds: CityBounds } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    dispose = loadCityGltf(
      (gltf, bounds) => setCity({ gltf, bounds }),
      () => setFailed(true)
    );
    return () => { dispose?.(); };
  }, []);

  const initialCamera = useMemo(() => {
    if (!city) return { position: [160, 90, -220] as [number, number, number] };
    const c = city.bounds.center;
    const r = city.bounds.radius * 2.1;
    return {
      position: [c.x + Math.cos(Math.PI * 0.35) * r, Math.max(45, city.bounds.radius + 30), c.z + Math.sin(Math.PI * 0.35) * r] as [number, number, number],
    };
  }, [city]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Fallback navy grid backdrop (always drawn under the canvas) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 700px at 70% 20%, #0e2a4d 0%, #0a1628 45%, #060b16 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0 26px, #6fb7ff 26px 28px), repeating-linear-gradient(-45deg, transparent 0 26px, #6fb7ff 26px 28px)',
        }}
      />

      {/* Live 3D city — fade in once loaded */}
      {(city || failed) && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: city && !failed ? 1 : 0 }}
        >
          <Canvas
            dpr={[0.5, 1.2]}
            gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
            camera={{ position: initialCamera.position, fov: 50, near: 0.5, far: 2000 }}
            style={{ background: 'transparent' }}
          >
            <fog attach="fog" args={['#0a1628', 500, 1600]} />
            {city && <AerialScene gltf={city.gltf} bounds={city.bounds} />}
          </Canvas>
        </div>
      )}

      {/* Soft loading shimmer while the city streams in */}
      {!city && !failed && (
        <div className="absolute inset-0 flex items-end justify-center pb-24">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-md">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/80 font-semibold">
              Loading city…
            </span>
          </div>
        </div>
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04070f]/80 via-[#04070f]/35 to-[#04070f]/70" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04070f]/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04070f]/85 to-transparent" />
    </div>
  );
}
