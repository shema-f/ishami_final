// ============================================================
// ISHAMI SIMULATION — Vehicle Physics Engine
// Responsive, fun driving physics with working A/D steering
// ============================================================

import * as THREE from 'three';
import type { GearState, SimulationState } from '../core/SimulationState';

// Gear ratios (simplified)
const GEAR_RATIOS: Record<GearState, number> = {
  N: 0,
  1: 3.5,
  2: 2.1,
  3: 1.4,
  4: 1.0,
  5: 0.7,
  R: -3.0,
};

// Engine torque curve
function getEngineTorque(rpm: number): number {
  if (rpm < 800) return 0;
  if (rpm < 2000) return THREE.MathUtils.lerp(0, 1, (rpm - 800) / 1200);
  if (rpm < 4000) return 1;
  if (rpm < 6000) return THREE.MathUtils.lerp(1, 0.6, (rpm - 4000) / 2000);
  return 0.3;
}

export interface VehiclePhysicsConfig {
  mass: number;
  enginePower: number;
  maxRPM: number;
  idleRPM: number;
  brakeForce: number;
  rollingResistance: number;
  dragCoefficient: number;
  steeringSpeed: number;
  maxSteeringAngle: number;
  wheelBase: number;
}

const DEFAULT_CONFIG: VehiclePhysicsConfig = {
  mass: 1400,
  enginePower: 85,          // slightly more power for snappier feel
  maxRPM: 6500,
  idleRPM: 900,
  brakeForce: 9000,         // stronger brakes
  rollingResistance: 120,   // less rolling resistance = faster response
  dragCoefficient: 0.35,
  steeringSpeed: 5.0,       // very responsive steering
  maxSteeringAngle: 0.55,
  wheelBase: 2.6,
};

export class VehiclePhysics {
  config: VehiclePhysicsConfig;
  rpm: number = 0;
  wheelAngle: number = 0;
  velocity: THREE.Vector3 = new THREE.Vector3();
  angularVelocity: number = 0;
  private _targetSteering: number = 0;
  private _smoothSpeed: number = 0;

  constructor(config?: Partial<VehiclePhysicsConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rpm = this.config.idleRPM;
  }

