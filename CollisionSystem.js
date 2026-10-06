/**
 * CollisionSystem - Fast Circle-Circle Intersect & Collision Event Dispatcher
 */

import { eventBus } from '../core/EventBus.js';
import { stateManager, GAME_STATES } from '../core/StateManager.js';
import { entityManager } from '../entities/EntityManager.js';
import { particleSystem } from '../entities/ParticleSystem.js';

export class CollisionSystem {
  constructor() {}

  update(dt) {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;

    // 1. Probe vs Hazards
    const hazards = entityManager.hazards;
    for (let i = 0; i < hazards.length; i++) {
      const h = hazards[i];
      if (!h.isAlive()) continue;

      const hitDist = probe.radius + h.radius;
      const dx = probe.x - h.x;
      const dy = probe.y - h.y;
      const dist = Math.hypot(dx, dy);

      if (dist < hitDist) {
        // Elastic rebound push
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);
        probe.vx += nx * 140;
        probe.vy += ny * 140;

        const damaged = probe.takeDamage(h.damage, h.hazardType);
        if (damaged) {
          eventBus.emit('HAZARD_HIT', {
            hazardType: h.hazardType,
            damage: h.damage,
            hullRemaining: probe.hull
          });

          // Check for Game Over condition
          if (probe.hull <= 0) {
            probe.destroy();
            particleSystem.emitExplosion(probe.x, probe.y, '#e63946', 45);
            stateManager.transitionTo(GAME_STATES.GAME_OVER, {
              reason: `Hull compromised by ${h.hazardType.replace('_', ' ').toLowerCase()}`
            });
            return;
          }
        }
      }
    }

    // 2. Probe vs Collectibles
    const collectibles = entityManager.collectibles;
    for (let i = 0; i < collectibles.length; i++) {
      const c = collectibles[i];
      if (!c.isAlive()) continue;

      const pickupDist = probe.radius + c.radius + 6; // Slight magnetic pickup range
      const dist = probe.distanceTo(c);

      if (dist < pickupDist) {
        // Collect Item
        c.destroy();

        if (c.itemType === 'GOLDEN_RECORD') {
          probe.goldenRecordsCollected++;
          particleSystem.emitSparkles(c.x, c.y, '#ffd166', 35);
        } else if (c.itemType === 'ENERGY_CELL') {
          probe.recharge(c.energyRestore);
          particleSystem.emitSparkles(c.x, c.y, '#4cc9f0', 20);
        } else if (c.itemType === 'REPAIR_NANITES') {
          probe.heal(c.hullRestore);
          particleSystem.emitSparkles(c.x, c.y, '#06d6a0', 25);
        } else {
          probe.scienceDataCollected++;
          particleSystem.emitSparkles(c.x, c.y, '#f72585', 20);
        }

        eventBus.emit('ITEM_COLLECTED', {
          itemType: c.itemType,
          scoreValue: c.scoreValue,
          energyRestore: c.energyRestore,
          hullRestore: c.hullRestore,
          label: c.label,
          x: c.x,
          y: c.y
        });
      }
    }

    // 3. Probe vs Celestial Body Surface
    const bodies = entityManager.celestialBodies;
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      const dist = probe.distanceTo(b);
      if (dist < b.radius + probe.radius) {
        // Atmospheric burn / surface collision
        probe.takeDamage(40, `Atmosphere of ${b.name}`);

        // Rebound probe outwards
        const nx = (probe.x - b.x) / dist;
        const ny = (probe.y - b.y) / dist;
        probe.vx = nx * 320;
        probe.vy = ny * 320;

        if (probe.hull <= 0) {
          probe.destroy();
          particleSystem.emitExplosion(probe.x, probe.y, '#e63946', 50);
          stateManager.transitionTo(GAME_STATES.GAME_OVER, {
            reason: `Disintegrated in ${b.name}'s dense atmosphere`
          });
          return;
        }
      }
    }
  }
}

export const collisionSystem = new CollisionSystem();
export default collisionSystem;
