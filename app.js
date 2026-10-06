/**
 * Voyager - Application Bootstrap & Dependency Injection Root
 * Coordinates all modular subsystems via EventBus.
 */

import { CONFIG } from './config.js';
import { eventBus } from './core/EventBus.js';
import { stateManager, GAME_STATES } from './core/StateManager.js';
import { GameEngine } from './core/GameEngine.js';
import { inputManager } from './core/InputManager.js';
import { Probe } from './entities/Probe.js';
import { entityManager } from './entities/EntityManager.js';
import { particleSystem } from './entities/ParticleSystem.js';
import { physicsSystem } from './systems/PhysicsSystem.js';
import { collisionSystem } from './systems/CollisionSystem.js';
import { sectorManager } from './systems/SectorManager.js';
import { scoreManager } from './systems/ScoreManager.js';
import { audioSystem } from './systems/AudioSystem.js';
import { hudView } from './ui/HUDView.js';
import { uiManager } from './ui/UIManager.js';
import { leaderboardView } from './ui/LeaderboardView.js';
import { firebaseService } from './services/FirebaseService.js';

class VoyagerApp {
  constructor() {
    this.engine = null;
    this.probe = null;
  }

  async init() {
    console.log(`%c🚀 ${CONFIG.GAME_TITLE} v${CONFIG.VERSION} Initializing...`, 'color: #4cc9f0; font-weight: bold; font-size: 14px;');

    // 1. Initialize Canvas & Game Engine
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Fatal: #game-canvas element not found');
      return;
    }
    this.engine = new GameEngine(canvas);

    // 2. Initialize Probecraft & Entities
    this.probe = new Probe(0, 0);
    entityManager.setProbe(this.probe);

    // 3. Initialize Firebase & Cloud Leaderboards
    // Note: If you have a custom Firebase config object, place it here.
    // By default, it gracefully uses local high-speed persistence with zero friction!
    const customFirebaseConfig = {
      apiKey: "YOUR_API_KEY", // Replace with your Firebase API Key
      authDomain: "voyager-game.firebaseapp.com",
      projectId: "voyager-game",
      storageBucket: "voyager-game.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    };
    await firebaseService.init(customFirebaseConfig);

    // 4. Register Engine Physics & System Updates
    this.engine.onUpdate((dt) => {
      // Apply input to probe
      if (this.probe.isAlive()) {
        const input = inputManager.getState();
        this.probe.applyInput(input, dt);
      }

      // Physics & Gravity Assist calculation
      physicsSystem.update(dt);

      // Entity Lifecycles & Culling
      entityManager.update(dt);

      // Particle Lifetimes
      particleSystem.update(dt);

      // Collision checks & damage
      collisionSystem.update(dt);

      // Interstellar Sectors & Milestones
      sectorManager.update(dt);

      // Distance scoring & multipliers
      scoreManager.update(dt, sectorManager.distanceTraveledAU);

      // Camera Tracking
      const probeSpeed = Math.hypot(this.probe.vx, this.probe.vy);
      this.engine.setCameraTarget(this.probe.x, this.probe.y, probeSpeed);
    });

    // 5. Register Engine Visual Renderers
    this.engine.onRender((ctx, camera) => {
      // Render entities (celestial bodies, collectibles, hazards, probe)
      entityManager.render(ctx, camera);

      // Render particle engine plumes & bursts
      particleSystem.render(ctx);

      // Render HUD Radar scanner
      hudView.renderRadar(CONFIG.DISPLAY.PHYSICS_TIMESTEP);
    });

    // 6. Bind Game Lifecycle Events
    eventBus.on('START_NEW_GAME', () => {
      this.startNewExpedition();
    });

    // Start in MENU state
    stateManager.transitionTo(GAME_STATES.MENU);
    this.engine.start();

    console.log('%c🛰️ Voyager Systems Nominal. Ready for launch.', 'color: #06d6a0; font-weight: bold;');
  }

  startNewExpedition() {
    // Reset player craft
    this.probe.reset(0, 0);

    // Reset particle bursts & active entities
    particleSystem.clear();
    entityManager.clearWorld();

    // Reset scoring & sectors
    scoreManager.reset();
    sectorManager.reset();

    // Transition to active flight
    stateManager.transitionTo(GAME_STATES.PLAYING);
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const app = new VoyagerApp();
  app.init();
});