  update(state: SimulationState, delta: number): {
    speed: number;
    rpm: number;
    steeringAngle: number;
    position: THREE.Vector3;
    rotation: number;
    stalled: boolean;
  } {
    const dt = Math.min(delta, 0.05);
    const gear = state.gear;
    const gearRatio = GEAR_RATIOS[gear];

    // --- Clutch Engagement ---
    let clutchFactor = 0;
    if (state.engineRunning && !state.engineStalled) {
      clutchFactor = state.clutchPressed ? 0 : 1;
    }

    // --- Engine RPM ---
    if (state.engineRunning && !state.engineStalled) {
      const wheelRPM = (this._smoothSpeed * 30) / (Math.PI * 0.33);
      const targetRPM = Math.abs(gearRatio) > 0
        ? Math.abs(wheelRPM * gearRatio) * 60
        : this.config.idleRPM + (state.acceleratorPressed ? 1800 : 0);

      const rpmDiff = Math.max(this.config.idleRPM, targetRPM) - this.rpm;
      this.rpm += rpmDiff * dt * 4; // faster RPM response
      this.rpm = THREE.MathUtils.clamp(this.rpm, this.config.idleRPM, this.config.maxRPM);

      // Stall detection
      if (!state.clutchPressed && gear !== 'N' && this.rpm < 800) {
        this.rpm = 0;
        return {
          speed: this._smoothSpeed,
          rpm: 0,
          steeringAngle: this.wheelAngle,
          position: this.velocity.clone(),
          rotation: this.angularVelocity,
          stalled: true,
        };
      }
    } else if (state.engineStalled) {
      this.rpm = THREE.MathUtils.lerp(this.rpm, 0, dt * 5);
    } else {
      this.rpm = THREE.MathUtils.lerp(this.rpm, 0, dt * 3);
    }

    // --- Force Calculation ---
    let driveForce = 0;

    if (state.engineRunning && !state.engineStalled && gearRatio !== 0 && clutchFactor > 0) {
      const torque = getEngineTorque(this.rpm) * this.config.enginePower * 1000 / (this.rpm * Math.PI / 30 || 1);
      driveForce = torque * gearRatio * clutchFactor * 0.18;
    }

    // Accelerator force — snappier response
    if (state.acceleratorPressed && state.engineRunning && !state.engineStalled) {
      const acceleratorForce = this.config.enginePower * 100 * clutchFactor;
      driveForce += acceleratorForce * (this.rpm / this.config.maxRPM);
    }

    // Braking force — instant response
    let brakeForce = 0;
    if (state.brakePressed) {
      brakeForce = -this.config.brakeForce * Math.sign(this._smoothSpeed || 0.01);
      if (state.clutchPressed) {
        brakeForce *= 1.3;
      }
    }

    // Handbrake
    if (state.handbrakeOn && Math.abs(this._smoothSpeed) < 0.5) {
      brakeForce -= this.config.brakeForce * 0.8 * Math.sign(this._smoothSpeed || 0.01);
    }

    // Rolling resistance
    const rollingResistance = -this.rollingResistance * Math.sign(this._smoothSpeed);

    // Aerodynamic drag
    const dragForce = -this.config.dragCoefficient * this._smoothSpeed * Math.abs(this._smoothSpeed) * 80;

    // Total force
    const totalForce = driveForce + brakeForce + rollingResistance + dragForce;

    // Acceleration (F = ma)
    const acceleration = totalForce / this.config.mass;

    // Update speed
    this._smoothSpeed += acceleration * dt;

    // Handbrake holding
    if (state.handbrakeOn && Math.abs(this._smoothSpeed) < 0.5) {
      this._smoothSpeed *= 0.9;
    }

    // Reverse protection
    if (gear === 'R' && this._smoothSpeed > 2) {
      this._smoothSpeed = THREE.MathUtils.lerp(this._smoothSpeed, 0, dt * 2);
    }

    const speedKmh = Math.abs(this._smoothSpeed * 3.6);

    // ═══════════════════════════════════════════════════════
    // STEERING — Works even when stationary!
    // ═══════════════════════════════════════════════════════
    const steerInput = state.steeringAngle; // -1 to 1

    if (speedKmh < 1) {
      // STATIONARY: Direct steering — A/D turns wheels immediately
      // No lerp, instant response so player feels in control
      this.wheelAngle = steerInput * this.config.maxSteeringAngle * 0.4;

      // Angular velocity at very low speed — car rotates but barely moves
      if (Math.abs(this._smoothSpeed) > 0.05) {
        this.angularVelocity = steerInput * 0.8;
      } else {
        // Nearly stopped: tiny rotation when steering
        this.angularVelocity = steerInput * 0.3 * Math.min(Math.abs(this._smoothSpeed) * 10, 1);
      }
    } else if (speedKmh < 20) {
      // LOW SPEED (1-20 km/h): Quick steering, good for parking/turns
      const speedFactor = THREE.MathUtils.clamp(speedKmh / 20, 0.5, 1);
      this.wheelAngle = THREE.MathUtils.lerp(
        this.wheelAngle,
        steerInput * this.config.maxSteeringAngle * 0.8,
        dt * this.config.steeringSpeed * 2.5
      );

      const turnRadius = this.config.wheelBase / Math.tan(Math.abs(this.wheelAngle) + 0.01);
      this.angularVelocity = (this._smoothSpeed / turnRadius) * Math.sign(this.wheelAngle);
    } else if (speedKmh < 60) {
      // MEDIUM SPEED (20-60 km/h): Balanced steering
      const speedFactor = THREE.MathUtils.clamp(1 - (speedKmh - 20) / 80, 0.3, 1);
      this.wheelAngle = THREE.MathUtils.lerp(
        this.wheelAngle,
        steerInput * this.config.maxSteeringAngle * speedFactor,
        dt * this.config.steeringSpeed * 1.8
      );

      const turnRadius = this.config.wheelBase / Math.tan(Math.abs(this.wheelAngle) + 0.01);
      this.angularVelocity = (this._smoothSpeed / turnRadius) * Math.sign(this.wheelAngle);
    } else {
      // HIGH SPEED (60+ km/h): Reduced steering for stability
      const speedFactor = THREE.MathUtils.clamp(1 - speedKmh / 120, 0.15, 0.4);
      this.wheelAngle = THREE.MathUtils.lerp(
        this.wheelAngle,
        steerInput * this.config.maxSteeringAngle * speedFactor,
        dt * this.config.steeringSpeed * 1.5
      );

      const turnRadius = this.config.wheelBase / Math.tan(Math.abs(this.wheelAngle) + 0.01);
      this.angularVelocity = (this._smoothSpeed / turnRadius) * Math.sign(this.wheelAngle);
    }

    // When not steering, wheels return to center
    if (Math.abs(steerInput) < 0.01) {
      this.wheelAngle = THREE.MathUtils.lerp(this.wheelAngle, 0, dt * 3);
      this.angularVelocity = THREE.MathUtils.lerp(this.angularVelocity, 0, dt * 2);
    }

    return {
      speed: this._smoothSpeed,
      rpm: this.rpm,
      steeringAngle: this.wheelAngle,
      position: this.velocity.clone(),
      rotation: this.angularVelocity,
      stalled: false,
    };
  }

  private get rollingResistance(): number {
    return this.config.rollingResistance;
  }

  reset(): void {
    this.rpm = this.config.idleRPM;
    this.wheelAngle = 0;
    this.velocity.set(0, 0, 0);
    this.angularVelocity = 0;
    this._smoothSpeed = 0;
  }
}
