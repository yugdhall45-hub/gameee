/**
 * StorageService - LocalStorage Adapter for Offline Persistence & High Scores
 * Guarantees 100% functionality even when offline or before Firebase credentials are configured.
 */

import { CONFIG } from '../config.js';

export class StorageService {
  constructor() {
    this.keyLeaderboard = CONFIG.FIREBASE.LOCAL_STORAGE_KEY;
    this.keyStats = CONFIG.FIREBASE.LOCAL_STATS_KEY;
  }

  /**
   * Fetch local top scores
   */
  getLeaderboard() {
    try {
      const raw = localStorage.getItem(this.keyLeaderboard);
      if (!raw) {
        return this.getDefaultLeaderboard();
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[StorageService] Error loading local leaderboard:', e);
      return this.getDefaultLeaderboard();
    }
  }

  /**
   * Save a new score entry locally
   */
  saveScore({ name, score, distanceAU, sector }) {
    const list = this.getLeaderboard();
    const entry = {
      id: 'local_' + Date.now(),
      name: name || 'VOYAGER-PROBE',
      score: Math.round(score),
      distanceAU: parseFloat(distanceAU).toFixed(2),
      sector: sector || 'Outer Space',
      timestamp: Date.now()
    };

    list.push(entry);
    // Sort descending by score
    list.sort((a, b) => b.score - a.score);
    // Keep top entries
    const trimmed = list.slice(0, CONFIG.FIREBASE.MAX_LEADERBOARD_ENTRIES);

    try {
      localStorage.setItem(this.keyLeaderboard, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('[StorageService] Failed to persist score to localStorage:', e);
    }

    return trimmed;
  }

  /**
   * Default NASA voyager expedition hall of fame
   */
  getDefaultLeaderboard() {
    return [
      { name: 'VOYAGER-1', score: 38450, distanceAU: '162.40', sector: 'Heliopause & Interstellar', timestamp: 1700000000000 },
      { name: 'VOYAGER-2', score: 34120, distanceAU: '135.80', sector: 'Heliopause & Interstellar', timestamp: 1700000000000 },
      { name: 'PIONEER-10', score: 22800, distanceAU: '80.20', sector: 'Outer Ice Giants', timestamp: 1700000000000 },
      { name: 'NEW-HORIZONS', score: 18900, distanceAU: '55.10', sector: 'Saturnian Rings', timestamp: 1700000000000 },
      { name: 'CASSI-HUYGENS', score: 14500, distanceAU: '44.90', sector: 'Jovian Encounter', timestamp: 1700000000000 },
      { name: 'GALILEO', score: 9800, distanceAU: '24.30', sector: 'Jovian Encounter', timestamp: 1700000000000 }
    ];
  }
}

export const storageService = new StorageService();
export default storageService;
