// ============================================================
// ISHAMI SIMULATION — Day/Night Cycle & Weather
// Dynamic lighting, sky color, and weather effects
// ============================================================

import * as THREE from 'three';

export type WeatherType = 'clear' | 'rain' | 'fog' | 'overcast';

export interface TimeOfDayConfig {
  hour: number; // 0-24
  minute: number;
}

export class DayNightCycle {
  private directionalLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemisphereLight: THREE.HemisphereLight;
  private fog: THREE.Fog;
  private currentHour = 10; // start at 10 AM
  private timeSpeed = 1; // hours per minute of real time
  private weather: WeatherType = 'clear';
  private targetFogNear = 40;
  private targetFogFar = 180;

  constructor(
    directionalLight: THREE.DirectionalLight,
    ambientLight: THREE.AmbientLight,
    hemisphereLight: THREE.HemisphereLight,
    fog: THREE.Fog
  ) {
    this.directionalLight = directionalLight;
    this.ambientLight = ambientLight;
    this.hemisphereLight = hemisphereLight;
    this.fog = fog;
  }

  update(delta: number) {
    this.currentHour += delta * this.timeSpeed / 60;
    if (this.currentHour >= 24) this.currentHour -= 24;

    this.updateLighting();
    this.updateFog();
  }

  private updateLighting() {
    const hour = this.currentHour;

    // Sun position based on time
    const sunAngle = ((hour - 6) / 12) * Math.PI; // 6AM = sunrise, 6PM = sunset
    const sunHeight = Math.sin(sunAngle);
    const sunHorizontal = Math.cos(sunAngle);

    this.directionalLight.position.set(
      sunHorizontal * 20,
      Math.max(sunHeight * 15, 1),
      8
    );

    // Intensity based on time of day
    let intensity: number;
    if (hour >= 6 && hour < 8) {
      // Dawn
      intensity = THREE.MathUtils.lerp(0.3, 1.5, (hour - 6) / 2);
    } else if (hour >= 8 && hour < 17) {
      // Day
      intensity = 1.5;
    } else if (hour >= 17 && hour < 20) {
      // Dusk
      intensity = THREE.MathUtils.lerp(1.5, 0.3, (hour - 17) / 3);
    } else {
      // Night
      intensity = 0.15;
    }

    // Weather modifier
    if (this.weather === 'overcast') intensity *= 0.5;
    if (this.weather === 'rain') intensity *= 0.4;

    this.directionalLight.intensity = intensity;

    // Ambient light
    let ambientIntensity: number;
    if (hour >= 7 && hour < 18) {
      ambientIntensity = 0.5;
    } else if (hour >= 5 && hour < 7 || hour >= 18 && hour < 20) {
      ambientIntensity = 0.3;
    } else {
      ambientIntensity = 0.1;
    }

    this.ambientLight.intensity = ambientIntensity;

    // Sky colors based on time
    let skyColor: THREE.Color;
    let groundColor: THREE.Color;

    if (hour >= 6 && hour < 8) {
      // Dawn - warm orange
      const t = (hour - 6) / 2;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a1040),
        new THREE.Color(0x87ceeb),
        t
      );
      groundColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a0a20),
        new THREE.Color(0x8b7355),
        t
      );
    } else if (hour >= 8 && hour < 17) {
      // Day
      skyColor = new THREE.Color(0x87ceeb);
      groundColor = new THREE.Color(0x8b7355);
    } else if (hour >= 17 && hour < 20) {
      // Dusk - orange/red
      const t = (hour - 17) / 3;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x87ceeb),
        new THREE.Color(0xff6b35),
        t
      ).lerp(new THREE.Color(0x1a1040), t * 0.5);
      groundColor = new THREE.Color().lerpColors(
        new THREE.Color(0x8b7355),
        new THREE.Color(0x2a1a0a),
        t
      );
    } else {
      // Night
      skyColor = new THREE.Color(0x0a0a1a);
      groundColor = new THREE.Color(0x0a0a0a);
    }

    // Weather modifier
    if (this.weather === 'overcast' || this.weather === 'rain') {
      skyColor.lerp(new THREE.Color(0x4a5568), 0.5);
    }

    this.hemisphereLight.color.copy(skyColor);
    this.hemisphereLight.groundColor.copy(groundColor);

    // Directional light color
    if (hour >= 6 && hour < 8) {
      this.directionalLight.color.set(0xffaa66);
    } else if (hour >= 17 && hour < 20) {
      this.directionalLight.color.set(0xff8844);
    } else if (hour >= 8 && hour < 17) {
      this.directionalLight.color.set(0xddeeff);
    } else {
      this.directionalLight.color.set(0x4466aa);
    }
  }

  private updateFog() {
    let near = 40;
    let far = 180;

    if (this.weather === 'fog') {
      near = 10;
      far = 60;
    } else if (this.weather === 'rain') {
      near = 20;
      far = 100;
    } else if (this.weather === 'overcast') {
      near = 30;
      far = 140;
    }

    // Night fog
    if (this.currentHour < 6 || this.currentHour > 20) {
      near *= 0.7;
      far *= 0.7;
    }

    this.targetFogNear = near;
    this.targetFogFar = far;

    this.fog.near += (this.targetFogNear - this.fog.near) * 0.02;
    this.fog.far += (this.targetFogFar - this.fog.far) * 0.02;

    // Fog color follows sky
    if (this.currentHour >= 8 && this.currentHour < 17) {
      this.fog.color.set(0x87ceeb);
    } else if (this.currentHour >= 17 && this.currentHour < 20) {
      this.fog.color.set(0xff6b35);
    } else {
      this.fog.color.set(0x0a0a1a);
    }
  }

  setHour(hour: number) {
    this.currentHour = hour % 24;
  }

  setWeather(weather: WeatherType) {
    this.weather = weather;
  }

  getHour(): number {
    return this.currentHour;
  }

  getWeather(): WeatherType {
    return this.weather;
  }

  isNight(): boolean {
    return this.currentHour < 6 || this.currentHour > 20;
  }

  getTimeString(): string {
    const h = Math.floor(this.currentHour);
    const m = Math.floor((this.currentHour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
}

// ─── Rain Effect ──────────────────────────────────────────

export class RainEffect {
  private particles: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private positions: Float32Array;
  private velocities: Float32Array;
  private count: number;
  private active = false;
  private updateAccumulator = 0;
  private readonly isMobile: boolean;

  constructor(count?: number) {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaultCount = this.isMobile ? 300 : 800;
    const particleCount = count ?? defaultCount;
    this.count = particleCount;
    this.positions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      this.resetDrop(i);
      this.positions[i * 3 + 1] = Math.random() * 30;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0xaabbcc,
      size: 0.1,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.particles.visible = false;
  }

  private resetDrop(i: number) {
    this.positions[i * 3] = (Math.random() - 0.5) * 80;
    this.positions[i * 3 + 1] = 25 + Math.random() * 10;
    this.positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    this.velocities[i * 3] = (Math.random() - 0.5) * 0.5;
    this.velocities[i * 3 + 1] = -(15 + Math.random() * 10);
    this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  setActive(active: boolean) {
    this.active = active;
    this.particles.visible = active;
  }

  update(delta: number, playerPosition?: THREE.Vector3) {
    if (!this.active) return;

    const updateInterval = this.isMobile ? 2 / 60 : 1 / 60;
    this.updateAccumulator += delta;

    if (this.updateAccumulator < updateInterval) {
      if (playerPosition) {
        this.particles.position.x = playerPosition.x;
        this.particles.position.z = playerPosition.z;
      }
      return;
    }

    const steppedDelta = this.updateAccumulator;
    this.updateAccumulator = 0;

    for (let i = 0; i < this.count; i++) {
      this.positions[i * 3] += this.velocities[i * 3] * steppedDelta;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * steppedDelta;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * steppedDelta;

      if (this.positions[i * 3 + 1] < 0) {
        this.resetDrop(i);
      }
    }

    if (playerPosition) {
      this.particles.position.x = playerPosition.x;
      this.particles.position.z = playerPosition.z;
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  getObject(): THREE.Points {
    return this.particles;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
