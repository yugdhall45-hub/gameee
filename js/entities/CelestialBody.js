/**
 * CelestialBody - Planets & Gravitational Slingshot Points
 * Models massive gravity wells (Jupiter, Saturn, Neptune) enabling real orbital slingshot maneuvers.
 */

import { Entity } from './Entity.js';

export class CelestialBody extends Entity {
  constructor({
    x = 0,
    y = 0,
    name = 'Jupiter',
    planetType = 'JUPITER',
    radius = 90,
    gravityWellRadius = 380,
    mass = 850
  } = {}) {
    super({
      x,
      y,
      radius,
      mass,
      type: 'CELESTIAL_BODY'
    });

    this.name = name;
    this.planetType = planetType;
    this.gravityWellRadius = gravityWellRadius;
    this.slingshotAwarded = false;
    this.pulseAngle = 0;
  }

  update(dt) {
    this.pulseAngle += 1.2 * dt;
  }

  /**
   * Calculate gravitational pull exerted on an object at (ox, oy)
   * F = G * (m1 * m2) / r^2
   */
  calculateGravity(ox, oy) {
    const dx = this.x - ox;
    const dy = this.y - oy;
    const dist = Math.hypot(dx, dy);

    if (dist > this.gravityWellRadius || dist < this.radius * 0.4) {
      return { fx: 0, fy: 0, dist, inWell: false };
    }

    // Normalized directional vector
    const nx = dx / dist;
    const ny = dy / dist;

    // Softened inverse-square gravity
    const softenedDist = Math.max(dist, this.radius);
    const forceMagnitude = (this.mass * 9500) / (softenedDist * softenedDist);

    return {
      fx: nx * forceMagnitude,
      fy: ny * forceMagnitude,
      dist,
      inWell: true
    };
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 1. Gravitational Horizon / Slingshot Zone Rings
    ctx.beginPath();
    ctx.arc(0, 0, this.gravityWellRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(78, 168, 222, 0.22)';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbit gravity ripple
    const rippleR = this.radius + ((this.pulseAngle * 25) % (this.gravityWellRadius - this.radius));
    ctx.beginPath();
    ctx.arc(0, 0, rippleR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(78, 168, 222, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Planet Atmosphere Atmospheric Glow
    const glow = ctx.createRadialGradient(0, 0, this.radius * 0.8, 0, 0, this.radius * 1.35);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 3. Planet Rendering by Type
    if (this.planetType === 'JUPITER') {
      this.renderJupiter(ctx);
    } else if (this.planetType === 'SATURN') {
      this.renderSaturn(ctx);
    } else if (this.planetType === 'NEPTUNE') {
      this.renderNeptune(ctx);
    } else {
      this.renderMars(ctx);
    }

    // 4. Planet Label & Slingshot Indicator
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(this.name.toUpperCase(), 0, this.radius + 28);

    ctx.font = '500 11px JetBrains Mono, monospace';
    ctx.fillStyle = '#4cc9f0';
    ctx.fillText('GRAVITY ASSIST ZONE', 0, this.radius + 44);

    ctx.restore();
  }

  /**
   * Render Jupiter with cloud bands and Great Red Spot
   */
  renderJupiter(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.clip();

    // Base Jovian gradient
    const base = ctx.createLinearGradient(0, -this.radius, 0, this.radius);
    base.addColorStop(0, '#e7cba8');
    base.addColorStop(0.2, '#c48b61');
    base.addColorStop(0.4, '#e1ba93');
    base.addColorStop(0.6, '#9b5d38');
    base.addColorStop(0.8, '#d8ab82');
    base.addColorStop(1, '#834c2a');
    ctx.fillStyle = base;
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

    // Great Red Spot
    ctx.beginPath();
    ctx.ellipse(this.radius * 0.35, this.radius * 0.25, this.radius * 0.24, this.radius * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#bc4749';
    ctx.fill();
    ctx.strokeStyle = '#6a040f';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Render Saturn with elegant tilted ring system
   */
  renderSaturn(ctx) {
    // Rings behind planet
    ctx.save();
    ctx.rotate(-0.35);

    // Outer ring band
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 2.2, this.radius * 0.48, 0, Math.PI, 0);
    ctx.strokeStyle = 'rgba(233, 196, 106, 0.45)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Planet Body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const saturnGrad = ctx.createLinearGradient(0, -this.radius, 0, this.radius);
    saturnGrad.addColorStop(0, '#fde293');
    saturnGrad.addColorStop(0.5, '#e9c46a');
    saturnGrad.addColorStop(1, '#d4a373');
    ctx.fillStyle = saturnGrad;
    ctx.fill();

    // Rings in front of planet
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 2.2, this.radius * 0.48, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(233, 196, 106, 0.85)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Cassini Division gap in ring
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 1.9, this.radius * 0.42, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(6, 8, 20, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Render Neptune
   */
  renderNeptune(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-this.radius * 0.3, -this.radius * 0.3, 5, 0, 0, this.radius);
    grad.addColorStop(0, '#90e0ef');
    grad.addColorStop(0.5, '#0077b6');
    grad.addColorStop(1, '#023e8a');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  /**
   * Render Mars
   */
  renderMars(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-this.radius * 0.2, -this.radius * 0.2, 5, 0, 0, this.radius);
    grad.addColorStop(0, '#f28482');
    grad.addColorStop(0.7, '#c94a29');
    grad.addColorStop(1, '#6b2014');
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

export default CelestialBody;
