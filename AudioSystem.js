/**
 * AudioSystem - Zero-Dependency Procedural Web Audio API Synthesizer
 * Generates dynamic cosmic sound effects, thruster rumbles, chimes, and alarms without external audio files.
 */

import { eventBus } from '../core/EventBus.js';

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.thrustOsc = null;
    this.thrustGain = null;

    this.initAudioContext();
    this.bindEvents();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    // Lazily instantiate on first user interaction to satisfy browser autoplay policies
    const unlock = () => {
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  bindEvents() {
    eventBus.on('AUDIO_TOGGLE_MUTE', () => this.toggleMute());

    eventBus.on('ITEM_COLLECTED', ({ itemType }) => {
      if (itemType === 'GOLDEN_RECORD') {
        this.playGoldenRecordChime();
      } else {
        this.playPickupChime();
      }
    });

    eventBus.on('HAZARD_HIT', () => {
      this.playImpactSound();
    });

    eventBus.on('GRAVITY_ASSIST_EXECUTED', () => {
      this.playSlingshotWarp();
    });

    eventBus.on('SECTOR_ENTERED', () => {
      this.playSectorMilestone();
    });

    eventBus.on('PLAYER_MOVED', ({ thrusting, boosting }) => {
      this.updateThrusterAudio(thrusting, boosting);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
    }
    eventBus.emit('AUDIO_MUTE_CHANGED', { isMuted: this.isMuted });
  }

  /**
   * Continuous procedural ion thruster drone
   */
  updateThrusterAudio(thrusting, boosting) {
    if (!this.ctx || this.isMuted) return;

    if (thrusting) {
      if (!this.thrustOsc) {
        this.thrustOsc = this.ctx.createOscillator();
        this.thrustGain = this.ctx.createGain();

        this.thrustOsc.type = 'sawtooth';
        this.thrustOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

        // Low-pass filter for deep engine rumble
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);

        this.thrustGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.thrustGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.1);

        this.thrustOsc.connect(filter);
        filter.connect(this.thrustGain);
        this.thrustGain.connect(this.masterGain);

        this.thrustOsc.start();
      }

      if (boosting) {
        this.thrustOsc.frequency.setTargetAtTime(110, this.ctx.currentTime, 0.05);
      } else {
        this.thrustOsc.frequency.setTargetAtTime(65, this.ctx.currentTime, 0.05);
      }
    } else {
      if (this.thrustGain && this.thrustOsc) {
        this.thrustGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        setTimeout(() => {
          if (this.thrustOsc) {
            try {
              this.thrustOsc.stop();
              this.thrustOsc.disconnect();
            } catch (e) {}
            this.thrustOsc = null;
            this.thrustGain = null;
          }
        }, 160);
      }
    }
  }

  /**
   * Sparkling chime when collecting telemetry or fuel
   */
  playPickupChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Majestic golden harmonic chord for Golden Record discoveries
   */
  playGoldenRecordChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const freqs = [440, 554.37, 659.25, 880]; // A Major Chord

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.9);
    });
  }

  /**
   * Deep metallic impact thud when taking hull damage
   */
  playImpactSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Rising Doppler whoosh during gravity assist slingshots
   */
  playSlingshotWarp() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.65);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  /**
   * Ambient sector milestone gong
   */
  playSectorMilestone() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }
}

export const audioSystem = new AudioSystem();
export default audioSystem;
