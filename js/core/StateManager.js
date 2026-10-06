/**
 * StateManager - Finite State Machine for Game Lifecycle
 * Orchestrates game phases and validates state transitions.
 */

import { eventBus } from './EventBus.js';

export const GAME_STATES = {
  BOOT: 'BOOT',
  MENU: 'MENU',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  SECTOR_WARP: 'SECTOR_WARP',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  LEADERBOARD: 'LEADERBOARD'
};

class StateManager {
  constructor() {
    this.currentState = GAME_STATES.BOOT;
    this.previousState = null;
    this.stateData = {};

    // Valid state transitions graph
    this.validTransitions = {
      [GAME_STATES.BOOT]: [GAME_STATES.MENU],
      [GAME_STATES.MENU]: [GAME_STATES.PLAYING, GAME_STATES.HOW_TO_PLAY, GAME_STATES.LEADERBOARD],
      [GAME_STATES.HOW_TO_PLAY]: [GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.PLAYING]: [GAME_STATES.PAUSED, GAME_STATES.SECTOR_WARP, GAME_STATES.GAME_OVER, GAME_STATES.VICTORY],
      [GAME_STATES.PAUSED]: [GAME_STATES.PLAYING, GAME_STATES.MENU],
      [GAME_STATES.SECTOR_WARP]: [GAME_STATES.PLAYING, GAME_STATES.GAME_OVER, GAME_STATES.VICTORY],
      [GAME_STATES.GAME_OVER]: [GAME_STATES.LEADERBOARD, GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.VICTORY]: [GAME_STATES.LEADERBOARD, GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.LEADERBOARD]: [GAME_STATES.MENU, GAME_STATES.PLAYING]
    };
  }

  /**
   * Check if current state matches query
   * @param {string} state
   * @returns {boolean}
   */
  is(state) {
    return this.currentState === state;
  }

  /**
   * Get current state
   * @returns {string}
   */
  get() {
    return this.currentState;
  }

  /**
   * Transition to a new state
   * @param {string} nextState
   * @param {object} context Additional data passed to listeners
   * @returns {boolean} Success
   */
  transitionTo(nextState, context = {}) {
    if (!GAME_STATES[nextState]) {
      console.error(`[StateManager] Invalid state target: "${nextState}"`);
      return false;
    }

    const allowed = this.validTransitions[this.currentState];
    if (!allowed || !allowed.includes(nextState)) {
      console.warn(`[StateManager] Transition rejected: ${this.currentState} -> ${nextState}`);
      return false;
    }

    const from = this.currentState;
    this.previousState = from;
    this.currentState = nextState;
    this.stateData = { ...context };

    console.log(`[StateManager] State changed: ${from} -> ${nextState}`, context);

    eventBus.emit('STATE_CHANGED', {
      from,
      to: nextState,
      context: this.stateData
    });

    return true;
  }

  /**
   * Toggle between PLAYING and PAUSED
   */
  togglePause() {
    if (this.currentState === GAME_STATES.PLAYING) {
      this.transitionTo(GAME_STATES.PAUSED);
    } else if (this.currentState === GAME_STATES.PAUSED) {
      this.transitionTo(GAME_STATES.PLAYING);
    }
  }
}

export const stateManager = new StateManager();
export default stateManager;
