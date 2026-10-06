/**
 * Collectible - Golden Records, Science Telemetry, Energy Cells, & Nanites
 * Features distinctive pulsing cosmic beacons and authentic Voyager Golden Record visuals.
 */

import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Collectible extends Entity {
  constructor({
    x = 0,
    y = 0,
    itemType = 'SCIENCE_DATA'
  } = {}) {
    const spec = CONFIG.COLLECTIBLES[itemType] || CONFIG.COLLECTIBLES.SCIENCE_DATA;

    super({
      x,
      y,
      radius: spec.radius,
      type: 'COLLECTIBLE'
    });

    this.itemType = itemType;
    this.spec = spec;
    this.scoreValue = spec.score;
    this.energyRestore = spec.energyRestore;
    this.hullRestore = spec.hullRestore;
    this.label = spec.label;
    this.color = spec.color;

    this.pulseTimer = Math.random() * Math.PI * 2;
    this.pulseSpeed = spec.pulseSpeed || 3.0;
  }

  update(dt) {
    super.update(dt);
    this.pulseTimer += this.pulseSpeed * dt;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const pulse = 1 + 0.18 * Math.sin(this.pulseTimer);
    const glowAlpha = 0.25 + 0.2 * Math.sin(this.pulseTimer);

    // 1. Ambient Beacon Ring
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * (1.6 + 0.3 * Math.sin(this.pulseTimer)), 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = glowAlpha;
    ctx.stroke();

    ctx.globalAlpha = 1.0;

    // 2. Specific Renderers by Type
    if (this.itemType === 'GOLDEN_RECORD') {
      this.renderGoldenRecord(ctx, pulse);
    } else if (this.itemType === 'ENERGY_CELL') {
      this.renderEnergyCell(ctx, pulse);
    } else if (this.itemType === 'REPAIR_NANITES') {
      this.renderRepairNanites(ctx, pulse);
    } else {
      this.renderScienceData(ctx, pulse);
    }

    ctx.restore();
  }

  /**
   * The Legendary Voyager Golden Record
   */
  renderGoldenRecord(ctx, pulse) {
    const r = this.radius * pulse;

    // Golden Record Outer Disc
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();
    ctx.strokeStyle = '#e09f3e';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Grooves
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.strokeStyle = '#d48b26';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // Center Spindle & Pulsar Star Map Lines
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#212529';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-r * 0.4, 0);
    ctx.lineTo(r * 0.4, 0);
    ctx.moveTo(0, -r * 0.4);
    ctx.lineTo(0, r * 0.4);
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /**
   * Radioisotope Energy Cell
   */
  renderEnergyCell(ctx, pulse) {
    const r = this.radius * pulse;

    // Glowing Diamond
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.8, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.8, 0);
    ctx.closePath();
    ctx.fillStyle = '#4cc9f0';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lightning Bolt Glyph
    ctx.beginPath();
    ctx.moveTo(1, -r * 0.5);
    ctx.lineTo(-3, 0);
    ctx.lineTo(2, 0);
    ctx.lineTo(-1, r * 0.5);
    ctx.strokeStyle = '#060814';
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  /**
   * Emergency Repair Nanites
   */
  renderRepairNanites(ctx, pulse) {
    const r = this.radius * pulse;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#06d6a0';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Medical Cross
    ctx.fillStyle = '#060814';
    ctx.fillRect(-2, -r * 0.6, 4, r * 1.2);
    ctx.fillRect(-r * 0.6, -2, r * 1.2, 4);
  }

  /**
   * Scientific Telemetry Packet
   */
  renderScienceData(ctx, pulse) {
    const r = this.radius * pulse;

    // Hexagon Data Crystal
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const hx = Math.cos(a) * r;
      const hy = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fillStyle = '#7209b7';
    ctx.fill();
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central Data Core
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#f72585';
    ctx.fill();
  }
}

export default Collectible;
