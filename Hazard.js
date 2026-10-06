/**
 * Hazard - Asteroids, Orbital Debris, and Space Obstacles
 * Renders procedural jagged polygon asteroids with rotation and velocity.
 */

import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Hazard extends Entity {
  constructor({
    x = 0,
    y = 0,
    hazardType = 'ASTEROID_MEDIUM',
    vx = 0,
    vy = 0
  } = {}) {
    const spec = CONFIG.HAZARDS[hazardType] || CONFIG.HAZARDS.ASTEROID_MEDIUM;

    super({
      x,
      y,
      radius: spec.radius,
      mass: spec.mass || 5.0,
      type: 'HAZARD'
    });

    this.hazardType = hazardType;
    this.spec = spec;
    this.damage = spec.damage;
    this.scoreKill = spec.scoreKill;
    this.color = spec.color;

    this.vx = vx;
    this.vy = vy;
    this.angularVelocity = (Math.random() - 0.5) * 1.5;

    // Generate procedural jagged asteroid vertices
    this.points = [];
    const numPoints = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const variation = 0.75 + Math.random() * 0.45;
      const r = this.radius * variation;
      this.points.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }

    // Surface craters
    this.craters = [];
    if (this.radius > 20) {
      const numCraters = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numCraters; i++) {
        const dist = Math.random() * (this.radius * 0.5);
        const ang = Math.random() * Math.PI * 2;
        this.craters.push({
          x: Math.cos(ang) * dist,
          y: Math.sin(ang) * dist,
          r: Math.random() * (this.radius * 0.22) + 2
        });
      }
    }
  }

  update(dt) {
    super.update(dt);
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Jagged Body
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Render Craters
    ctx.fillStyle = 'rgba(33, 37, 41, 0.4)';
    for (let i = 0; i < this.craters.length; i++) {
      const c = this.craters[i];
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export default Hazard;
