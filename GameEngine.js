/**
 * GameEngine - Main Ticker Loop, Viewport & Canvas Renderer
 * Uses fixed-timestep accumulator for bulletproof 60fps Newtonian simulation on all displays.
 */

import { CONFIG } from '../config.js';
import { eventBus } from './EventBus.js';
import { stateManager, GAME_STATES } from './StateManager.js';

export class GameEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // Logical dimensions & device scaling
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Camera / Viewport tracking
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0,
      targetZoom: 1.0,
      shakeIntensity: 0,
      shakeDuration: 0
    };

    // Parallax Starfield
    this.stars = [];
    this.initStarfield();

    // Time accumulator for fixed-step physics
    this.lastTime = 0;
    this.accumulator = 0;
    this.timestep = CONFIG.DISPLAY.PHYSICS_TIMESTEP;
    this.isRunning = false;
    this.rafId = null;

    // Subsystem hooks
    this.updateCallbacks = [];
    this.renderCallbacks = [];

    // Bind event listeners
    this.handleResize = this.handleResize.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('resize', this.handleResize);
    this.resizeCanvas();

    // Listen to screen shakes
    eventBus.on('SCREEN_SHAKE', ({ intensity = 8, duration = 0.35 }) => {
      this.camera.shakeIntensity = intensity;
      this.camera.shakeDuration = duration;
    });

    // Listen to state changes
    eventBus.on('STATE_CHANGED', ({ to }) => {
      if (to === GAME_STATES.PLAYING) {
        if (!this.isRunning) this.start();
      }
    });
  }

  /**
   * Populate multi-layered starfield for cosmic parallax
   */
  initStarfield() {
    this.stars = [];
    const count = CONFIG.DISPLAY.STARS_COUNT;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 8000,
        y: (Math.random() - 0.5) * 8000,
        size: Math.random() * 2.0 + 0.5,
        layer: Math.floor(Math.random() * 3) + 1, // 1: distant (slow), 3: close (fast)
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 2 + 1,
        color: ['#ffffff', '#a0c4ff', '#ffd166', '#bdb2ff', '#e0fbfc'][Math.floor(Math.random() * 5)]
      });
    }
  }

  /**
   * Handle display sizing and high-DPI density
   */
  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = true;
  }

  handleResize() {
    this.resizeCanvas();
  }

  /**
   * Register update hook (physics, systems)
   * @param {Function} fn (dt) => void
   */
  onUpdate(fn) {
    this.updateCallbacks.push(fn);
  }

  /**
   * Register render hook (entities, fx)
   * @param {Function} fn (ctx, camera) => void
   */
  onRender(fn) {
    this.renderCallbacks.push(fn);
  }

  /**
   * Start animation loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  /**
   * Stop animation loop
   */
  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Main ticker loop with fixed-step accumulator
   */
  tick(currentTime) {
    if (!this.isRunning) return;

    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Cap delta to prevent spiral of death when tab is unfocused
    if (delta > CONFIG.DISPLAY.MAX_DELTA) {
      delta = CONFIG.DISPLAY.MAX_DELTA;
    }

    // Only advance game physics when actively PLAYING or WARPING
    if (stateManager.is(GAME_STATES.PLAYING) || stateManager.is(GAME_STATES.SECTOR_WARP)) {
      this.accumulator += delta;
      while (this.accumulator >= this.timestep) {
        this.update(this.timestep);
        this.accumulator -= this.timestep;
      }
    }

    // Always render (enables animated backgrounds in menus & pause)
    this.render(delta);

    this.rafId = requestAnimationFrame(this.tick);
  }

  /**
   * Fixed-timestep physics update
   */
  update(dt) {
    // Screen shake decay
    if (this.camera.shakeDuration > 0) {
      this.camera.shakeDuration -= dt;
      if (this.camera.shakeDuration <= 0) {
        this.camera.shakeIntensity = 0;
      }
    }

    // Execute registered updates
    for (let i = 0; i < this.updateCallbacks.length; i++) {
      this.updateCallbacks[i](dt);
    }
  }

  /**
   * Set camera focus to target coordinate with smooth damping
   */
  setCameraTarget(targetX, targetY, speed = 0) {
    // Smooth camera lag
    const lerpFactor = 0.08;
    this.camera.x += (targetX - this.camera.x) * lerpFactor;
    this.camera.y += (targetY - this.camera.y) * lerpFactor;

    // Dynamic zoom based on flight speed
    const baseZoom = 1.0;
    const minZoom = 0.72;
    const speedRatio = Math.min(speed / CONFIG.PROBE.MAX_SPEED, 1.0);
    this.camera.targetZoom = baseZoom - speedRatio * (baseZoom - minZoom);
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.05;
  }

  /**
   * Render frame
   */
  render(dt) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Screen shake offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.camera.shakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
    }

    // 1. Deep Space Void Background
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, w, h);

    // 2. Parallax Starfield & Nebulae
    this.renderCosmicBackground(ctx, w, h, dt);

    // 3. World Matrix Transform (Camera Centered)
    ctx.save();
    ctx.translate(w / 2 + shakeX, h / 2 + shakeY);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 4. Render Registered World Layers (Entities, Hazards, Particles)
    for (let i = 0; i < this.renderCallbacks.length; i++) {
      this.renderCallbacks[i](ctx, this.camera);
    }

    ctx.restore();
  }

  /**
   * Render layered parallax stars and cosmic clouds
   */
  renderCosmicBackground(ctx, w, h, dt) {
    const camX = this.camera.x;
    const camY = this.camera.y;

    // Draw Subtle Cosmic Nebulae Gradients
    const grad1 = ctx.createRadialGradient(
      w * 0.3 - (camX * 0.01) % w,
      h * 0.3 - (camY * 0.01) % h,
      10,
      w * 0.3 - (camX * 0.01) % w,
      h * 0.3 - (camY * 0.01) % h,
      w * 0.6
    );
    grad1.addColorStop(0, 'rgba(30, 24, 74, 0.45)');
    grad1.addColorStop(1, 'rgba(6, 8, 20, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, w, h);

    // Render parallax stars
    const numStars = this.stars.length;
    for (let i = 0; i < numStars; i++) {
      const star = this.stars[i];
      star.twinkle += star.twinkleSpeed * dt;

      // Parallax coefficient based on star layer
      const factor = star.layer * 0.07;
      let sx = ((star.x - camX * factor) % w + w) % w;
      let sy = ((star.y - camY * factor) % h + h) % h;

      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(star.twinkle));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = star.color;

      ctx.beginPath();
      ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
  }

  /**
   * Destroy & cleanup
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.updateCallbacks = [];
    this.renderCallbacks = [];
  }
}

export default GameEngine;
