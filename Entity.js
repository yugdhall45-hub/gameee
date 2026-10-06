/**
 * Entity - Base Object for All Dynamic & Static World Elements
 */

export class Entity {
  constructor({ x = 0, y = 0, radius = 10, mass = 1.0, type = 'ENTITY' } = {}) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.radius = radius;
    this.mass = mass;
    this.type = type;
    this.alive = true;
    this.id = Math.random().toString(36).substring(2, 9);
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.angularVelocity * dt;
  }

  render(ctx) {
    // Override in derived classes
  }

  isAlive() {
    return this.alive;
  }

  destroy() {
    this.alive = false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius
    };
  }

  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.hypot(dx, dy);
  }
}

export default Entity;
