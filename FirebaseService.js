/**
 * FirebaseService - Cloud Firestore & Anonymous Authentication Integration
 * Provides zero-friction anonymous sign-in, real-time leaderboard sync, and automatic local fallback.
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../core/EventBus.js';
import { storageService } from './StorageService.js';

export class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.isOnline = false;
    this.mode = 'LOCAL_OFFLINE'; // 'CLOUD' or 'LOCAL_OFFLINE'
  }

  /**
   * Initialize Firebase SDK if credentials and scripts exist
   * @param {object} config Firebase configuration object
   */
  async init(config = null) {
    try {
      // Check if global Firebase SDK is loaded from CDN
      if (window.firebase && config && config.apiKey && config.apiKey !== 'YOUR_API_KEY') {
        this.app = window.firebase.initializeApp(config);
        this.auth = window.firebase.auth();
        this.db = window.firebase.firestore();

        // Sign in anonymously for zero-friction player identity
        const userCred = await this.auth.signInAnonymously();
        this.currentUser = userCred.user;
        this.isOnline = true;
        this.mode = 'CLOUD';

        console.log('[FirebaseService] Connected to Cloud Firestore. Player UID:', this.currentUser.uid);
      } else {
        console.log('[FirebaseService] Running in Local Offline Mode (LocalStorage).');
        this.isOnline = false;
        this.mode = 'LOCAL_OFFLINE';
      }
    } catch (err) {
      console.warn('[FirebaseService] Cloud connection failed, fallback to offline mode:', err);
      this.isOnline = false;
      this.mode = 'LOCAL_OFFLINE';
    }

    eventBus.emit('FIREBASE_STATUS_CHANGED', {
      isOnline: this.isOnline,
      mode: this.mode,
      uid: this.currentUser ? this.currentUser.uid : 'local-pilot'
    });
  }

  /**
   * Fetch top leaderboard scores from Cloud Firestore or LocalStorage fallback
   */
  async fetchLeaderboard() {
    if (this.isOnline && this.db) {
      try {
        const snapshot = await this.db
          .collection(CONFIG.FIREBASE.COLLECTION_LEADERBOARD)
          .orderBy('score', 'desc')
          .limit(CONFIG.FIREBASE.MAX_LEADERBOARD_ENTRIES)
          .get();

        const results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        if (results.length > 0) {
          return results;
        }
      } catch (err) {
        console.warn('[FirebaseService] Failed to query Cloud Firestore, falling back to local cache:', err);
      }
    }

    return storageService.getLeaderboard();
  }

  /**
   * Submit new expedition score
   */
  async submitScore({ name, score, distanceAU, sector }) {
    const entry = {
      name: (name || 'VOYAGER-PROBE').toUpperCase().trim().slice(0, 16),
      score: Math.round(score),
      distanceAU: parseFloat(distanceAU).toFixed(2),
      sector: sector || 'Interstellar Space',
      uid: this.currentUser ? this.currentUser.uid : 'anon-' + Date.now(),
      createdAt: Date.now()
    };

    if (this.isOnline && this.db) {
      try {
        await this.db.collection(CONFIG.FIREBASE.COLLECTION_LEADERBOARD).add(entry);
        console.log('[FirebaseService] Score submitted to Cloud Firestore successfully.');
      } catch (err) {
        console.warn('[FirebaseService] Could not send score to Cloud Firestore:', err);
      }
    }

    // Always mirror to local storage
    storageService.saveScore(entry);

    eventBus.emit('SCORE_SUBMITTED', entry);
    return entry;
  }
}

export const firebaseService = new FirebaseService();
export default firebaseService;
