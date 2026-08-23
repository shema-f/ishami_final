// ============================================================
// ISHAMI SIMULATION — Collision Detection System
// Only collides with actual buildings and walls, not road surface
// ============================================================

import * as THREE from 'three';

export interface Collider {
  id: string;
  type: 'box' | 'sphere' | 'cylinder';
  position: THREE.Vector3;
  size: THREE.Vector3;       // for box: half-extents
  radius: number;            // for sphere/cylinder
  height: number;            // for cylinder
  isStatic: boolean;
}

export interface CollisionResult {
  hit: boolean;
  collider: Collider | null;
  severity: 'MINOR' | 'WARNING' | 'MAJOR';
  penetrationDepth: number;
  contactPoint: THREE.Vector3;
}

export class CollisionSystem {
  private colliders: Collider[] = [];
  private playerRadius = 1.2; // car bounding radius — slightly larger for safety

  addCollider(collider: Collider) {
    this.colliders.push(collider);
  }

  removeCollider(id: string) {
    this.colliders = this.colliders.filter(c => c.id !== id);
  }

  clear() {
    this.colliders = [];
  }

  // Auto-generate colliders from a GLTF scene
  // Only creates colliders for BUILDINGS and WALLS — skips roads, bumps, curbs
  generateFromScene(scene: THREE.Object3D, prefix = 'building') {
    let idx = 0;
    scene.traverse((child) => {
      if (!child.isMesh) return;

      // Skip waypoints and other non-collidable objects
      if (child.userData?.isWaypoint || child.parent?.userData?.isWaypoint) return;

      const box = new THREE.Box3().setFromObject(child);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // ─── FILTER: Only collide with buildings/walls ───

      // 1. Must be tall enough to be a building (at least 2m)
      if (size.y < 2.0) return;

      // 2. Must be wide enough to be a wall/building (at least 1.5m in X or Z)
      if (size.x < 1.5 && size.z < 1.5) return;

      // 3. Must NOT be too flat/short in any dimension (skip ground plates, road bumps)
      if (size.y < 1.0) return;

      // 4. Skip objects that are mostly horizontal (flat planes, roads)
      // Buildings are tall — ratio of height to footprint should be meaningful
      const footprint = Math.max(size.x, size.z);
      const heightRatio = size.y / (footprint || 1);
      if (heightRatio < 0.15) return; // Skip very flat objects (roads, ground)

      // 5. Must be positioned above ground (center Y > 0 means it's a wall/building)
      // Ground-level objects are roads/surfaces
      if (center.y < 0.5) return;

      // 6. Skip very large flat objects (ground plane, entire road network)
      if (size.x > 100 || size.z > 100) return;

      this.addCollider({
        id: `${prefix}_${idx++}`,
        type: 'box',
        position: center,
        size: new THREE.Vector3(size.x * 0.5, size.y * 0.5, size.z * 0.5),
        radius: 0,
        height: 0,
        isStatic: true,
      });
    });
  }

  // Check collision at a position
  checkCollision(position: THREE.Vector3, velocity: THREE.Vector3, delta: number): CollisionResult {
    const result: CollisionResult = {
      hit: false,
      collider: null,
      severity: 'MINOR',
      penetrationDepth: 0,
      contactPoint: position.clone(),
    };

    const futurePos = position.clone().add(velocity.clone().multiplyScalar(delta));

    for (const collider of this.colliders) {
      if (collider.type === 'box') {
        const collision = this.checkBoxCollision(futurePos, collider);
        if (collision.hit) {
          // Only report collision if the car is actually at the same height as the building
          // If the car Y is much lower than the collider center, it's just driving past
          const carY = position.y;
          const colliderBottom = collider.position.y - collider.size.y;
          if (carY < colliderBottom - 1) continue; // Car is below the building, skip

          const speed = velocity.length();
          let severity: 'MINOR' | 'WARNING' | 'MAJOR' = 'MINOR';
          if (speed > 8) severity = 'WARNING';
          if (speed > 18) severity = 'MAJOR';

          result.hit = true;
          result.collider = collider;
          result.severity = severity;
          result.penetrationDepth = collision.depth;
          result.contactPoint = collision.contactPoint;
          break;
        }
      } else if (collider.type === 'sphere') {
        const dist = futurePos.distanceTo(collider.position);
        if (dist < this.playerRadius + collider.radius) {
          const speed = velocity.length();
          let severity: 'MINOR' | 'WARNING' | 'MAJOR' = 'MINOR';
          if (speed > 8) severity = 'WARNING';
          if (speed > 18) severity = 'MAJOR';

          result.hit = true;
          result.collider = collider;
          result.severity = severity;
          result.penetrationDepth = (this.playerRadius + collider.radius) - dist;
          result.contactPoint = futurePos.clone().lerp(collider.position, 0.5);
          break;
        }
      }
    }

    return result;
  }

  private checkBoxCollision(
    point: THREE.Vector3,
    collider: Collider
  ): { hit: boolean; depth: number; contactPoint: THREE.Vector3 } {
    const half = collider.size;
    const dx = Math.abs(point.x - collider.position.x);
    const dy = Math.abs(point.y - collider.position.y);
    const dz = Math.abs(point.z - collider.position.z);

    if (dx < half.x + this.playerRadius &&
        dy < half.y + this.playerRadius &&
        dz < half.z + this.playerRadius) {
      const overlapX = half.x + this.playerRadius - dx;
      const overlapZ = half.z + this.playerRadius - dz;

      const minOverlap = Math.min(overlapX, overlapZ);
      const contactPoint = point.clone();

      return { hit: true, depth: minOverlap, contactPoint };
    }

    return { hit: false, depth: 0, contactPoint: point };
  }

  // Get closest collider for proximity checks
  getClosest(position: THREE.Vector3): { collider: Collider; distance: number } | null {
    let closest: { collider: Collider; distance: number } | null = null;

    for (const collider of this.colliders) {
      let dist: number;
      if (collider.type === 'box') {
        dist = this.boxDistance(position, collider);
      } else {
        dist = position.distanceTo(collider.position) - collider.radius;
      }

      if (!closest || dist < closest.distance) {
        closest = { collider, distance: dist };
      }
    }

    return closest;
  }

  private boxDistance(point: THREE.Vector3, collider: Collider): number {
    const half = collider.size;
    const dx = Math.max(0, Math.abs(point.x - collider.position.x) - half.x);
    const dz = Math.max(0, Math.abs(point.z - collider.position.z) - half.z);
    return Math.sqrt(dx * dx + dz * dz);
  }
}
