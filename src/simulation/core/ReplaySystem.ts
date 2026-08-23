// ============================================================
// ISHAMI SIMULATION — Replay & Ghost Car System
// Records position data and renders ghost car from best run
// ============================================================

import * as THREE from 'three';

export interface ReplayFrame {
  time: number;
  position: [number, number, number];
  rotation: number;
  speed: number;
  gear: string;
}

export interface ReplayData {
  scenarioId: string;
  score: number;
  frames: ReplayFrame[];
  duration: number;
}

const STORAGE_KEY_PREFIX = 'ishami.replay.';
const MAX_FRAMES = 6000; // ~10 minutes at 10 fps

export class ReplayRecorder {
  private frames: ReplayFrame[] = [];
  private startTime = 0;
  private isRecording = false;
  private frameInterval = 100; // record every 100ms = 10fps

  start() {
    this.frames = [];
    this.startTime = Date.now();
    this.isRecording = true;
  }

  recordFrame(
    position: THREE.Vector3,
    rotation: number,
    speed: number,
    gear: string
  ) {
    if (!this.isRecording) return;
    if (this.frames.length >= MAX_FRAMES) return;

    const now = Date.now();
    if (this.frames.length > 0) {
      const lastFrame = this.frames[this.frames.length - 1];
      if (now - this.startTime - (lastFrame.time * 1000) < this.frameInterval) return;
    }

    this.frames.push({
      time: (now - this.startTime) / 1000,
      position: [position.x, position.y, position.z],
      rotation,
      speed,
      gear,
    });
  }

  stop(): ReplayData | null {
    this.isRecording = false;
    if (this.frames.length === 0) return null;

    return {
      scenarioId: '',
      score: 0,
      frames: this.frames,
      duration: this.frames[this.frames.length - 1].time,
    };
  }

  getFrameCount(): number {
    return this.frames.length;
  }
}

export class GhostCar {
  private replayData: ReplayData | null = null;
  private currentPosition = new THREE.Vector3();
  private currentRotation = 0;
  private currentTime = 0;
  private isActive = false;
  private ghostMesh: THREE.Group | null = null;
  private trailPositions: THREE.Vector3[] = [];
  private trailMaxPositions = 50;

  constructor() {
    this.createGhostMesh();
  }

  private createGhostMesh() {
    this.ghostMesh = new THREE.Group();

    // Ghost car body - translucent blue
    const bodyGeo = new THREE.BoxGeometry(1.8, 0.6, 3.5);
    const bodyMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    this.ghostMesh.add(body);

    // Roof
    const roofGeo = new THREE.BoxGeometry(1.5, 0.5, 1.8);
    const roofMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.05;
    roof.position.z = -0.2;
    this.ghostMesh.add(roof);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 8);
    const wheelMat = new THREE.MeshBasicMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.3,
    });

    const wheelPositions = [
      [-0.85, 0.25, 1.1],
      [0.85, 0.25, 1.1],
      [-0.85, 0.25, -1.1],
      [0.85, 0.25, -1.1],
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      this.ghostMesh!.add(wheel);
    });

    // Glowing outline
    const outlineGeo = new THREE.BoxGeometry(1.9, 0.7, 3.6);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    outline.position.y = 0.5;
    this.ghostMesh.add(outline);

    // Trail line
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
    });

    this.ghostMesh.visible = false;
  }

  loadReplay(data: ReplayData) {
    this.replayData = data;
    this.currentTime = 0;
    this.isActive = true;
    this.trailPositions = [];

    if (this.replayData.frames.length > 0) {
      const frame = this.replayData.frames[0];
      this.currentPosition.set(...frame.position);
      this.currentRotation = frame.rotation;
    }

    if (this.ghostMesh) {
      this.ghostMesh.visible = true;
      this.ghostMesh.position.copy(this.currentPosition);
      this.ghostMesh.rotation.y = this.currentRotation;
    }
  }

  update(delta: number): boolean {
    if (!this.isActive || !this.replayData) return false;

    this.currentTime += delta;

    // Find the right frame
    const frames = this.replayData.frames;
    let frameIndex = 0;

    for (let i = 0; i < frames.length; i++) {
      if (frames[i].time <= this.currentTime) {
        frameIndex = i;
      } else {
        break;
      }
    }

    if (frameIndex >= frames.length - 1) {
      this.isActive = false;
      if (this.ghostMesh) this.ghostMesh.visible = false;
      return false; // replay finished
    }

    // Interpolate between frames
    const frameA = frames[frameIndex];
    const frameB = frames[Math.min(frameIndex + 1, frames.length - 1)];
    const t = frameA.time === frameB.time ? 0 :
      (this.currentTime - frameA.time) / (frameB.time - frameA.time);

    this.currentPosition.lerpVectors(
      new THREE.Vector3(...frameA.position),
      new THREE.Vector3(...frameB.position),
      t
    );
    this.currentRotation = THREE.MathUtils.lerp(frameA.rotation, frameB.rotation, t);

    // Update ghost mesh
    if (this.ghostMesh) {
      this.ghostMesh.position.copy(this.currentPosition);
      this.ghostMesh.rotation.y = this.currentRotation;
      this.ghostMesh.visible = true;

      // Pulse effect
      const pulse = Math.sin(this.currentTime * 3) * 0.05 + 1;
      this.ghostMesh.scale.setScalar(pulse);
    }

    // Update trail
    this.trailPositions.push(this.currentPosition.clone());
    if (this.trailPositions.length > this.trailMaxPositions) {
      this.trailPositions.shift();
    }

    return true;
  }

  getMesh(): THREE.Group | null {
    return this.ghostMesh;
  }

  getPosition(): THREE.Vector3 {
    return this.currentPosition.clone();
  }

  isActive(): boolean {
    return this.isActive;
  }

  stop() {
    this.isActive = false;
    if (this.ghostMesh) this.ghostMesh.visible = false;
  }

  dispose() {
    this.ghostMesh?.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  }
}

// ─── Storage helpers ──────────────────────────────────────

export function saveGhostReplay(scenarioId: string, replay: ReplayData) {
  try {
    const key = STORAGE_KEY_PREFIX + scenarioId;
    // Only save if better than existing
    const existing = loadGhostReplay(scenarioId);
    if (!existing || replay.score > existing.score) {
      replay.scenarioId = scenarioId;
      // Compress: only save every 5th frame
      const compressed = {
        ...replay,
        frames: replay.frames.filter((_, i) => i % 5 === 0),
      };
      localStorage.setItem(key, JSON.stringify(compressed));
    }
  } catch {}
}

export function loadGhostReplay(scenarioId: string): ReplayData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + scenarioId);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}
