/**
 * PhysicsSystem - 2D Newtonian Kinematics & Planetary Gravity Assists
 * Calculates gravitational attraction towards celestial bodies and executes slingshot boosts.
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../core/EventBus.js';
import { entityManager } from '../entities/EntityManager.js';

export class PhysicsSystem {
  constructor() {
    this.inGravityWell = false;
    this.currentBody = null;
    this.wellEntrySpeed = 0;
  }

  update(dt) {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;

    const bodies = entityManager.celestialBodies;
    let currentlyInfluenced = false;

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const gResult = body.calculateGravity(probe.x, probe.y);

      if (gResult.inWell) {
        currentlyInfluenced = true;

        // Apply gravitational acceleration to probe
        probe.vx += gResult.fx * dt;
        probe.vy += gResult.fy * dt;

        // Track Slingshot / Gravity Assist
        if (!this.inGravityWell) {
          this.inGravityWell = true;
          this.currentBody = body;
          this.wellEntrySpeed = Math.hypot(probe.vx, probe.vy);

          eventBus.emit('GRAVITY_ASSIST_ENTER', {
            planetName: body.name,
            distance: gResult.dist
          });
        }

        // Check for successful slingshot exit criteria
        if (!body.slingshotAwarded && gResult.dist < body.gravityWellRadius * 0.7) {
          const currentSpeed = Math.hypot(probe.vx, probe.vy);
          if (currentSpeed > this.wellEntrySpeed * 1.1) {
            body.slingshotAwarded = true;
            // Slingshot velocity boost
            probe.vx *= CONFIG.GRAVITY.ASSIST_VELOCITY_BOOST;
            probe.vy *= CONFIG.GRAVITY.ASSIST_VELOCITY_BOOST;

            eventBus.emit('GRAVITY_ASSIST_EXECUTED', {
              planetName: body.name,
              bonusScore: CONFIG.GRAVITY.ASSIST_SCORE_AWARD,
              speedBoost: Math.round(currentSpeed * (CONFIG.GRAVITY.ASSIST_VELOCITY_BOOST - 1))
            });
          }
        }
      }
    }

    if (!currentlyInfluenced && this.inGravityWell) {
      this.inGravityWell = false;
      this.currentBody = null;
      eventBus.emit('GRAVITY_ASSIST_EXIT');
    }
  }
}

export const physicsSystem = new PhysicsSystem();
export default physicsSystem;
