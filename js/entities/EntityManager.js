/**
 * EntityManager - Manages Entity Lifecycles, Spatial Culling & Rendering
 */

export class EntityManager {
  constructor() {
    this.probe = null;
    this.hazards = [];
    this.collectibles = [];
    this.celestialBodies = [];
  }

  setProbe(probe) {
    this.probe = probe;
  }

  addHazard(hazard) {
    this.hazards.push(hazard);
  }

  addCollectible(collectible) {
    this.collectibles.push(collectible);
  }

  addCelestialBody(body) {
    this.celestialBodies.push(body);
  }

  /**
   * Update all active entities and prune dead / distant objects
   */
  update(dt) {
    // 1. Update Probe
    if (this.probe && this.probe.isAlive()) {
      this.probe.update(dt);
    }

    // 2. Update Celestial Bodies
    for (let i = 0; i < this.celestialBodies.length; i++) {
      this.celestialBodies[i].update(dt);
    }

    // Reference position for distance culling
    const px = this.probe ? this.probe.x : 0;
    const py = this.probe ? this.probe.y : 0;
    const maxActiveDistance = 3500;

    // 3. Update Hazards
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.update(dt);

      // Cull dead or distant hazards
      const dist = Math.hypot(h.x - px, h.y - py);
      if (!h.isAlive() || dist > maxActiveDistance) {
        this.hazards.splice(i, 1);
      }
    }

    // 4. Update Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.update(dt);

      const dist = Math.hypot(c.x - px, c.y - py);
      if (!c.isAlive() || dist > maxActiveDistance) {
        this.collectibles.splice(i, 1);
      }
    }
  }

  /**
   * Render all entities with viewport frustum culling
   */
  render(ctx, camera) {
    const viewMargin = 200;
    const halfW = (window.innerWidth / (camera.zoom || 1)) / 2 + viewMargin;
    const halfH = (window.innerHeight / (camera.zoom || 1)) / 2 + viewMargin;

    const inFrustum = (e) => {
      return (
        e.x >= camera.x - halfW &&
        e.x <= camera.x + halfW &&
        e.y >= camera.y - halfH &&
        e.y <= camera.y + halfH
      );
    };

    // 1. Render Celestial Bodies (lowest z-index)
    for (let i = 0; i < this.celestialBodies.length; i++) {
      const b = this.celestialBodies[i];
      if (inFrustum(b) || b.distanceTo({ x: camera.x, y: camera.y }) < b.gravityWellRadius + 300) {
        b.render(ctx);
      }
    }

    // 2. Render Collectibles
    for (let i = 0; i < this.collectibles.length; i++) {
      const c = this.collectibles[i];
      if (inFrustum(c)) {
        c.render(ctx);
      }
    }

    // 3. Render Hazards
    for (let i = 0; i < this.hazards.length; i++) {
      const h = this.hazards[i];
      if (inFrustum(h)) {
        h.render(ctx);
      }
    }

    // 4. Render Probe (top z-index)
    if (this.probe && this.probe.isAlive()) {
      this.probe.render(ctx);
    }
  }

  clearWorld() {
    this.hazards = [];
    this.collectibles = [];
    this.celestialBodies = [];
  }
}

export const entityManager = new EntityManager();
export default entityManager;
