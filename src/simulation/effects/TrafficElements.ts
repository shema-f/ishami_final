// ============================================================
// ISHAMI SIMULATION — Traffic Elements
// Traffic lights, AI vehicles, and pedestrians
// ============================================================

import * as THREE from 'three';

// ─── Traffic Light ────────────────────────────────────────

export interface TrafficLightConfig {
  position: [number, number, number];
  rotation: number;
  cycleDuration: number; // seconds per full cycle
  greenDuration: number;
  yellowDuration: number;
  redDuration: number;
}

export class TrafficLight {
  private group: THREE.Group;
  private state: 'red' | 'yellow' | 'green' = 'red';
  private timer = 0;
  private config: TrafficLightConfig;

  constructor(config: TrafficLightConfig) {
    this.config = config;
    this.group = this.createMesh();
    this.group.position.set(...config.position);
    this.group.rotation.y = config.rotation;
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 2;
    group.add(pole);

    // Housing
    const housingGeo = new THREE.BoxGeometry(0.4, 1.0, 0.3);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 4.2;
    group.add(housing);

    // Lights
    const lightGeo = new THREE.SphereGeometry(0.1, 12, 8);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0 });

    const redLight = new THREE.Mesh(lightGeo, redMat);
    redLight.position.set(0, 4.5, 0.16);
    redLight.name = 'red';
    group.add(redLight);

    const yellowLight = new THREE.Mesh(lightGeo, yellowMat);
    yellowLight.position.set(0, 4.2, 0.16);
    yellowLight.name = 'yellow';
    group.add(yellowLight);

    const greenLight = new THREE.Mesh(lightGeo, greenMat);
    greenLight.position.set(0, 3.9, 0.16);
    greenLight.name = 'green';
    group.add(greenLight);

    return group;
  }

  update(delta: number) {
    this.timer += delta;

    const { greenDuration, yellowDuration, redDuration } = this.config;
    const cycleTime = this.timer % (greenDuration + yellowDuration + redDuration);

    if (cycleTime < greenDuration) {
      this.setState('green');
    } else if (cycleTime < greenDuration + yellowDuration) {
      this.setState('yellow');
    } else {
      this.setState('red');
    }
  }

  private setState(newState: 'red' | 'yellow' | 'green') {
    if (this.state === newState) return;
    this.state = newState;

    this.group.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        if (child.name === newState) {
          child.material.emissiveIntensity = 2;
        } else {
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }

  getState(): 'red' | 'yellow' | 'green' {
    return this.state;
  }

  getObject(): THREE.Group {
    return this.group;
  }
}

// ─── AI Vehicle ───────────────────────────────────────────

export interface AIVehicleConfig {
  position: [number, number, number];
  rotation: number;
  speed: number;
  color: number;
  path: THREE.Vector3[];
}

export class AIVehicle {
  private group: THREE.Group;
  private config: AIVehicleConfig;
  private pathIndex = 0;
  private pathProgress = 0;
  private currentSpeed: number;

  constructor(config: AIVehicleConfig) {
    this.config = { ...config };
    this.currentSpeed = config.speed;
    this.group = this.createMesh();
    this.group.position.set(...config.position);
    this.group.rotation.y = config.rotation;
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 3.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.config.color,
      metalness: 0.6,
      roughness: 0.4,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    body.castShadow = true;
    group.add(body);

    // Roof
    const roofGeo = new THREE.BoxGeometry(1.3, 0.5, 1.5);
    const roofMat = new THREE.MeshStandardMaterial({
      color: this.config.color,
      metalness: 0.6,
      roughness: 0.4,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.05, -0.3);
    roof.castShadow = true;
    group.add(roof);

    // Headlights
    const headlightGeo = new THREE.SphereGeometry(0.08, 8, 6);
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffcc,
      emissiveIntensity: 1,
    });
    [-0.6, 0.6].forEach(x => {
      const light = new THREE.Mesh(headlightGeo, headlightMat);
      light.position.set(x, 0.5, 1.6);
      group.add(light);
    });

