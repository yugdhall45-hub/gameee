/**
 * ApiService - Client HTTP Adapter for Voyager Backend API
 * Connects to the local/remote backend server for verified leaderboard & telemetry logging.
 * Gracefully handles offline states or unbooted backend.
 */

export class ApiService {
  constructor(baseUrl = 'http://localhost:4000/api') {
    this.baseUrl = baseUrl;
    this.isServerReachable = false;
  }

  /**
   * Check if backend API server is online
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        this.isServerReachable = true;
        return data;
      }
    } catch {
      this.isServerReachable = false;
    }
    return null;
  }

  /**
   * Fetch leaderboard from backend
   */
  async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/leaderboard?limit=${limit}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.leaderboard || [];
    } catch (err) {
      console.warn('[ApiService] Backend unreachable, falling back to local/cloud adapter:', err.message);
      return null;
    }
  }

  /**
   * Submit verified score to backend
   */
  async submitScore(entry) {
    try {
      const response = await fetch(`${this.baseUrl}/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('[ApiService] Score submission failed on backend:', err.message);
      return null;
    }
  }

  /**
   * Send live flight telemetry packet to backend
   */
  async sendTelemetry(packet) {
    try {
      const response = await fetch(`${this.baseUrl}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
