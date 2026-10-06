/**
 * Probe - The Voyager Spacecraft Entity
 * Handles flight kinematics, thrusters, energy reserves, hull integrity, and vector rendering.
 */

import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { eventBus } from '../core/EventBus.js';
import { particleSystem } from './ParticleSystem.js';

export class Probe extends Entity {
  constructor(x = 0, y = 0) {
    super({
      x,
      y,
      radius: CONFIG.PROBE.RADIUS,
      mass: CONFIG.PROBE.MASS,
      type: 'PROBE'
    });

    this.angle = -Math.PI / 2; // Pointing upwards initially
    this.hull = CONFIG.PROBE.INITIAL_HULL;
    this.maxHull = CONFIG.PROBE.INITIAL_HULL;
    this.energy = CONFIG.PROBE.INITIAL_ENERGY;
    this.maxEnergy = CONFIG.PROBE.INITIAL_ENERGY;

    this.invulnerableTimer = 0;
    this.thrusting = false;
    this.boosting = false;

    // Golden Record fragments collected
    this.goldenRecordsCollected = 0;
    this.scienceDataCollected = 0;
  }

  /**
   * Reset probe to starting state
   */
  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2;
    this.hull = this.maxHull;
    this.energy = this.maxEnergy;
    this.invulnerableTimer = 0;
    this.thrusting = false;
    this.boosting = false;
    this.goldenRecordsCollected = 0;
    this.scienceDataCollected = 0;
  }

  /**
   * Apply player input controls
   */
  applyInput(inputState, dt) {
    // 1. Steering / Angular Motion
    if (inputState.rotateLeft) {
      this.angle -= CONFIG.PROBE.ROTATION_SPEED * dt;
    }
    if (inputState.rotateRight) {
      this.angle += CONFIG.PROBE.ROTATION_SPEED * dt;
    }

    // 2. Thrusting & Overdrive
    this.thrusting = false;
    this.boosting = false;

    const wantsThrust = inputState.thrust;
    const wantsBoost = inputState.boost && wantsThrust && this.energy > 5;

    if (wantsThrust && this.energy > 0) {
      this.thrusting = true;
      this.boosting = wantsBoost;

      let power = CONFIG.PROBE.THRUST_POWER;
      let drain = CONFIG.PROBE.ENERGY_DRAIN_THRUST;

      if (wantsBoost) {
        power *= CONFIG.PROBE.BOOST_MULTIPLIER;
        drain = CONFIG.PROBE.ENERGY_DRAIN_BOOST;
      }

      // Apply acceleration in heading direction
      const ax = Math.cos(this.angle) * power;
      const ay = Math.sin(this.angle) * power;

      this.vx += ax * dt;
      this.vy += ay * dt;

      // Consume energy
      this.energy = Math.max(0, this.energy - drain * dt);

      // Emit ion thruster particles behind craft
      const nozzleOffset = -this.radius;
      const nx = this.x + Math.cos(this.angle) * nozzleOffset;
      const ny = this.y + Math.sin(this.angle) * nozzleOffset;
      particleSystem.emitThruster(nx, ny, this.angle, wantsBoost, this.vx, this.vy);
    } else {
      // Passive RTG / solar trickle recharge
      if (this.energy < this.maxEnergy) {
        this.energy = Math.min(this.maxEnergy, this.energy + CONFIG.PROBE.PASSIVE_ENERGY_REGEN * dt);
      }
    }

    // Reverse retro thrusters
    if (inputState.reverse && this.energy > 5) {
      const retroPower = CONFIG.PROBE.THRUST_POWER * 0.45;
      this.vx -= Math.cos(this.angle) * retroPower * dt;
      this.vy -= Math.sin(this.angle) * retroPower * dt;
      this.energy = Math.max(0, this.energy - (CONFIG.PROBE.ENERGY_DRAIN_THRUST * 0.5) * dt);
    }
  }

  /**
   * Apply physics & drag
   */
  update(dt) {
    // Invulnerability countdown
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Deep space inertial damping
    this.vx *= CONFIG.PROBE.LINEAR_DAMPING;
    this.vy *= CONFIG.PROBE.LINEAR_DAMPING;

    // Speed clamp
    const currentSpeed = Math.hypot(this.vx, this.vy);
    if (currentSpeed > CONFIG.PROBE.MAX_SPEED) {
      const scale = CONFIG.PROBE.MAX_SPEED / currentSpeed;
      this.vx *= scale;
      this.vy *= scale;
    }

    // Position integration
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Broadcast state for HUD
    eventBus.emit('PLAYER_MOVED', {
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      speed: Math.hypot(this.vx, this.vy),
      heading: this.angle,
      hull: this.hull,
      maxHull: this.maxHull,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      thrusting: this.thrusting,
      boosting: this.boosting
    });
  }

  /**
   * Damage probe hull
   */
  takeDamage(amount, source = 'HAZARD') {
    if (this.invulnerableTimer > 0) return false;

    this.hull = Math.max(0, this.hull - amount);
    this.invulnerableTimer = CONFIG.PROBE.INVULNERABILITY_TIME;

    // Spark particles
    particleSystem.emitExplosion(this.x, this.y, '#e63946', 15);
    eventBus.emit('SCREEN_SHAKE', { intensity: 10, duration: 0.4 });

    eventBus.emit('PLAYER_DAMAGED', {
      damage: amount,
      currentHull: this.hull,
      maxHull: this.maxHull,
      source
    });

    return true;
  }

  /**
   * Restore hull
   */
  heal(amount) {
    this.hull = Math.min(this.maxHull, this.hull + amount);
    eventBus.emit('HULL_REPAIRED', {
      currentHull: this.hull,
      maxHull: this.maxHull,
      amount
    });
  }

  /**
   * Restore energy
   */
  recharge(amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  /**
   * Render Voyager probe with authentic vector aesthetics
   */
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Invulnerability flashing glow
    if (this.invulnerableTimer > 0) {
      const flash = Math.floor(this.invulnerableTimer * 10) % 2 === 0;
      if (flash) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(76, 201, 240, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 1. High-Gain Parabolic Antenna Dish (Facing front)
    ctx.beginPath();
    ctx.ellipse(4, 0, 8, 14, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#adb5bd';
    ctx.stroke();

    // Antenna sub-reflector feed horn
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(13, 0);
    ctx.strokeStyle = '#ced4da';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(13, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    // 2. Main Spacecraft Decagonal/Hexagonal Electronics Bus (Center)
    ctx.fillStyle = '#212529';
    ctx.beginPath();
    ctx.rect(-8, -6, 11, 12);
    ctx.fill();
    ctx.strokeStyle = '#495057';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Golden Record bay indicator on the side
    ctx.beginPath();
    ctx.arc(-2, 3.5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    // 3. RTG Power Unit Boom (Port side)
    ctx.beginPath();
    ctx.moveTo(-4, -6);
    ctx.lineTo(-11, -16);
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Cylindrical RTG canisters
    ctx.fillStyle = '#495057';
    ctx.fillRect(-14, -20, 6, 5);

    // 4. Magnetometer Boom (Starboard side, long boom)
    ctx.beginPath();
    ctx.moveTo(-4, 6);
    ctx.lineTo(-14, 18);
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Sensor canister
    ctx.beginPath();
    ctx.arc(-14, 18, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#06d6a0';
    ctx.fill();

    // 5. Thruster Nozzle & Engine Plume Mount (Rear)
    ctx.fillStyle = '#343a40';
    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-13, -4.5);
    ctx.lineTo(-13, 4.5);
    ctx.lineTo(-8, 3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6c757d';
    ctx.stroke();

    // Active Engine Core Glow
    if (this.thrusting) {
      ctx.beginPath();
      ctx.arc(-12, 0, this.boosting ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.boosting ? '#ffd166' : '#4cc9f0';
      ctx.fill();
    }

    ctx.restore();
  }
}

export default Probe;