    // Tail lights
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5,
    });
    [-0.6, 0.6].forEach(x => {
      const light = new THREE.Mesh(headlightGeo, tailMat);
      light.position.set(x, 0.5, -1.6);
      group.add(light);
    });

    return group;
  }

  update(delta: number) {
    if (this.config.path.length < 2) return;

    const current = this.config.path[this.pathIndex];
    const next = this.config.path[(this.pathIndex + 1) % this.config.path.length];
    const direction = next.clone().sub(current);
    const segmentLength = direction.length();

    this.pathProgress += this.currentSpeed * delta;

    if (this.pathProgress >= segmentLength) {
      this.pathProgress -= segmentLength;
      this.pathIndex = (this.pathIndex + 1) % this.config.path.length;
    }

    const t = this.pathProgress / segmentLength;
    const pos = current.clone().lerp(next, t);

    this.group.position.copy(pos);

    // Face direction of travel
    const angle = Math.atan2(direction.x, direction.z);
    this.group.rotation.y = angle;
  }

  setSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  getPosition(): THREE.Vector3 {
    return this.group.position.clone();
  }

  getObject(): THREE.Group {
    return this.group;
  }
}

// ─── Pedestrian ───────────────────────────────────────────

export interface PedestrianConfig {
  position: [number, number, number];
  path: THREE.Vector3[];
  speed: number;
  skinColor: number;
  shirtColor: number;
}

export class Pedestrian {
  private group: THREE.Group;
  private config: PedestrianConfig;
  private pathIndex = 0;
  private pathProgress = 0;
  private walkCycle = 0;

  constructor(config: PedestrianConfig) {
    this.config = config;
    this.group = this.createMesh();
    this.group.position.set(...config.position);
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: this.config.shirtColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7;
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 8, 6);
    const headMat = new THREE.MeshStandardMaterial({ color: this.config.skinColor });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.15;
    group.add(head);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
    [-0.06, 0.06].forEach(x => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.2, 0);
      leg.name = x < 0 ? 'leftLeg' : 'rightLeg';
      group.add(leg);
    });

    return group;
  }

  update(delta: number) {
    if (this.config.path.length < 2) return;

    const current = this.config.path[this.pathIndex];
    const next = this.config.path[(this.pathIndex + 1) % this.config.path.length];
    const direction = next.clone().sub(current);
    const segmentLength = direction.length();

    this.pathProgress += this.config.speed * delta;

    if (this.pathProgress >= segmentLength) {
      this.pathProgress -= segmentLength;
      this.pathIndex = (this.pathIndex + 1) % this.config.path.length;
    }

    const t = this.pathProgress / segmentLength;
    const pos = current.clone().lerp(next, t);
    this.group.position.copy(pos);

    // Face direction
    const angle = Math.atan2(direction.x, direction.z);
    this.group.rotation.y = angle;

    // Walk animation
    this.walkCycle += delta * 8;
    this.group.children.forEach(child => {
      if (child.name === 'leftLeg') {
        child.rotation.x = Math.sin(this.walkCycle) * 0.3;
      } else if (child.name === 'rightLeg') {
        child.rotation.x = -Math.sin(this.walkCycle) * 0.3;
      }
    });
  }

  getObject(): THREE.Group {
    return this.group;
  }
}

// ─── Road Sign ────────────────────────────────────────────

export class RoadSign {
  private group: THREE.Group;

  constructor(
    type: 'stop' | 'yield' | 'speed_limit' | 'pedestrian' | 'warning',
    position: [number, number, number],
    rotation: number = 0,
    value?: number
  ) {
    this.group = this.createSign(type, value);
    this.group.position.set(...position);
    this.group.rotation.y = rotation;
  }

  private createSign(type: string, value?: number): THREE.Group {
    const group = new THREE.Group();

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.25;
    group.add(pole);

    // Sign face
    let signGeo: THREE.BufferGeometry;
    let signColor: number;

    switch (type) {
      case 'stop':
        signGeo = new THREE.BoxGeometry(0.6, 0.6, 0.05);
        signColor = 0xef4444;
        break;
      case 'yield':
        signGeo = new THREE.ConeGeometry(0.35, 0.6, 3);
        signColor = 0xf59e0b;
        break;
      case 'speed_limit':
        signGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
        signColor = 0xffffff;
        break;
      case 'pedestrian':
        signGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        signColor = 0xfbbf24;
        break;
      default:
        signGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        signColor = 0xfbbf24;
    }

    const signMat = new THREE.MeshStandardMaterial({ color: signColor });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.y = 2.6;
    if (type === 'speed_limit') {
      sign.rotation.x = Math.PI / 2;
    }
    group.add(sign);

    return group;
  }

  getObject(): THREE.Group {
    return this.group;
  }
}
