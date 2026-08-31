// ============================================================
// ISHAMI SIMULATION — Road Boundary System
// Defines road segments and enforces car stays on roads
// ============================================================

import * as THREE from 'three';

export interface RoadSegment {
  id: string;
  // Bounding box of the road segment
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  // Half-width of the road (how wide the drivable area is)
  halfWidth: number;
  // Orientation: 'horizontal' = runs along X axis, 'vertical' = runs along Z axis
  orientation: 'horizontal' | 'vertical';
}

export interface RoadBoundaryResult {
  onRoad: boolean;
  nearestPoint: THREE.Vector3;
  distance: number;
  segment: RoadSegment | null;
}

export class RoadBoundarySystem {
  private segments: RoadSegment[] = [];
  private padding = 1.5; // extra padding around road edges for car body

  constructor() {
    this.segments = [];
  }

  /**
   * Define road segments for the LOW POLY city model.
   * Roads are at:
   *   Main horizontal: x=[-25, 5], z=-3.5 and z=-7 (width=3.5 each)
   *   Side roads: x=-15, x=-5, x=3, z=[-7, -3.5] (width=3.5 each)
   */
  static createLowPolyRoads(): RoadBoundarySystem {
    const system = new RoadBoundarySystem();
    const roadWidth = 3.5;
    const halfWidth = roadWidth / 2;

    // Main horizontal road — top lane (z = -3.5)
    system.addSegment({
      id: 'main_top',
      minX: -25, maxX: 5,
      minZ: -3.5 - halfWidth, maxZ: -3.5 + halfWidth,
      halfWidth,
      orientation: 'horizontal',
    });

    // Main horizontal road — bottom lane (z = -7)
    system.addSegment({
      id: 'main_bottom',
      minX: -25, maxX: 5,
      minZ: -7 - halfWidth, maxZ: -7 + halfWidth,
      halfWidth,
      orientation: 'horizontal',
    });

    // Side roads connecting the two lanes
    const sideRoadXPositions = [-15, -5, 3];
    for (const x of sideRoadXPositions) {
      system.addSegment({
        id: `side_${x}`,
        minX: x - halfWidth, maxX: x + halfWidth,
        minZ: -7 - halfWidth, maxZ: -3.5 + halfWidth,
        halfWidth,
        orientation: 'vertical',
      });
    }

    return system;
  }

  /**
   * Create road segments dynamically from a list of waypoints.
   * Each pair of consecutive waypoints becomes a road segment
   * (a rectangular bounding box connecting them), and the loop is closed
   * from the last waypoint back to the first.
   *
   * This ensures ANY scenario's car starts on a road, regardless of
   * where in the city the waypoints are.
   */
  static createFromWaypoints(
    waypoints: [number, number, number][],
    roadWidth: number = 8
  ): RoadBoundarySystem {
    const system = new RoadBoundarySystem();
    const halfWidth = roadWidth / 2;

    if (waypoints.length < 2) return system;

    for (let i = 0; i < waypoints.length; i++) {
      const [x1, _y1, z1] = waypoints[i];
      const [x2, _y2, z2] = waypoints[(i + 1) % waypoints.length];

      const isHorizontal = Math.abs(x2 - x1) >= Math.abs(z2 - z1);

      if (isHorizontal) {
        // Road runs roughly along the X axis
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const midZ = (z1 + z2) / 2;
        system.addSegment({
          id: `wp_road_h_${i}`,
          minX: minX - halfWidth,
          maxX: maxX + halfWidth,
          minZ: midZ - halfWidth,
          maxZ: midZ + halfWidth,
          halfWidth,
          orientation: 'horizontal',
        });
      } else {
        // Road runs roughly along the Z axis
        const midX = (x1 + x2) / 2;
        const minZ = Math.min(z1, z2);
        const maxZ = Math.max(z1, z2);
        system.addSegment({
          id: `wp_road_v_${i}`,
          minX: midX - halfWidth,
          maxX: midX + halfWidth,
          minZ: minZ - halfWidth,
          maxZ: maxZ + halfWidth,
          halfWidth,
          orientation: 'vertical',
        });
      }
    }

    return system;
  }

  /**
   * Define road segments for the DEFAULT city model (ISHAMI_CITY1).
   * @deprecated Use createFromWaypoints() instead for scenario-aware roads.
   */
  static createDefaultCityRoads(): RoadBoundarySystem {
    // Fallback: create from the GuidedStart waypoints
    return RoadBoundarySystem.createFromWaypoints([
      [68, 0, -126],
      [68, 0, -162],
      [108, 0, -162],
      [144, 0, -162],
      [144, 0, -126],
      [144, 0, -90],
      [108, 0, -90],
      [68, 0, -90],
    ], 8);
  }

  addSegment(segment: RoadSegment) {
    this.segments.push(segment);
  }

