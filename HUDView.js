/**
 * HUDView - Heads-Up Display Telemetry & Radar Scanner
 * Manages gauges, AU counters, score readouts, and the 360-degree radar scanner.
 */

import { eventBus } from '../core/EventBus.js';
import { entityManager } from '../entities/EntityManager.js';

export class HUDView {
  constructor() {
    this.dom = {
      score: document.getElementById('hud-score'),
      distance: document.getElementById('hud-distance'),
      multiplier: document.getElementById('hud-multiplier'),
      sectorTitle: document.getElementById('hud-sector-title'),
      sectorSubtitle: document.getElementById('hud-sector-subtitle'),
      hullFill: document.getElementById('hud-hull-fill'),
      hullPct: document.getElementById('hud-hull-pct'),
      energyFill: document.getElementById('hud-energy-fill'),
      energyPct: document.getElementById('hud-energy-pct'),
      toasts: document.getElementById('toast-container'),
      radarCanvas: document.getElementById('radar-canvas'),
      btnMute: document.getElementById('btn-hud-mute')
    };

    this.radarCtx = this.dom.radarCanvas ? this.dom.radarCanvas.getContext('2d') : null;
    this.radarSweepAngle = 0;

    this.bindEvents();
  }

  bindEvents() {
    // 1. Player Telemetry Updates
    eventBus.on('PLAYER_MOVED', ({ hull, maxHull, energy, maxEnergy }) => {
      // Hull Gauge
      const hullRatio = Math.max(0, Math.min(1, hull / maxHull));
      const hullPercent = Math.round(hullRatio * 100);
      if (this.dom.hullFill) {
        this.dom.hullFill.style.width = `${hullPercent}%`;
        if (hullPercent <= 25) {
          this.dom.hullFill.classList.add('danger');
        } else {
          this.dom.hullFill.classList.remove('danger');
        }
      }
      if (this.dom.hullPct) {
        this.dom.hullPct.textContent = `${hullPercent}%`;
      }

      // Energy Gauge
      const energyRatio = Math.max(0, Math.min(1, energy / maxEnergy));
      const energyPercent = Math.round(energyRatio * 100);
      if (this.dom.energyFill) {
        this.dom.energyFill.style.width = `${energyPercent}%`;
      }
      if (this.dom.energyPct) {
        this.dom.energyPct.textContent = `${energyPercent}%`;
      }
    });

    // 2. Score & Distance Updates
    eventBus.on('SCORE_UPDATED', ({ score, distanceAU, multiplier }) => {
      if (this.dom.score) {
        this.dom.score.textContent = score.toLocaleString();
      }
      if (this.dom.distance) {
        this.dom.distance.textContent = `${distanceAU.toFixed(2)} AU`;
      }
      if (this.dom.multiplier) {
        if (multiplier > 1.0) {
          this.dom.multiplier.style.display = 'inline-block';
          this.dom.multiplier.textContent = `x${multiplier.toFixed(1)}`;
        } else {
          this.dom.multiplier.style.display = 'none';
        }
      }
    });

    // 3. Sector Progression Updates
    eventBus.on('SECTOR_ENTERED', ({ name, subtitle }) => {
      if (this.dom.sectorTitle) this.dom.sectorTitle.textContent = name;
      if (this.dom.sectorSubtitle) this.dom.sectorSubtitle.textContent = subtitle;
      this.showToast(`🛰️ ARRIVED: ${name}`, 3500);
    });

    // 4. Discovery Toasts
    eventBus.on('ITEM_COLLECTED', ({ label, scoreValue }) => {
      this.showToast(`✨ ${label} (+${scoreValue} PTS)`, 2400);
    });

    eventBus.on('GRAVITY_ASSIST_EXECUTED', ({ planetName, bonusScore }) => {
      this.showToast(`🪐 ${planetName.toUpperCase()} GRAVITY ASSIST! (+${bonusScore} PTS)`, 3000);
    });

    // 5. Audio Mute Icon
    eventBus.on('AUDIO_MUTE_CHANGED', ({ isMuted }) => {
      if (this.dom.btnMute) {
        this.dom.btnMute.innerHTML = isMuted ? '🔇' : '🔊';
      }
    });
  }

  showToast(message, duration = 2500) {
    if (!this.dom.toasts) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    this.dom.toasts.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  /**
   * Render real-time radar sweep and nearby cosmic radar contacts
   */
  renderRadar(dt) {
    if (!this.radarCtx || !this.dom.radarCanvas) return;
    const ctx = this.radarCtx;
    const size = this.dom.radarCanvas.width;
    const center = size / 2;
    const range = 2400; // Radar range in world pixels

    ctx.clearRect(0, 0, size, size);

    // 1. Radar Grid Circles
    ctx.strokeStyle = 'rgba(76, 201, 240, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.45, 0, Math.PI * 2);
    ctx.arc(center, center, center * 0.9, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, size);
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    // 2. Rotating Radar Sweep Beam
    this.radarSweepAngle += 2.5 * dt;
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(this.radarSweepAngle);
    const sweepGrad = ctx.createLinearGradient(0, 0, center * 0.9, 0);
    sweepGrad.addColorStop(0, 'rgba(76, 201, 240, 0)');
    sweepGrad.addColorStop(1, 'rgba(76, 201, 240, 0.45)');
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, center * 0.9, 0, 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Center Probe Marker
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(center, center, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const probe = entityManager.probe;
    if (!probe) return;

    // Helper to map world delta to radar coordinates
    const toRadarCoord = (wx, wy) => {
      const dx = wx - probe.x;
      const dy = wy - probe.y;
      const rx = center + (dx / range) * (center * 0.9);
      const ry = center + (dy / range) * (center * 0.9);
      return { rx, ry, inRange: Math.hypot(dx, dy) <= range };
    };

    // 4. Plot Celestial Bodies
    entityManager.celestialBodies.forEach((b) => {
      const { rx, ry, inRange } = toRadarCoord(b.x, b.y);
      if (inRange) {
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(rx, ry, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Plot Collectibles
    entityManager.collectibles.forEach((c) => {
      const { rx, ry, inRange } = toRadarCoord(c.x, c.y);
      if (inRange) {
        ctx.fillStyle = c.itemType === 'GOLDEN_RECORD' ? '#ffd166' : '#06d6a0';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Plot Hazards
    entityManager.hazards.forEach((h) => {
      const { rx, ry, inRange } = toRadarCoord(h.x, h.y);
      if (inRange) {
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

export const hudView = new HUDView();
export default hudView;
