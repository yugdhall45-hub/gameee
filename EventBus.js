/**
 * EventBus - Centralized Typed Publish/Subscribe Message Hub
 * Ensures total decoupling between game components and allows parallel AI agent development.
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = 100;
  }

  /**
   * Subscribe to an event topic
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      console.warn(`[EventBus] Attempted to subscribe non-function to "${event}"`);
      return () => {};
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe a callback from an event topic
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const bucket = this.listeners.get(event);
    bucket.delete(callback);
    if (bucket.size === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Subscribe to an event topic for a single trigger
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    const wrapped = (payload) => {
      this.off(event, wrapped);
      callback(payload);
    };
    this.on(event, wrapped);
  }

  /**
   * Broadcast an event to all subscribers with payload
   * @param {string} event
   * @param {any} payload
   */
  emit(event, payload = null) {
    if (!this.listeners.has(event)) return;

    const bucket = this.listeners.get(event);
    bucket.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`[EventBus] Error in listener for "${event}":`, err);
      }
    });
  }

  /**
   * Clear all subscribers (useful for resets)
   */
  clear() {
    this.listeners.clear();
  }
}

// Global Singleton Export
export const eventBus = new EventBus();
export default eventBus;
