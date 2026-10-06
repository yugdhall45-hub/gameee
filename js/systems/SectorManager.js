/**
 * SectorManager - Procedural Generation & 5-Sector Interstellar Journey
 * Advances player from the Asteroid Belt to Jupiter, Saturn, Neptune, and the Heliopause.
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../core/EventBus.js';
import { stateManager, GAME_STATES } from '../core/StateManager.js';
import { entityManager } from '../entities/EntityManager.js';
import { Hazard } from '../entities/Hazard.js';
import { Collectible } from '../entities/Collectible.js';
import { CelestialBody } from '../entities/CelestialBody.js';

export class SectorManager {
  constructor() {
    this.currentSectorIndex = 0;
    this.distanceTraveledAU = 0;
    this.spawnTimer = 0;
    this.spawnInterval = 0.85;

    // Celestial bodies scheduled for discovery
    this.spawnedPlanets = new Set();
  }

  reset() {
    this.currentSectorIndex = 0;
    this.distanceTraveledAU = 0;
    this.spawnTimer = 0;
    this.spawnedPlanets.clear();
    this.setupCurrentSector();
  }

  getCurrentSector() {
    return CONFIG.SECTORS[this.currentSectorIndex];
  }

  setupCurrentSector() {
    const sector = this.getCurrentSector();
    console.log(`[SectorManager] Entered ${sector.name}: ${sector.subtitle}`);

    // Spawn sector's signature planet ahead of the starting gate if not already present
    if (!this.spawnedPlanets.has(sector.id)) {
      this.spawnedPlanets.add(sector.id);
      this.spawnSectorLandmark(sector);
    }

    eventBus.emit('SECTOR_ENTERED', {
      sectorId: sector.id,
      name: sector.name,
      subtitle: sector.subtitle,
      themeColor: sector.themeColor
    });
  }

  spawnSectorLandmark(sector) {
    const probe = entityManager.probe;
    const baseDistance = 1400;

    let body = null;
    if (sector.id === 1) {
      body = new CelestialBody({
        x: (probe ? probe.x : 0) + 1200,
        y: (probe ? probe.y : 0) - 400,
        name: 'Mars',
        planetType: 'MARS',
        radius: 65,
        gravityWellRadius: 320,
        mass: 450
      });
    } else if (sector.id === 2) {
      body = new CelestialBody({
        x: (probe ? probe.x : 0) + 1600,
        y: (probe ? probe.y : 0) - 200,
        name: 'Jupiter',
        planetType: 'JUPITER',
        radius: 120,
        gravityWellRadius: 520,
        mass: 1400
      });
    } else if (sector.id === 3) {
      body = new CelestialBody({
        x: (probe ? probe.x : 0) + 1700,
        y: (probe ? probe.y : 0) + 300,
        name: 'Saturn',
        planetType: 'SATURN',
        radius: 105,
        gravityWellRadius: 480,
        mass: 1100
      });
    } else if (sector.id === 4) {
      body = new CelestialBody({
        x: (probe ? probe.x : 0) + 1800,
        y: (probe ? probe.y : 0) - 300,
        name: 'Neptune',
        planetType: 'NEPTUNE',
        radius: 80,
        gravityWellRadius: 400,
        mass: 750
      });
    }

    if (body) {
      entityManager.addCelestialBody(body);
    }
  }

  update(dt) {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;

    // Convert pixel travel speed to Astronomical Units
    const speed = Math.hypot(probe.vx, probe.vy);
    const deltaAU = (speed * dt) * 0.0035;
    this.distanceTraveledAU += deltaAU;

    // Check Sector Progression
    const sector = this.getCurrentSector();
    if (this.distanceTraveledAU >= sector.distanceEndAU) {
      if (this.currentSectorIndex < CONFIG.SECTORS.length - 1) {
        this.currentSectorIndex++;
        this.setupCurrentSector();
      } else {
        // Interstellar Horizon reached! Final Victory milestone!
        stateManager.transitionTo(GAME_STATES.VICTORY, {
          distanceAU: this.distanceTraveledAU,
          sector: sector.name
        });
        return;
      }
    }

    // Procedural Spawner Ahead of Probe
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntitiesAhead(probe, sector);
    }
  }

  /**
   * Spawn hazards & collectibles in a forward cone ahead of probe trajectory
   */
  spawnEntitiesAhead(probe, sector) {
    // Determine spawn direction based on probe velocity or orientation
    const heading = Math.atan2(probe.vy, probe.vx) || probe.angle;
    const spawnDistance = 900 + Math.random() * 400;
    const spreadAngle = heading + (Math.random() - 0.5) * 1.6;

    const sx = probe.x + Math.cos(spreadAngle) * spawnDistance;
    const sy = probe.y + Math.sin(spreadAngle) * spawnDistance;

    // 1. Roll to spawn Collectible (Golden Record / Data / Fuel)
    if (Math.random() < 0.38) {
      const roll = Math.random();
      let type = 'SCIENCE_DATA';
      if (roll < 0.15) type = 'GOLDEN_RECORD';
      else if (roll < 0.45) type = 'ENERGY_CELL';
      else if (roll < 0.65) type = 'REPAIR_NANITES';

      entityManager.addCollectible(new Collectible({ x: sx, y: sy, itemType: type }));
      return;
    }

    // 2. Roll to spawn Hazard (Asteroid / Debris / Comet)
    const hazardTypes = ['ASTEROID_SMALL', 'ASTEROID_MEDIUM', 'ASTEROID_LARGE', 'SPACE_JUNK'];
    if (sector.id >= 3) hazardTypes.push('COMET');

    const chosenType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
    const driftAngle = Math.random() * Math.PI * 2;
    const driftSpeed = 20 + Math.random() * 60;

    entityManager.addHazard(
      new Hazard({
        x: sx,
        y: sy,
        hazardType: chosenType,
        vx: Math.cos(driftAngle) * driftSpeed,
        vy: Math.sin(driftAngle) * driftSpeed
      })
    );
  }
}

export const sectorManager = new SectorManager();
export default sectorManager;
