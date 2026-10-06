/**
 * ParticleSystem - High-performance GPU-friendly Canvas Particle Engine
 * Handles ion thruster plumes, overdrive fire, collision debris, and cosmic sparkles.
 */

export class ParticleSystem {
  constructor(maxParticles = 600) {
    this.maxParticles = maxParticles;
    this.particles = [];
  }

  /**
   * Spawn a burst of particles
   */
  emit({
    x,
    y,
    count = 10,
    speed = 100,
    spread = Math.PI * 2,
    angle = 0,
    color = '#4cc9f0',
    sizeMin = 1.5,
    sizeMax = 3.5,
    lifeMin = 0.3,
    lifeMax = 0.8,
    fade = true,
    shrink = true,
    vx = 0,
    vy = 0
  }) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Evict oldest
      }

      const pAngle = angle + (Math.random() - 0.5) * spread;
      const pSpeed = speed * (0.4 + Math.random() * 0.6);
      const life = lifeMin + Math.random() * (lifeMax - lifeMin);
      const size = sizeMin + Math.random() * (sizeMax - sizeMin);

      this.particles.push({
        x,
        y,
        vx: Math.cos(pAngle) * pSpeed + vx * 0.2,
        vy: Math.sin(pAngle) * pSpeed + vy * 0.2,
        size,
        initialSize: size,
        color,
        life,
        maxLife: life,
        fade,
        shrink
      });
    }
  }

  /**
   * Spawn thruster exhaust plume behind spacecraft
   */
  emitThruster(x, y, angle, isBoost = false, probeVx = 0, probeVy = 0) {
    const exhaustAngle = angle + Math.PI; // Opposite to heading
    const count = isBoost ? 4 : 2;
    const color = isBoost ? '#ffd166' : '#4cc9f0';
    const speed = isBoost ? 180 : 120;

    this.emit({
      x,
      y,
      count,
      speed,
      spread: 0.35,
      angle: exhaustAngle,
      color,
      sizeMin: isBoost ? 2.5 : 1.5,
      sizeMax: isBoost ? 4.5 : 3.0,
      lifeMin: 0.2,
      lifeMax: isBoost ? 0.5 : 0.35,
      vx: probeVx * 0.3,
      vy: probeVy * 0.3
    });
  }

  /**
   * Spawn explosion burst
   */
  emitExplosion(x, y, color = '#f72585', count = 30) {
    this.emit({
      x,
      y,
      count,
      speed: 190,
      spread: Math.PI * 2,
      color,
      sizeMin: 2.0,
      sizeMax: 5.5,
      lifeMin: 0.4,
      lifeMax: 1.1
    });
  }

  /**
   * Spawn golden discovery sparkle
   */
  emitSparkles(x, y, color = '#ffd166', count = 20) {
    this.emit({
      x,
      y,
      count,
      speed: 90,
      spread: Math.PI * 2,
      color,
      sizeMin: 1.5,
      sizeMax: 3.5,
      lifeMin: 0.5,
      lifeMax: 1.2
    });
  }

  /**
   * Update particle lifetimes and positions
   */
  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Slight drag
      p.vx *= 0.98;
      p.vy *= 0.98;

      if (p.shrink) {
        p.size = p.initialSize * (p.life / p.maxLife);
      }
    }
  }

  /**
   * Draw active particles with additive blending
   */
  render(ctx) {
    if (this.particles.length === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = p.fade ? Math.max(0, p.life / p.maxLife) : 1;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  clear() {
    this.particles = [];
  }
}

export const particleSystem = new ParticleSystem();
export default particleSystem;
