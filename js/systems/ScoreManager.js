/**
 * ScoreManager - Scientific Scoring, Distance Tracking & Combo Multipliers
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../core/EventBus.js';

export class ScoreManager {
  constructor() {
    this.score = 0;
    this.distanceAU = 0;
    this.multiplier = 1.0;
    this.comboTimer = 0;
    this.goldenRecordsFound = 0;
    this.gravityAssistsDone = 0;

    this.bindEvents();
  }

  reset() {
    this.score = 0;
    this.distanceAU = 0;
    this.multiplier = 1.0;
    this.comboTimer = 0;
    this.goldenRecordsFound = 0;
    this.gravityAssistsDone = 0;
    this.broadcast();
  }

  bindEvents() {
    eventBus.on('ITEM_COLLECTED', ({ itemType, scoreValue }) => {
      if (itemType === 'GOLDEN_RECORD') {
        this.goldenRecordsFound++;
      }

      // Add score modified by multiplier
      const awarded = Math.round(scoreValue * this.multiplier);
      this.score += awarded;

      // Increment multiplier up to maximum
      this.multiplier = Math.min(CONFIG.SCORING.MAX_COMBO_MULTIPLIER, this.multiplier + 0.25);
      this.comboTimer = CONFIG.SCORING.COMBO_TIMEOUT_SECS;

      this.broadcast();
    });

    eventBus.on('GRAVITY_ASSIST_EXECUTED', ({ bonusScore }) => {
      this.gravityAssistsDone++;
      this.score += Math.round(bonusScore * this.multiplier);
      this.broadcast();
    });

    eventBus.on('SECTOR_ENTERED', ({ sectorId }) => {
      // Sector milestone reward
      this.score += sectorId * 1000;
      this.broadcast();
    });
  }

  update(dt, currentDistanceAU) {
    this.distanceAU = currentDistanceAU;

    // Decay combo multiplier if timer runs out
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.multiplier = 1.0;
        this.broadcast();
      }
    }

    // Distance points accumulate progressively
    this.score += Math.round(CONFIG.SCORING.DISTANCE_SCORE_PER_AU * dt * 0.1);
  }

  broadcast() {
    eventBus.emit('SCORE_UPDATED', {
      score: this.score,
      distanceAU: this.distanceAU,
      multiplier: Number(this.multiplier.toFixed(2)),
      goldenRecords: this.goldenRecordsFound,
      gravityAssists: this.gravityAssistsDone
    });
  }

  getFinalStats(sectorName) {
    return {
      score: this.score,
      distanceAU: this.distanceAU,
      goldenRecords: this.goldenRecordsFound,
      gravityAssists: this.gravityAssistsDone,
      sector: sectorName
    };
  }
}

export const scoreManager = new ScoreManager();
export default scoreManager;
