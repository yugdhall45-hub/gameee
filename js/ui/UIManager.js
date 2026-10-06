/**
 * UIManager - Screen Transitions, Modals & Button Interactions Coordinator
 */

import { eventBus } from '../core/EventBus.js';
import { stateManager, GAME_STATES } from '../core/StateManager.js';
import { leaderboardView } from './LeaderboardView.js';
import { firebaseService } from '../services/FirebaseService.js';
import { scoreManager } from '../systems/ScoreManager.js';
import { sectorManager } from '../systems/SectorManager.js';

export class UIManager {
  constructor() {
    this.modals = {
      start: document.getElementById('modal-start'),
      howToPlay: document.getElementById('modal-how-to-play'),
      pause: document.getElementById('modal-pause'),
      gameOver: document.getElementById('modal-gameover'),
      victory: document.getElementById('modal-victory')
    };

    this.bindButtons();
    this.bindStateTransitions();
  }

  bindButtons() {
    // 1. Launch Game
    const btnLaunch = document.getElementById('btn-launch-game');
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        eventBus.emit('START_NEW_GAME');
      });
    }

    // 2. How To Play
    const btnHowTo = document.getElementById('btn-how-to-play');
    if (btnHowTo) {
      btnHowTo.addEventListener('click', () => {
        this.showModal('howToPlay');
      });
    }
    const btnCloseHowTo = document.getElementById('btn-close-how-to');
    if (btnCloseHowTo) {
      btnCloseHowTo.addEventListener('click', () => {
        this.showModal('start');
      });
    }

    // 3. Leaderboard buttons
    const btnOpenLb = document.getElementById('btn-open-leaderboard');
    if (btnOpenLb) {
      btnOpenLb.addEventListener('click', () => {
        leaderboardView.show();
      });
    }
    const btnHudLb = document.getElementById('btn-hud-leaderboard');
    if (btnHudLb) {
      btnHudLb.addEventListener('click', () => {
        leaderboardView.show();
      });
    }

    // 4. Pause & Resume
    const btnResume = document.getElementById('btn-resume-game');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        stateManager.transitionTo(GAME_STATES.PLAYING);
      });
    }
    const btnHudPause = document.getElementById('btn-hud-pause');
    if (btnHudPause) {
      btnHudPause.addEventListener('click', () => {
        stateManager.togglePause();
      });
    }

    // 5. Submit Score & Restart (Game Over)
    const btnSubmitGameOver = document.getElementById('btn-submit-gameover');
    if (btnSubmitGameOver) {
      btnSubmitGameOver.addEventListener('click', async () => {
        const input = document.getElementById('input-callsign-gameover');
        const callsign = (input && input.value) ? input.value : 'VOYAGER';
        const stats = scoreManager.getFinalStats(sectorManager.getCurrentSector().name);

        btnSubmitGameOver.disabled = true;
        btnSubmitGameOver.textContent = 'Transmitting...';

        await firebaseService.submitScore({
          name: callsign,
          score: stats.score,
          distanceAU: stats.distanceAU,
          sector: stats.sector
        });

        btnSubmitGameOver.disabled = false;
        btnSubmitGameOver.textContent = 'Submit Log & Re-Launch';

        eventBus.emit('START_NEW_GAME');
      });
    }

    // 6. Submit Score (Victory)
    const btnSubmitVictory = document.getElementById('btn-submit-victory');
    if (btnSubmitVictory) {
      btnSubmitVictory.addEventListener('click', async () => {
        const input = document.getElementById('input-callsign-victory');
        const callsign = (input && input.value) ? input.value : 'VOYAGER';
        const stats = scoreManager.getFinalStats('Interstellar Space');

        await firebaseService.submitScore({
          name: callsign,
          score: stats.score,
          distanceAU: stats.distanceAU,
          sector: stats.sector
        });

        eventBus.emit('START_NEW_GAME');
      });
    }
  }

  bindStateTransitions() {
    eventBus.on('STATE_CHANGED', ({ to, context }) => {
      this.hideAllModals();

      if (to === GAME_STATES.MENU) {
        this.showModal('start');
      } else if (to === GAME_STATES.PAUSED) {
        this.showModal('pause');
      } else if (to === GAME_STATES.GAME_OVER) {
        this.populateGameOver(context);
        this.showModal('gameOver');
      } else if (to === GAME_STATES.VICTORY) {
        this.populateVictory(context);
        this.showModal('victory');
      }
    });
  }

  showModal(name) {
    this.hideAllModals();
    if (this.modals[name]) {
      this.modals[name].classList.remove('hidden');
    }
  }

  hideAllModals() {
    Object.values(this.modals).forEach((m) => {
      if (m) m.classList.add('hidden');
    });
  }

  populateGameOver(context) {
    const stats = scoreManager.getFinalStats(sectorManager.getCurrentSector().name);

    const elScore = document.getElementById('gameover-stat-score');
    if (elScore) elScore.textContent = stats.score.toLocaleString();

    const elDist = document.getElementById('gameover-stat-distance');
    if (elDist) elDist.textContent = `${stats.distanceAU.toFixed(2)} AU`;

    const elRecords = document.getElementById('gameover-stat-records');
    if (elRecords) elRecords.textContent = `${stats.goldenRecords}`;

    const elSlingshots = document.getElementById('gameover-stat-assists');
    if (elSlingshots) elSlingshots.textContent = `${stats.gravityAssists}`;

    const elReason = document.getElementById('gameover-reason');
    if (elReason) elReason.textContent = context.reason || 'Mission Terminated';
  }

  populateVictory(context) {
    const stats = scoreManager.getFinalStats('Interstellar Medium');

    const elScore = document.getElementById('victory-stat-score');
    if (elScore) elScore.textContent = stats.score.toLocaleString();

    const elDist = document.getElementById('victory-stat-distance');
    if (elDist) elDist.textContent = `${stats.distanceAU.toFixed(2)} AU`;
  }
}

export const uiManager = new UIManager();
export default uiManager;
