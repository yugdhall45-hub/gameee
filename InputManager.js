/**
 * InputManager - Unified Desktop Keyboard & Mobile Touch Controller
 * Translates multi-touch and keyboard inputs into normalized control states.
 */

import { CONFIG } from '../config.js';
import { eventBus } from './EventBus.js';
import { stateManager } from './StateManager.js';

export class InputManager {
  constructor() {
    this.state = {
      thrust: false,
      reverse: false,
      rotateLeft: false,
      rotateRight: false,
      boost: false,
      radarPing: false
    };

    this.activeKeys = new Set();
    this.touchActive = false;

    this.bindKeyboard();
    this.bindTouchControls();
  }

  /**
   * Bind desktop keyboard events
   */
  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent browser scroll on game controls
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      this.activeKeys.add(e.code);

      // Single-shot action handlers
      if (CONFIG.KEYS.PAUSE.includes(e.code)) {
        stateManager.togglePause();
      }
      if (CONFIG.KEYS.MUTE.includes(e.code)) {
        eventBus.emit('AUDIO_TOGGLE_MUTE');
      }
      if (CONFIG.KEYS.PING_RADAR.includes(e.code)) {
        eventBus.emit('RADAR_PING_REQUESTED');
      }

      this.updateState();
    });

    window.addEventListener('keyup', (e) => {
      this.activeKeys.delete(e.code);
      this.updateState();
    });

    // Reset keys if window loses focus
    window.addEventListener('blur', () => {
      this.activeKeys.clear();
      this.resetState();
    });
  }

  /**
   * Bind responsive mobile virtual touch buttons & joystick
   */
  bindTouchControls() {
    // Touch controls DOM elements are initialized when UI loads
    const bindTouchButton = (elementId, stateProperty) => {
      const el = document.getElementById(elementId);
      if (!el) return;

      const activate = (e) => {
        e.preventDefault();
        this.state[stateProperty] = true;
        this.touchActive = true;
        el.classList.add('active');
        eventBus.emit('INPUT_CHANGED', this.getState());
      };

      const deactivate = (e) => {
        e.preventDefault();
        this.state[stateProperty] = false;
        el.classList.remove('active');
        eventBus.emit('INPUT_CHANGED', this.getState());
      };

      el.addEventListener('pointerdown', activate);
      el.addEventListener('pointerup', deactivate);
      el.addEventListener('pointercancel', deactivate);
      el.addEventListener('pointerleave', deactivate);
    };

    // Attach to mobile touch elements if present
    setTimeout(() => {
      bindTouchButton('btn-touch-thrust', 'thrust');
      bindTouchButton('btn-touch-boost', 'boost');
      bindTouchButton('btn-touch-left', 'rotateLeft');
      bindTouchButton('btn-touch-right', 'rotateRight');
    }, 100);
  }

  /**
   * Update boolean state from keyboard set
   */
  updateState() {
    const isDown = (keys) => keys.some((k) => this.activeKeys.has(k));

    this.state.thrust = isDown(CONFIG.KEYS.THRUST);
    this.state.reverse = isDown(CONFIG.KEYS.REVERSE);
    this.state.rotateLeft = isDown(CONFIG.KEYS.ROTATE_LEFT);
    this.state.rotateRight = isDown(CONFIG.KEYS.ROTATE_RIGHT);
    this.state.boost = isDown(CONFIG.KEYS.BOOST);

    eventBus.emit('INPUT_CHANGED', this.getState());
  }

  resetState() {
    this.state.thrust = false;
    this.state.reverse = false;
    this.state.rotateLeft = false;
    this.state.rotateRight = false;
    this.state.boost = false;
    this.state.radarPing = false;
    eventBus.emit('INPUT_CHANGED', this.getState());
  }

  getState() {
    return { ...this.state };
  }
}

export const inputManager = new InputManager();
export default inputManager;