  /**
   * Check if a world position is on any road segment.
   * Accounts for the car's bounding radius.
   */
  isOnRoad(x: number, z: number, carRadius: number = 1.5): boolean {
    const effectiveRadius = carRadius + this.padding;

    for (const seg of this.segments) {
      if (
        x >= seg.minX - effectiveRadius &&
        x <= seg.maxX + effectiveRadius &&
        z >= seg.minZ - effectiveRadius &&
        z <= seg.maxZ + effectiveRadius
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get detailed boundary check result for a position.
   */
  checkPosition(x: number, z: number, carRadius: number = 1.5): RoadBoundaryResult {
    const effectiveRadius = carRadius + this.padding;

    for (const seg of this.segments) {
      // Check if position is within the road segment bounds (with padding)
      if (
        x >= seg.minX - effectiveRadius &&
        x <= seg.maxX + effectiveRadius &&
        z >= seg.minZ - effectiveRadius &&
        z <= seg.maxZ + effectiveRadius
      ) {
        // Clamp to road bounds
        const clampedX = Math.max(seg.minX, Math.min(seg.maxX, x));
        const clampedZ = Math.max(seg.minZ, Math.min(seg.maxZ, z));

        return {
          onRoad: true,
          nearestPoint: new THREE.Vector3(clampedX, 0, clampedZ),
          distance: 0,
          segment: seg,
        };
      }
    }

    // Find nearest point on any road segment
    let nearestDist = Infinity;
    let nearestPoint = new THREE.Vector3(x, 0, z);
    let nearestSeg: RoadSegment | null = null;

    for (const seg of this.segments) {
      const clampedX = Math.max(seg.minX, Math.min(seg.maxX, x));
      const clampedZ = Math.max(seg.minZ, Math.min(seg.maxZ, z));
      const dist = Math.sqrt((x - clampedX) ** 2 + (z - clampedZ) ** 2);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPoint = new THREE.Vector3(clampedX, 0, clampedZ);
        nearestSeg = seg;
      }
    }

    return {
      onRoad: false,
      nearestPoint,
      distance: nearestDist,
      segment: nearestSeg,
    };
  }

  /**
   * Constrain a position to stay within road boundaries.
   * Returns the corrected position.
   */
  constrainToRoad(
    currentX: number,
    currentZ: number,
    newX: number,
    newZ: number,
    carRadius: number = 1.5
  ): { x: number; z: number; constrained: boolean } {
    const effectiveRadius = carRadius + this.padding;

    // Check if the new position is on any road
    for (const seg of this.segments) {
      if (
        newX >= seg.minX - effectiveRadius &&
        newX <= seg.maxX + effectiveRadius &&
        newZ >= seg.minZ - effectiveRadius &&
        newZ <= seg.maxZ + effectiveRadius
      ) {
        // Position is valid on this road segment
        return { x: newX, z: newZ, constrained: false };
      }
    }

    // Not on any road — try to find the closest road and snap to it
    let bestX = newX;
    let bestZ = newZ;
    let bestDist = Infinity;
    let foundRoad = false;

    for (const seg of this.segments) {
      // Find closest point on this segment's bounds (with radius tolerance)
      const clampedX = Math.max(seg.minX, Math.min(seg.maxX, newX));
      const clampedZ = Math.max(seg.minZ, Math.min(seg.maxZ, newZ));
      const dist = Math.sqrt((newX - clampedX) ** 2 + (newZ - clampedZ) ** 2);

      if (dist < bestDist) {
        bestDist = dist;
        bestX = clampedX;
        bestZ = clampedZ;
        foundRoad = true;
      }
    }

    if (foundRoad) {
      return { x: bestX, z: bestZ, constrained: true };
    }

    // No roads at all — return current position (don't move)
    return { x: currentX, z: currentZ, constrained: true };
  }

  /**
   * Find the closest road edge from a point, useful for push-back when off-road.
   */
  getClosestRoadPoint(
    x: number,
    z: number,
    carRadius: number = 1.5
  ): { point: THREE.Vector3; distance: number; segment: RoadSegment } | null {
    if (this.segments.length === 0) return null;

    let bestDist = Infinity;
    let bestPoint = new THREE.Vector3(x, 0, z);
    let bestSeg = this.segments[0];

    for (const seg of this.segments) {
      const clampedX = Math.max(seg.minX, Math.min(seg.maxX, x));
      const clampedZ = Math.max(seg.minZ, Math.min(seg.maxZ, z));
      const dist = Math.sqrt((x - clampedX) ** 2 + (z - clampedZ) ** 2);

      if (dist < bestDist) {
        bestDist = dist;
        bestPoint = new THREE.Vector3(clampedX, 0, clampedZ);
        bestSeg = seg;
      }
    }

    return { point: bestPoint, distance: bestDist, segment: bestSeg };
  }
}
