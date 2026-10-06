/**
 * LeaderboardView - High Score Rankings & Mission Log Submission
 */

import { eventBus } from '../core/EventBus.js';
import { firebaseService } from '../services/FirebaseService.js';

export class LeaderboardView {
  constructor() {
    this.dom = {
      modal: document.getElementById('modal-leaderboard'),
      tableBody: document.getElementById('leaderboard-tbody'),
      statusPill: document.getElementById('cloud-status-indicator'),
      btnClose: document.getElementById('btn-close-leaderboard')
    };

    this.bindEvents();
  }

  bindEvents() {
    if (this.dom.btnClose) {
      this.dom.btnClose.addEventListener('click', () => this.hide());
    }

    eventBus.on('FIREBASE_STATUS_CHANGED', ({ mode }) => {
      this.updateStatusPill(mode);
    });
  }

  updateStatusPill(mode) {
    if (!this.dom.statusPill) return;
    if (mode === 'CLOUD') {
      this.dom.statusPill.className = 'cloud-status-pill';
      this.dom.statusPill.innerHTML = '● CLOUD FIRESTORE SYNC';
    } else {
      this.dom.statusPill.className = 'cloud-status-pill offline';
      this.dom.statusPill.innerHTML = '● LOCAL RECOVERY MODE';
    }
  }

  async show() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.remove('hidden');
    await this.renderTable();
  }

  hide() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.add('hidden');
  }

  async renderTable() {
    if (!this.dom.tableBody) return;
    this.dom.tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Fetching deep-space logs...</td></tr>';

    try {
      const entries = await firebaseService.fetchLeaderboard();
      this.dom.tableBody.innerHTML = '';

      if (!entries || entries.length === 0) {
        this.dom.tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No expeditions recorded yet.</td></tr>';
        return;
      }

      entries.forEach((item, index) => {
        const row = document.createElement('tr');
        const isTop = index === 0;

        let rankBadge = `${index + 1}`;
        if (index === 0) rankBadge = '🥇 1';
        else if (index === 1) rankBadge = '🥈 2';
        else if (index === 2) rankBadge = '🥉 3';

        row.innerHTML = `
          <td class="${isTop ? 'rank-top' : ''}">${rankBadge}</td>
          <td style="font-weight: 600; color: #ffffff;">${item.name || 'ANON-PROBE'}</td>
          <td style="color: var(--accent-cyan); font-weight: 700;">${(item.score || 0).toLocaleString()}</td>
          <td>${item.distanceAU || '0.00'} AU</td>
          <td style="color: var(--text-muted); font-size: 11px;">${item.sector || 'Deep Space'}</td>
        `;

        this.dom.tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('[LeaderboardView] Render error:', err);
      this.dom.tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #e63946;">Telemetry link failed.</td></tr>';
    }
  }
}

export const leaderboardView = new LeaderboardView();
export default leaderboardView;
