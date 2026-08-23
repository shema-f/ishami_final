// ============================================================
// ISHAMI SIMULATION — Particle Effects System
// Exhaust smoke, tire marks, dust clouds, and sparks
// ============================================================

import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  opacity: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private opacities: Float32Array;
  private maxParticles: number;

  constructor(maxParticles = 500) {
    this.maxParticles = maxParticles;
    this.positions = new Float32Array(maxParticles * 3);
    this.colors = new Float32Array(maxParticles * 3);
    this.sizes = new Float32Array(maxParticles);
    this.opacities = new Float32Array(maxParticles);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  getObject(): THREE.Points {
    return this.points;
  }

  emitExhaust(position: THREE.Vector3, speed: number, rpm: number) {
    if (this.particles.length >= this.maxParticles) return;

    const intensity = Math.min(speed / 30 + rpm / 6500, 1);
    const count = Math.ceil(intensity * 3);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: position.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            0.2 + Math.random() * 0.1,
            -0.5 + Math.random() * 0.2
          )
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          0.5 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.3
        ),
        life: 0,
        maxLife: 0.8 + Math.random() * 0.6,
        size: 0.15 + Math.random() * 0.2,
        color: new THREE.Color(0.6, 0.6, 0.65),
        opacity: 0.4 + intensity * 0.3,
      });
    }
  }

  emitTireSmoke(position: THREE.Vector3, intensity: number) {
    if (this.particles.length >= this.maxParticles) return;

    const count = Math.ceil(intensity * 5);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: position.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0.05,
            (Math.random() - 0.5) * 0.5
          )
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 1.0,
          0.8 + Math.random() * 0.5,
          (Math.random() - 0.5) * 1.0
        ),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.5,
        size: 0.3 + Math.random() * 0.3,
        color: new THREE.Color(0.8, 0.8, 0.75),
        opacity: 0.5 * intensity,
      });
    }
  }

  emitDust(position: THREE.Vector3, speed: number) {
    if (this.particles.length >= this.maxParticles) return;

    const count = Math.ceil(Math.min(speed / 20, 3));

    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: position.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            0.02,
            (Math.random() - 0.5) * 1.5
          )
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          0.3 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.8
        ),
        life: 0,
        maxLife: 1.0 + Math.random() * 1.0,
        size: 0.2 + Math.random() * 0.4,
        color: new THREE.Color(0.55, 0.5, 0.4),
        opacity: 0.25,
      });
    }
  }

  emitSparks(position: THREE.Vector3) {
    if (this.particles.length >= this.maxParticles) return;

    for (let i = 0; i < 15; i++) {
      this.particles.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          1 + Math.random() * 3,
          (Math.random() - 0.5) * 4
        ),
        life: 0,
        maxLife: 0.3 + Math.random() * 0.4,
        size: 0.05 + Math.random() * 0.08,
        color: new THREE.Color(1.0, 0.8 + Math.random() * 0.2, 0.2),
        opacity: 1.0,
      });
    }
  }

  update(delta: number) {
    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      p.velocity.y -= 0.5 * delta; // gravity
      p.position.add(p.velocity.clone().multiplyScalar(delta));

      // Fade
      const lifeRatio = p.life / p.maxLife;
      p.opacity = p.opacity * (1 - lifeRatio * 0.8);
      p.size = p.size * (1 + lifeRatio * 0.5);
    }

    // Update buffers
    for (let i = 0; i < this.maxParticles; i++) {
      if (i < this.particles.length) {
        const p = this.particles[i];
        this.positions[i * 3] = p.position.x;
        this.positions[i * 3 + 1] = p.position.y;
        this.positions[i * 3 + 2] = p.position.z;
        this.colors[i * 3] = p.color.r;
        this.colors[i * 3 + 1] = p.color.g;
        this.colors[i * 3 + 2] = p.color.b;
        this.sizes[i] = p.size;
      } else {
        this.positions[i * 3] = 0;
        this.positions[i * 3 + 1] = -100;
        this.positions[i * 3 + 2] = 0;
        this.sizes[i] = 0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// ─── Tire Mark System ─────────────────────────────────────

export class TireMarkSystem {
  private marks: { position: THREE.Vector3; alpha: number }[] = [];
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;
  private maxMarks = 200;

  constructor() {
    this.geometry = new THREE.PlaneGeometry(0.3, 1.0);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.visible = false;
  }

  getObject(): THREE.Mesh {
    return this.mesh;
  }

  addMark(position: THREE.Vector3, rotation: number, intensity: number) {
    if (this.marks.length >= this.maxMarks) {
      this.marks.shift();
    }

    // Create a small plane at the tire position
    const markGeo = new THREE.PlaneGeometry(0.15 * intensity, 0.6);
    const markMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.2 * intensity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mark = new THREE.Mesh(markGeo, markMat);
    mark.rotation.x = -Math.PI / 2;
    mark.rotation.z = -rotation;
    mark.position.copy(position);
    mark.position.y = 0.01;

    this.mesh.parent?.add(mark);
    this.marks.push({ position: position.clone(), alpha: 0.2 * intensity });

    // Fade old marks
    if (this.marks.length > 50) {
      const old = this.marks.shift();
      if (old) {
        // Find and remove the mesh
      }
    }
  }

  update(delta: number) {
    // Marks fade very slowly
    this.material.opacity = 0.35;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
