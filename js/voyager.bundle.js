/**
 * Voyager: Interstellar Odyssey - Standalone Production Bundle
 * Combines all decoupled engine modules into a zero-dependency, ultra-reliable bundle.
 */

// 1. CONFIGURATION
const CONFIG = {
  VERSION: '1.0.0',
  GAME_TITLE: 'VOYAGER: Interstellar Odyssey',
  DISPLAY: {
    TARGET_FPS: 60,
    PHYSICS_TIMESTEP: 1 / 60,
    MAX_DELTA: 0.1,
    STARS_COUNT: 220,
    COSMIC_DUST_COUNT: 45,
    PARALLAX_LAYERS: 3
  },
  PROBE: {
    RADIUS: 18,
    MASS: 1.0,
    THRUST_POWER: 420,
    BOOST_MULTIPLIER: 1.8,
    ROTATION_SPEED: 4.2,
    LINEAR_DAMPING: 0.992,
    ANGULAR_DAMPING: 0.94,
    MAX_SPEED: 700,
    INITIAL_HULL: 100,
    INITIAL_ENERGY: 100,
    ENERGY_DRAIN_THRUST: 12,
    ENERGY_DRAIN_BOOST: 28,
    PASSIVE_ENERGY_REGEN: 3.5,
    INVULNERABILITY_TIME: 1.8
  },
  GRAVITY: {
    G_CONSTANT: 125000,
    ASSIST_BONUS_MIN_DIST: 90,
    ASSIST_VELOCITY_BOOST: 1.35,
    ASSIST_SCORE_AWARD: 1500
  },
  SECTORS: [
    {
      id: 1,
      name: 'Sector I: Asteroid Belt',
      subtitle: 'Inner Solar System Boundary',
      distanceStartAU: 0,
      distanceEndAU: 20,
      hazardDensity: 0.65,
      bodyType: 'MARS_ORBIT',
      themeColor: '#e07a5f',
      ambientColor: 'rgba(224, 122, 95, 0.08)'
    },
    {
      id: 2,
      name: 'Sector II: Jovian Encounter',
      subtitle: 'Jupiter Gravity Assist & Radiation Belts',
      distanceStartAU: 20,
      distanceEndAU: 45,
      hazardDensity: 0.85,
      bodyType: 'JUPITER',
      themeColor: '#f4a261',
      ambientColor: 'rgba(244, 162, 97, 0.09)'
    },
    {
      id: 3,
      name: 'Sector III: Saturnian Rings',
      subtitle: 'Ring Plane Transit & Titan Flyby',
      distanceStartAU: 45,
      distanceEndAU: 75,
      hazardDensity: 1.0,
      bodyType: 'SATURN',
      themeColor: '#e9c46a',
      ambientColor: 'rgba(233, 196, 106, 0.08)'
    },
    {
      id: 4,
      name: 'Sector IV: Outer Ice Giants',
      subtitle: 'Uranus, Neptune & Deep Freeze',
      distanceStartAU: 75,
      distanceEndAU: 110,
      hazardDensity: 1.15,
      bodyType: 'NEPTUNE',
      themeColor: '#4ea8de',
      ambientColor: 'rgba(78, 168, 222, 0.09)'
    },
    {
      id: 5,
      name: 'Sector V: Heliopause & Interstellar Space',
      subtitle: 'Terminal Shock & Beyond the Sun',
      distanceStartAU: 110,
      distanceEndAU: 150,
      hazardDensity: 1.35,
      bodyType: 'VOYAGER_HORIZON',
      themeColor: '#9d4edd',
      ambientColor: 'rgba(157, 78, 221, 0.12)'
    }
  ],
  HAZARDS: {
    ASTEROID_SMALL: { radius: 14, damage: 15, scoreKill: 100, mass: 2.0, color: '#8d99ae' },
    ASTEROID_MEDIUM: { radius: 26, damage: 30, scoreKill: 200, mass: 6.0, color: '#6c757d' },
    ASTEROID_LARGE: { radius: 44, damage: 55, scoreKill: 400, mass: 18.0, color: '#495057' },
    SPACE_JUNK: { radius: 18, damage: 20, scoreKill: 150, mass: 3.0, color: '#00f5d4' },
    COMET: { radius: 22, damage: 40, speed: 280, scoreKill: 350, mass: 4.5, color: '#70d6ff' }
  },
  COLLECTIBLES: {
    GOLDEN_RECORD: { radius: 16, score: 5000, energyRestore: 30, hullRestore: 20, label: 'Golden Record Fragment', color: '#ffd166', pulseSpeed: 3.5 },
    SCIENCE_DATA: { radius: 12, score: 1200, energyRestore: 10, hullRestore: 0, label: 'Planetary Telemetry', color: '#06d6a0', pulseSpeed: 2.5 },
    ENERGY_CELL: { radius: 14, score: 500, energyRestore: 55, hullRestore: 0, label: 'Radioisotope Cell', color: '#4cc9f0', pulseSpeed: 2.0 },
    REPAIR_NANITES: { radius: 14, score: 800, energyRestore: 15, hullRestore: 35, label: 'Emergency Repair Nanites', color: '#118ab2', pulseSpeed: 2.2 }
  },
  SCORING: {
    DISTANCE_SCORE_PER_AU: 200,
    COMBO_TIMEOUT_SECS: 4.0,
    MAX_COMBO_MULTIPLIER: 5.0,
    GRAVITY_SLINGSHOT_SCORE: 2500
  },
  KEYS: {
    THRUST: ['KeyW', 'ArrowUp'],
    REVERSE: ['KeyS', 'ArrowDown'],
    ROTATE_LEFT: ['KeyA', 'ArrowLeft'],
    ROTATE_RIGHT: ['KeyD', 'ArrowRight'],
    BOOST: ['Space'],
    PING_RADAR: ['KeyE', 'KeyF'],
    PAUSE: ['KeyP', 'Escape'],
    MUTE: ['KeyM']
  },
  FIREBASE: {
    COLLECTION_LEADERBOARD: 'voyager_leaderboard',
    COLLECTION_EXPEDITIONS: 'voyager_expeditions',
    MAX_LEADERBOARD_ENTRIES: 20,
    LOCAL_STORAGE_KEY: 'voyager_offline_leaderboard_v1',
    LOCAL_STATS_KEY: 'voyager_local_stats_v1'
  }
};

// 2. EVENT BUS
class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  on(event, callback) {
    if (typeof callback !== 'function') return () => {};
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const bucket = this.listeners.get(event);
    bucket.delete(callback);
    if (bucket.size === 0) this.listeners.delete(event);
  }
  emit(event, payload = null) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((cb) => {
      try { cb(payload); } catch (e) { console.error(`[EventBus] ${event}:`, e); }
    });
  }
}
const eventBus = new EventBus();

// 3. STATE MANAGER
const GAME_STATES = {
  BOOT: 'BOOT',
  MENU: 'MENU',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  SECTOR_WARP: 'SECTOR_WARP',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  LEADERBOARD: 'LEADERBOARD'
};

class StateManager {
  constructor() {
    this.currentState = GAME_STATES.BOOT;
    this.previousState = null;
    this.stateData = {};
    this.validTransitions = {
      [GAME_STATES.BOOT]: [GAME_STATES.MENU],
      [GAME_STATES.MENU]: [GAME_STATES.PLAYING, GAME_STATES.HOW_TO_PLAY, GAME_STATES.LEADERBOARD],
      [GAME_STATES.HOW_TO_PLAY]: [GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.PLAYING]: [GAME_STATES.PAUSED, GAME_STATES.SECTOR_WARP, GAME_STATES.GAME_OVER, GAME_STATES.VICTORY],
      [GAME_STATES.PAUSED]: [GAME_STATES.PLAYING, GAME_STATES.MENU],
      [GAME_STATES.SECTOR_WARP]: [GAME_STATES.PLAYING, GAME_STATES.GAME_OVER, GAME_STATES.VICTORY],
      [GAME_STATES.GAME_OVER]: [GAME_STATES.LEADERBOARD, GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.VICTORY]: [GAME_STATES.LEADERBOARD, GAME_STATES.MENU, GAME_STATES.PLAYING],
      [GAME_STATES.LEADERBOARD]: [GAME_STATES.MENU, GAME_STATES.PLAYING]
    };
  }
  is(s) { return this.currentState === s; }
  transitionTo(nextState, context = {}) {
    const allowed = this.validTransitions[this.currentState];
    if (!allowed || !allowed.includes(nextState)) return false;
    const from = this.currentState;
    this.previousState = from;
    this.currentState = nextState;
    this.stateData = { ...context };
    eventBus.emit('STATE_CHANGED', { from, to: nextState, context: this.stateData });
    return true;
  }
  togglePause() {
    if (this.currentState === GAME_STATES.PLAYING) this.transitionTo(GAME_STATES.PAUSED);
    else if (this.currentState === GAME_STATES.PAUSED) this.transitionTo(GAME_STATES.PLAYING);
  }
}
const stateManager = new StateManager();

// 4. PARTICLE SYSTEM
class ParticleSystem {
  constructor(maxParticles = 600) {
    this.maxParticles = maxParticles;
    this.particles = [];
  }
  emit({ x, y, count = 10, speed = 100, spread = Math.PI * 2, angle = 0, color = '#4cc9f0', sizeMin = 1.5, sizeMax = 3.5, lifeMin = 0.3, lifeMax = 0.8, vx = 0, vy = 0 }) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const pAngle = angle + (Math.random() - 0.5) * spread;
      const pSpeed = speed * (0.4 + Math.random() * 0.6);
      const life = lifeMin + Math.random() * (lifeMax - lifeMin);
      const size = sizeMin + Math.random() * (sizeMax - sizeMin);
      this.particles.push({
        x, y,
        vx: Math.cos(pAngle) * pSpeed + vx * 0.2,
        vy: Math.sin(pAngle) * pSpeed + vy * 0.2,
        size, initialSize: size, color, life, maxLife: life
      });
    }
  }
  emitThruster(x, y, angle, isBoost = false, probeVx = 0, probeVy = 0) {
    this.emit({
      x, y,
      count: isBoost ? 4 : 2,
      speed: isBoost ? 180 : 120,
      spread: 0.35,
      angle: angle + Math.PI,
      color: isBoost ? '#ffd166' : '#4cc9f0',
      sizeMin: isBoost ? 2.5 : 1.5,
      sizeMax: isBoost ? 4.5 : 3.0,
      lifeMin: 0.2,
      lifeMax: isBoost ? 0.5 : 0.35,
      vx: probeVx * 0.3,
      vy: probeVy * 0.3
    });
  }
  emitExplosion(x, y, color = '#f72585', count = 30) {
    this.emit({ x, y, count, speed: 190, spread: Math.PI * 2, color, sizeMin: 2.0, sizeMax: 5.5, lifeMin: 0.4, lifeMax: 1.1 });
  }
  emitSparkles(x, y, color = '#ffd166', count = 20) {
    this.emit({ x, y, count, speed: 90, spread: Math.PI * 2, color, sizeMin: 1.5, sizeMax: 3.5, lifeMin: 0.5, lifeMax: 1.2 });
  }
  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.size = p.initialSize * (p.life / p.maxLife);
    }
  }
  render(ctx) {
    if (this.particles.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  clear() { this.particles = []; }
}
const particleSystem = new ParticleSystem();

// 5. BASE ENTITY
class Entity {
  constructor({ x = 0, y = 0, radius = 10, mass = 1.0, type = 'ENTITY' } = {}) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.radius = radius;
    this.mass = mass;
    this.type = type;
    this.alive = true;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.angularVelocity * dt;
  }
  render(ctx) {}
  isAlive() { return this.alive; }
  destroy() { this.alive = false; }
  distanceTo(other) { return Math.hypot(this.x - other.x, this.y - other.y); }
}

// 6. PROBE SPACECRAFT
class Probe extends Entity {
  constructor(x = 0, y = 0) {
    super({ x, y, radius: CONFIG.PROBE.RADIUS, mass: CONFIG.PROBE.MASS, type: 'PROBE' });
    this.angle = -Math.PI / 2;
    this.hull = CONFIG.PROBE.INITIAL_HULL;
    this.maxHull = CONFIG.PROBE.INITIAL_HULL;
    this.energy = CONFIG.PROBE.INITIAL_ENERGY;
    this.maxEnergy = CONFIG.PROBE.INITIAL_ENERGY;
    this.invulnerableTimer = 0;
    this.thrusting = false;
    this.boosting = false;
    this.goldenRecordsCollected = 0;
    this.scienceDataCollected = 0;
  }
  reset(x = 0, y = 0) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
    this.angle = -Math.PI / 2;
    this.hull = this.maxHull;
    this.energy = this.maxEnergy;
    this.invulnerableTimer = 0;
    this.thrusting = false;
    this.boosting = false;
    this.goldenRecordsCollected = 0;
    this.scienceDataCollected = 0;
  }
  applyInput(inputState, dt) {
    if (inputState.rotateLeft) this.angle -= CONFIG.PROBE.ROTATION_SPEED * dt;
    if (inputState.rotateRight) this.angle += CONFIG.PROBE.ROTATION_SPEED * dt;

    this.thrusting = false;
    this.boosting = false;
    const wantsThrust = inputState.thrust;
    const wantsBoost = inputState.boost && wantsThrust && this.energy > 5;

    if (wantsThrust && this.energy > 0) {
      this.thrusting = true;
      this.boosting = wantsBoost;
      let power = CONFIG.PROBE.THRUST_POWER * (wantsBoost ? CONFIG.PROBE.BOOST_MULTIPLIER : 1);
      let drain = wantsBoost ? CONFIG.PROBE.ENERGY_DRAIN_BOOST : CONFIG.PROBE.ENERGY_DRAIN_THRUST;
      this.vx += Math.cos(this.angle) * power * dt;
      this.vy += Math.sin(this.angle) * power * dt;
      this.energy = Math.max(0, this.energy - drain * dt);

      const nx = this.x - Math.cos(this.angle) * this.radius;
      const ny = this.y - Math.sin(this.angle) * this.radius;
      particleSystem.emitThruster(nx, ny, this.angle, wantsBoost, this.vx, this.vy);
    } else {
      if (this.energy < this.maxEnergy) {
        this.energy = Math.min(this.maxEnergy, this.energy + CONFIG.PROBE.PASSIVE_ENERGY_REGEN * dt);
      }
    }

    if (inputState.reverse && this.energy > 5) {
      const retro = CONFIG.PROBE.THRUST_POWER * 0.45;
      this.vx -= Math.cos(this.angle) * retro * dt;
      this.vy -= Math.sin(this.angle) * retro * dt;
      this.energy = Math.max(0, this.energy - CONFIG.PROBE.ENERGY_DRAIN_THRUST * 0.5 * dt);
    }
  }
  update(dt) {
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    this.vx *= CONFIG.PROBE.LINEAR_DAMPING;
    this.vy *= CONFIG.PROBE.LINEAR_DAMPING;
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > CONFIG.PROBE.MAX_SPEED) {
      const scale = CONFIG.PROBE.MAX_SPEED / speed;
      this.vx *= scale; this.vy *= scale;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    eventBus.emit('PLAYER_MOVED', {
      x: this.x, y: this.y, vx: this.vx, vy: this.vy,
      speed, heading: this.angle,
      hull: this.hull, maxHull: this.maxHull,
      energy: this.energy, maxEnergy: this.maxEnergy,
      thrusting: this.thrusting, boosting: this.boosting
    });
  }
  takeDamage(amount, source = 'HAZARD') {
    if (this.invulnerableTimer > 0) return false;
    this.hull = Math.max(0, this.hull - amount);
    this.invulnerableTimer = CONFIG.PROBE.INVULNERABILITY_TIME;
    particleSystem.emitExplosion(this.x, this.y, '#e63946', 15);
    eventBus.emit('SCREEN_SHAKE', { intensity: 10, duration: 0.4 });
    eventBus.emit('PLAYER_DAMAGED', { damage: amount, currentHull: this.hull, maxHull: this.maxHull, source });
    return true;
  }
  heal(amount) { this.hull = Math.min(this.maxHull, this.hull + amount); }
  recharge(amount) { this.energy = Math.min(this.maxEnergy, this.energy + amount); }
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 10) % 2 === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(76, 201, 240, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // High Gain Antenna Dish
    ctx.beginPath();
    ctx.ellipse(4, 0, 8, 14, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#adb5bd';
    ctx.stroke();

    // Antenna feed horn
    ctx.beginPath();
    ctx.moveTo(4, 0); ctx.lineTo(13, 0);
    ctx.strokeStyle = '#ced4da';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(13, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    // Central Electronics Bus
    ctx.fillStyle = '#212529';
    ctx.fillRect(-8, -6, 11, 12);
    ctx.strokeStyle = '#495057';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-8, -6, 11, 12);

    // Golden Record Bay
    ctx.beginPath();
    ctx.arc(-2, 3.5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    // RTG Power Boom
    ctx.beginPath();
    ctx.moveTo(-4, -6); ctx.lineTo(-11, -16);
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#495057';
    ctx.fillRect(-14, -20, 6, 5);

    // Magnetometer Boom
    ctx.beginPath();
    ctx.moveTo(-4, 6); ctx.lineTo(-14, 18);
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-14, 18, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#06d6a0';
    ctx.fill();

    // Engine Nozzle
    ctx.fillStyle = '#343a40';
    ctx.beginPath();
    ctx.moveTo(-8, -3); ctx.lineTo(-13, -4.5); ctx.lineTo(-13, 4.5); ctx.lineTo(-8, 3);
    ctx.closePath();
    ctx.fill();

    if (this.thrusting) {
      ctx.beginPath();
      ctx.arc(-12, 0, this.boosting ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.boosting ? '#ffd166' : '#4cc9f0';
      ctx.fill();
    }

    ctx.restore();
  }
}

// 7. HAZARD
class Hazard extends Entity {
  constructor({ x = 0, y = 0, hazardType = 'ASTEROID_MEDIUM', vx = 0, vy = 0 } = {}) {
    const spec = CONFIG.HAZARDS[hazardType] || CONFIG.HAZARDS.ASTEROID_MEDIUM;
    super({ x, y, radius: spec.radius, mass: spec.mass || 5.0, type: 'HAZARD' });
    this.hazardType = hazardType;
    this.damage = spec.damage;
    this.scoreKill = spec.scoreKill;
    this.color = spec.color;
    this.vx = vx;
    this.vy = vy;
    this.angularVelocity = (Math.random() - 0.5) * 1.5;
    this.points = [];
    const numPoints = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = this.radius * (0.75 + Math.random() * 0.45);
      this.points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
  }
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }
}

// 8. COLLECTIBLE
class Collectible extends Entity {
  constructor({ x = 0, y = 0, itemType = 'SCIENCE_DATA' } = {}) {
    const spec = CONFIG.COLLECTIBLES[itemType] || CONFIG.COLLECTIBLES.SCIENCE_DATA;
    super({ x, y, radius: spec.radius, type: 'COLLECTIBLE' });
    this.itemType = itemType;
    this.scoreValue = spec.score;
    this.energyRestore = spec.energyRestore;
    this.hullRestore = spec.hullRestore;
    this.label = spec.label;
    this.color = spec.color;
    this.pulseTimer = Math.random() * Math.PI * 2;
  }
  update(dt) {
    super.update(dt);
    this.pulseTimer += 3.0 * dt;
  }
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const pulse = 1 + 0.18 * Math.sin(this.pulseTimer);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * (1.6 + 0.3 * Math.sin(this.pulseTimer)), 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = 0.35;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    const r = this.radius * pulse;
    if (this.itemType === 'GOLDEN_RECORD') {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd166';
      ctx.fill();
      ctx.strokeStyle = '#e09f3e';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#212529';
      ctx.fill();
    } else if (this.itemType === 'ENERGY_CELL') {
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.lineTo(r * 0.8, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.8, 0);
      ctx.closePath();
      ctx.fillStyle = '#4cc9f0';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    } else if (this.itemType === 'REPAIR_NANITES') {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#06d6a0';
      ctx.fill();
      ctx.fillStyle = '#060814';
      ctx.fillRect(-2, -r * 0.6, 4, r * 1.2);
      ctx.fillRect(-r * 0.6, -2, r * 1.2, 4);
    } else {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = '#7209b7';
      ctx.fill();
      ctx.strokeStyle = '#f72585';
      ctx.stroke();
    }
    ctx.restore();
  }
}

// 9. CELESTIAL BODY
class CelestialBody extends Entity {
  constructor({ x = 0, y = 0, name = 'Jupiter', planetType = 'JUPITER', radius = 90, gravityWellRadius = 380, mass = 850 } = {}) {
    super({ x, y, radius, mass, type: 'CELESTIAL_BODY' });
    this.name = name;
    this.planetType = planetType;
    this.gravityWellRadius = gravityWellRadius;
    this.slingshotAwarded = false;
  }
  calculateGravity(ox, oy) {
    const dx = this.x - ox;
    const dy = this.y - oy;
    const dist = Math.hypot(dx, dy);
    if (dist > this.gravityWellRadius || dist < this.radius * 0.4) return { fx: 0, fy: 0, dist, inWell: false };
    const nx = dx / dist;
    const ny = dy / dist;
    const force = (this.mass * 9500) / (Math.max(dist, this.radius) ** 2);
    return { fx: nx * force, fy: ny * force, dist, inWell: true };
  }
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.gravityWellRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(78, 168, 222, 0.22)';
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.planetType === 'JUPITER') {
      const g = ctx.createLinearGradient(0, -this.radius, 0, this.radius);
      g.addColorStop(0, '#e7cba8'); g.addColorStop(0.5, '#9b5d38'); g.addColorStop(1, '#d8ab82');
      ctx.fillStyle = g;
    } else if (this.planetType === 'SATURN') {
      ctx.fillStyle = '#e9c46a';
    } else if (this.planetType === 'NEPTUNE') {
      ctx.fillStyle = '#0077b6';
    } else {
      ctx.fillStyle = '#c94a29';
    }
    ctx.fill();

    if (this.planetType === 'SATURN') {
      ctx.save();
      ctx.rotate(-0.35);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.radius * 2.2, this.radius * 0.48, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(233, 196, 106, 0.85)';
      ctx.lineWidth = 14;
      ctx.stroke();
      ctx.restore();
    }

    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(this.name.toUpperCase(), 0, this.radius + 24);
    ctx.font = '500 11px JetBrains Mono, monospace';
    ctx.fillStyle = '#4cc9f0';
    ctx.fillText('GRAVITY ASSIST ZONE', 0, this.radius + 40);
    ctx.restore();
  }
}

// 10. ENTITY MANAGER
class EntityManager {
  constructor() {
    this.probe = null;
    this.hazards = [];
    this.collectibles = [];
    this.celestialBodies = [];
  }
  setProbe(p) { this.probe = p; }
  addHazard(h) { this.hazards.push(h); }
  addCollectible(c) { this.collectibles.push(c); }
  addCelestialBody(b) { this.celestialBodies.push(b); }
  update(dt) {
    if (this.probe && this.probe.isAlive()) this.probe.update(dt);
    this.celestialBodies.forEach(b => b.update(dt));
    const px = this.probe ? this.probe.x : 0;
    const py = this.probe ? this.probe.y : 0;
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.update(dt);
      if (!h.isAlive() || Math.hypot(h.x - px, h.y - py) > 3500) this.hazards.splice(i, 1);
    }
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.update(dt);
      if (!c.isAlive() || Math.hypot(c.x - px, c.y - py) > 3500) this.collectibles.splice(i, 1);
    }
  }
  render(ctx, camera) {
    this.celestialBodies.forEach(b => b.render(ctx));
    this.collectibles.forEach(c => c.render(ctx));
    this.hazards.forEach(h => h.render(ctx));
    if (this.probe && this.probe.isAlive()) this.probe.render(ctx);
  }
  clearWorld() {
    this.hazards = [];
    this.collectibles = [];
    this.celestialBodies = [];
  }
}
const entityManager = new EntityManager();

// 11. PHYSICS SYSTEM
class PhysicsSystem {
  constructor() {
    this.inGravityWell = false;
    this.currentBody = null;
    this.wellEntrySpeed = 0;
  }
  update(dt) {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;
    const bodies = entityManager.celestialBodies;
    let influenced = false;

    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      const g = b.calculateGravity(probe.x, probe.y);
      if (g.inWell) {
        influenced = true;
        probe.vx += g.fx * dt;
        probe.vy += g.fy * dt;

        if (!this.inGravityWell) {
          this.inGravityWell = true;
          this.currentBody = b;
          this.wellEntrySpeed = Math.hypot(probe.vx, probe.vy);
        }

        if (!b.slingshotAwarded && g.dist < b.gravityWellRadius * 0.7) {
          const speed = Math.hypot(probe.vx, probe.vy);
          if (speed > this.wellEntrySpeed * 1.1) {
            b.slingshotAwarded = true;
            probe.vx *= CONFIG.GRAVITY.ASSIST_VELOCITY_BOOST;
            probe.vy *= CONFIG.GRAVITY.ASSIST_VELOCITY_BOOST;
            eventBus.emit('GRAVITY_ASSIST_EXECUTED', { planetName: b.name, bonusScore: CONFIG.GRAVITY.ASSIST_SCORE_AWARD });
          }
        }
      }
    }
    if (!influenced && this.inGravityWell) {
      this.inGravityWell = false;
      this.currentBody = null;
    }
  }
}
const physicsSystem = new PhysicsSystem();

// 12. COLLISION SYSTEM
class CollisionSystem {
  update() {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;

    // Probe vs Hazards
    for (let i = 0; i < entityManager.hazards.length; i++) {
      const h = entityManager.hazards[i];
      if (!h.isAlive()) continue;
      const hitDist = probe.radius + h.radius;
      const dx = probe.x - h.x;
      const dy = probe.y - h.y;
      const dist = Math.hypot(dx, dy);
      if (dist < hitDist) {
        probe.vx += (dx / (dist || 1)) * 140;
        probe.vy += (dy / (dist || 1)) * 140;
        if (probe.takeDamage(h.damage, h.hazardType)) {
          eventBus.emit('HAZARD_HIT', { hazardType: h.hazardType, damage: h.damage });
          if (probe.hull <= 0) {
            probe.destroy();
            particleSystem.emitExplosion(probe.x, probe.y, '#e63946', 45);
            stateManager.transitionTo(GAME_STATES.GAME_OVER, { reason: `Hull destroyed by ${h.hazardType.replace('_', ' ').toLowerCase()}` });
            return;
          }
        }
      }
    }

    // Probe vs Collectibles
    for (let i = 0; i < entityManager.collectibles.length; i++) {
      const c = entityManager.collectibles[i];
      if (!c.isAlive()) continue;
      if (probe.distanceTo(c) < probe.radius + c.radius + 6) {
        c.destroy();
        if (c.itemType === 'GOLDEN_RECORD') {
          probe.goldenRecordsCollected++;
          particleSystem.emitSparkles(c.x, c.y, '#ffd166', 35);
        } else if (c.itemType === 'ENERGY_CELL') {
          probe.recharge(c.energyRestore);
          particleSystem.emitSparkles(c.x, c.y, '#4cc9f0', 20);
        } else if (c.itemType === 'REPAIR_NANITES') {
          probe.heal(c.hullRestore);
          particleSystem.emitSparkles(c.x, c.y, '#06d6a0', 25);
        } else {
          probe.scienceDataCollected++;
          particleSystem.emitSparkles(c.x, c.y, '#f72585', 20);
        }
        eventBus.emit('ITEM_COLLECTED', { itemType: c.itemType, scoreValue: c.scoreValue, label: c.label, x: c.x, y: c.y });
      }
    }

    // Probe vs Planets
    for (let i = 0; i < entityManager.celestialBodies.length; i++) {
      const b = entityManager.celestialBodies[i];
      const dist = probe.distanceTo(b);
      if (dist < b.radius + probe.radius) {
        probe.takeDamage(40, `Atmosphere of ${b.name}`);
        probe.vx += ((probe.x - b.x) / dist) * 320;
        probe.vy += ((probe.y - b.y) / dist) * 320;
        if (probe.hull <= 0) {
          probe.destroy();
          stateManager.transitionTo(GAME_STATES.GAME_OVER, { reason: `Crushed in ${b.name}'s gravity well` });
          return;
        }
      }
    }
  }
}
const collisionSystem = new CollisionSystem();

// 13. SECTOR MANAGER
class SectorManager {
  constructor() {
    this.currentSectorIndex = 0;
    this.distanceTraveledAU = 0;
    this.spawnTimer = 0;
    this.spawnInterval = 0.85;
    this.spawnedPlanets = new Set();
  }
  reset() {
    this.currentSectorIndex = 0;
    this.distanceTraveledAU = 0;
    this.spawnTimer = 0;
    this.spawnedPlanets.clear();
    this.setupCurrentSector();
  }
  getCurrentSector() { return CONFIG.SECTORS[this.currentSectorIndex]; }
  setupCurrentSector() {
    const s = this.getCurrentSector();
    if (!this.spawnedPlanets.has(s.id)) {
      this.spawnedPlanets.add(s.id);
      this.spawnSectorLandmark(s);
    }
    eventBus.emit('SECTOR_ENTERED', { sectorId: s.id, name: s.name, subtitle: s.subtitle, themeColor: s.themeColor });
  }
  spawnSectorLandmark(s) {
    const p = entityManager.probe;
    const px = p ? p.x : 0;
    const py = p ? p.y : 0;
    let body = null;
    if (s.id === 1) body = new CelestialBody({ x: px + 1200, y: py - 400, name: 'Mars', planetType: 'MARS', radius: 65, gravityWellRadius: 320, mass: 450 });
    else if (s.id === 2) body = new CelestialBody({ x: px + 1600, y: py - 200, name: 'Jupiter', planetType: 'JUPITER', radius: 120, gravityWellRadius: 520, mass: 1400 });
    else if (s.id === 3) body = new CelestialBody({ x: px + 1700, y: py + 300, name: 'Saturn', planetType: 'SATURN', radius: 105, gravityWellRadius: 480, mass: 1100 });
    else if (s.id === 4) body = new CelestialBody({ x: px + 1800, y: py - 300, name: 'Neptune', planetType: 'NEPTUNE', radius: 80, gravityWellRadius: 400, mass: 750 });
    if (body) entityManager.addCelestialBody(body);
  }
  update(dt) {
    const probe = entityManager.probe;
    if (!probe || !probe.isAlive()) return;
    const speed = Math.hypot(probe.vx, probe.vy);
    this.distanceTraveledAU += speed * dt * 0.0035;

    const s = this.getCurrentSector();
    if (this.distanceTraveledAU >= s.distanceEndAU) {
      if (this.currentSectorIndex < CONFIG.SECTORS.length - 1) {
        this.currentSectorIndex++;
        this.setupCurrentSector();
      } else {
        stateManager.transitionTo(GAME_STATES.VICTORY, { distanceAU: this.distanceTraveledAU, sector: s.name });
        return;
      }
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntitiesAhead(probe, s);
    }
  }
  spawnEntitiesAhead(probe, sector) {
    const heading = Math.atan2(probe.vy, probe.vx) || probe.angle;
    const dist = 900 + Math.random() * 400;
    const ang = heading + (Math.random() - 0.5) * 1.6;
    const sx = probe.x + Math.cos(ang) * dist;
    const sy = probe.y + Math.sin(ang) * dist;

    if (Math.random() < 0.38) {
      const roll = Math.random();
      let type = 'SCIENCE_DATA';
      if (roll < 0.15) type = 'GOLDEN_RECORD';
      else if (roll < 0.45) type = 'ENERGY_CELL';
      else if (roll < 0.65) type = 'REPAIR_NANITES';
      entityManager.addCollectible(new Collectible({ x: sx, y: sy, itemType: type }));
      return;
    }

    const types = ['ASTEROID_SMALL', 'ASTEROID_MEDIUM', 'ASTEROID_LARGE', 'SPACE_JUNK'];
    if (sector.id >= 3) types.push('COMET');
    const chosen = types[Math.floor(Math.random() * types.length)];
    const driftAngle = Math.random() * Math.PI * 2;
    const driftSpeed = 20 + Math.random() * 60;
    entityManager.addHazard(new Hazard({
      x: sx, y: sy, hazardType: chosen,
      vx: Math.cos(driftAngle) * driftSpeed,
      vy: Math.sin(driftAngle) * driftSpeed
    }));
  }
}
const sectorManager = new SectorManager();

// 14. SCORE MANAGER
class ScoreManager {
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
    this.score = 0; this.distanceAU = 0; this.multiplier = 1.0;
    this.comboTimer = 0; this.goldenRecordsFound = 0; this.gravityAssistsDone = 0;
    this.broadcast();
  }
  bindEvents() {
    eventBus.on('ITEM_COLLECTED', ({ itemType, scoreValue }) => {
      if (itemType === 'GOLDEN_RECORD') this.goldenRecordsFound++;
      this.score += Math.round(scoreValue * this.multiplier);
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
      this.score += sectorId * 1000;
      this.broadcast();
    });
  }
  update(dt, currentDistanceAU) {
    this.distanceAU = currentDistanceAU;
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.multiplier = 1.0;
        this.broadcast();
      }
    }
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
const scoreManager = new ScoreManager();

// 15. AUDIO SYNTHESIZER
class AudioSystem {
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
    const unlock = () => {
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }
  bindEvents() {
    eventBus.on('AUDIO_TOGGLE_MUTE', () => this.toggleMute());
    eventBus.on('ITEM_COLLECTED', ({ itemType }) => {
      if (itemType === 'GOLDEN_RECORD') this.playGoldenRecordChime();
      else this.playPickupChime();
    });
    eventBus.on('HAZARD_HIT', () => this.playImpactSound());
    eventBus.on('GRAVITY_ASSIST_EXECUTED', () => this.playSlingshotWarp());
    eventBus.on('PLAYER_MOVED', ({ thrusting, boosting }) => this.updateThrusterAudio(thrusting, boosting));
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    eventBus.emit('AUDIO_MUTE_CHANGED', { isMuted: this.isMuted });
  }
  updateThrusterAudio(thrusting, boosting) {
    if (!this.ctx || this.isMuted) return;
    if (thrusting) {
      if (!this.thrustOsc) {
        this.thrustOsc = this.ctx.createOscillator();
        this.thrustGain = this.ctx.createGain();
        this.thrustOsc.type = 'sawtooth';
        this.thrustOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
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
      this.thrustOsc.frequency.setTargetAtTime(boosting ? 110 : 65, this.ctx.currentTime, 0.05);
    } else if (this.thrustGain && this.thrustOsc) {
      this.thrustGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      setTimeout(() => {
        if (this.thrustOsc) {
          try { this.thrustOsc.stop(); this.thrustOsc.disconnect(); } catch (e) {}
          this.thrustOsc = null;
          this.thrustGain = null;
        }
      }, 130);
    }
  }
  playPickupChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(now); osc.stop(now + 0.35);
  }
  playGoldenRecordChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);
      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);
      osc.connect(gain); gain.connect(this.masterGain);
      osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.8);
    });
  }
  playImpactSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(now); osc.stop(now + 0.3);
  }
  playSlingshotWarp() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.65);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(gain); gain.connect(this.masterGain);
    osc.start(now); osc.stop(now + 0.7);
  }
}
const audioSystem = new AudioSystem();

// 16. STORAGE & FIREBASE SERVICES
class StorageService {
  getLeaderboard() {
    try {
      const raw = localStorage.getItem(CONFIG.FIREBASE.LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : this.getDefaultLeaderboard();
    } catch (e) { return this.getDefaultLeaderboard(); }
  }
  saveScore(entry) {
    const list = this.getLeaderboard();
    list.push({ ...entry, id: 'local_' + Date.now(), timestamp: Date.now() });
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, CONFIG.FIREBASE.MAX_LEADERBOARD_ENTRIES);
    try { localStorage.setItem(CONFIG.FIREBASE.LOCAL_STORAGE_KEY, JSON.stringify(trimmed)); } catch (e) {}
    return trimmed;
  }
  getDefaultLeaderboard() {
    return [
      { name: 'VOYAGER-1', score: 38450, distanceAU: '162.40', sector: 'Heliopause & Interstellar' },
      { name: 'VOYAGER-2', score: 34120, distanceAU: '135.80', sector: 'Heliopause & Interstellar' },
      { name: 'PIONEER-10', score: 22800, distanceAU: '80.20', sector: 'Outer Ice Giants' },
      { name: 'NEW-HORIZONS', score: 18900, distanceAU: '55.10', sector: 'Saturnian Rings' },
      { name: 'CASSI-HUYGENS', score: 14500, distanceAU: '44.90', sector: 'Jovian Encounter' }
    ];
  }
}
const storageService = new StorageService();

class FirebaseService {
  constructor() {
    this.app = null; this.auth = null; this.db = null;
    this.isOnline = false; this.mode = 'LOCAL_OFFLINE';
  }
  async init(config = null) {
    try {
      if (window.firebase && config && config.apiKey && config.apiKey !== 'YOUR_API_KEY') {
        this.app = window.firebase.initializeApp(config);
        this.auth = window.firebase.auth();
        this.db = window.firebase.firestore();
        const cred = await this.auth.signInAnonymously();
        this.currentUser = cred.user;
        this.isOnline = true;
        this.mode = 'CLOUD';
      }
    } catch (e) { this.isOnline = false; }
    eventBus.emit('FIREBASE_STATUS_CHANGED', { isOnline: this.isOnline, mode: this.mode });
  }
  async fetchLeaderboard() {
    if (this.isOnline && this.db) {
      try {
        const snap = await this.db.collection(CONFIG.FIREBASE.COLLECTION_LEADERBOARD).orderBy('score', 'desc').limit(20).get();
        const list = []; snap.forEach(d => list.push(d.data()));
        if (list.length) return list;
      } catch (e) {}
    }
    return storageService.getLeaderboard();
  }
  async submitScore(entry) {
    if (this.isOnline && this.db) {
      try { await this.db.collection(CONFIG.FIREBASE.COLLECTION_LEADERBOARD).add(entry); } catch (e) {}
    }
    storageService.saveScore(entry);
    eventBus.emit('SCORE_SUBMITTED', entry);
    return entry;
  }
}
const firebaseService = new FirebaseService();

// 17. INPUT CONTROLLER
class InputManager {
  constructor() {
    this.state = { thrust: false, reverse: false, rotateLeft: false, rotateRight: false, boost: false };
    this.activeKeys = new Set();
    this.bindKeyboard();
    this.bindTouch();
  }
  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      this.activeKeys.add(e.code);
      if (CONFIG.KEYS.PAUSE.includes(e.code)) stateManager.togglePause();
      if (CONFIG.KEYS.MUTE.includes(e.code)) eventBus.emit('AUDIO_TOGGLE_MUTE');
      this.updateState();
    });
    window.addEventListener('keyup', (e) => {
      this.activeKeys.delete(e.code);
      this.updateState();
    });
    window.addEventListener('blur', () => {
      this.activeKeys.clear();
      this.updateState();
    });
  }
  bindTouch() {
    const bindBtn = (id, prop) => {
      const el = document.getElementById(id);
      if (!el) return;
      const down = (e) => { e.preventDefault(); this.state[prop] = true; el.classList.add('active'); };
      const up = (e) => { e.preventDefault(); this.state[prop] = false; el.classList.remove('active'); };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    };
    setTimeout(() => {
      bindBtn('btn-touch-thrust', 'thrust');
      bindBtn('btn-touch-boost', 'boost');
      bindBtn('btn-touch-left', 'rotateLeft');
      bindBtn('btn-touch-right', 'rotateRight');
    }, 100);
  }
  updateState() {
    const isDown = (keys) => keys.some(k => this.activeKeys.has(k));
    this.state.thrust = isDown(CONFIG.KEYS.THRUST);
    this.state.reverse = isDown(CONFIG.KEYS.REVERSE);
    this.state.rotateLeft = isDown(CONFIG.KEYS.ROTATE_LEFT);
    this.state.rotateRight = isDown(CONFIG.KEYS.ROTATE_RIGHT);
    this.state.boost = isDown(CONFIG.KEYS.BOOST);
  }
  getState() { return { ...this.state }; }
}
const inputManager = new InputManager();

// 18. HUD & RADAR VIEW
class HUDView {
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
    this.radarAngle = 0;
    this.bindEvents();
  }
  bindEvents() {
    eventBus.on('PLAYER_MOVED', ({ hull, maxHull, energy, maxEnergy }) => {
      const hPct = Math.round(Math.max(0, Math.min(1, hull / maxHull)) * 100);
      if (this.dom.hullFill) {
        this.dom.hullFill.style.width = `${hPct}%`;
        if (hPct <= 25) this.dom.hullFill.classList.add('danger');
        else this.dom.hullFill.classList.remove('danger');
      }
      if (this.dom.hullPct) this.dom.hullPct.textContent = `${hPct}%`;

      const ePct = Math.round(Math.max(0, Math.min(1, energy / maxEnergy)) * 100);
      if (this.dom.energyFill) this.dom.energyFill.style.width = `${ePct}%`;
      if (this.dom.energyPct) this.dom.energyPct.textContent = `${ePct}%`;
    });
    eventBus.on('SCORE_UPDATED', ({ score, distanceAU, multiplier }) => {
      if (this.dom.score) this.dom.score.textContent = score.toLocaleString();
      if (this.dom.distance) this.dom.distance.textContent = `${distanceAU.toFixed(2)} AU`;
      if (this.dom.multiplier) {
        this.dom.multiplier.style.display = multiplier > 1.0 ? 'inline-block' : 'none';
        this.dom.multiplier.textContent = `x${multiplier.toFixed(1)}`;
      }
    });
    eventBus.on('SECTOR_ENTERED', ({ name, subtitle }) => {
      if (this.dom.sectorTitle) this.dom.sectorTitle.textContent = name;
      if (this.dom.sectorSubtitle) this.dom.sectorSubtitle.textContent = subtitle;
      this.showToast(`🛰️ ARRIVED: ${name}`, 3500);
    });
    eventBus.on('ITEM_COLLECTED', ({ label, scoreValue }) => {
      this.showToast(`✨ ${label} (+${scoreValue} PTS)`, 2400);
    });
    eventBus.on('GRAVITY_ASSIST_EXECUTED', ({ planetName, bonusScore }) => {
      this.showToast(`🪐 ${planetName.toUpperCase()} GRAVITY ASSIST! (+${bonusScore} PTS)`, 3000);
    });
    eventBus.on('AUDIO_MUTE_CHANGED', ({ isMuted }) => {
      if (this.dom.btnMute) this.dom.btnMute.innerHTML = isMuted ? '🔇' : '🔊';
    });
  }
  showToast(msg, dur = 2500) {
    if (!this.dom.toasts) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = msg;
    this.dom.toasts.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transition = 'opacity 0.3s ease';
      setTimeout(() => t.remove(), 320);
    }, dur);
  }
  renderRadar(dt) {
    if (!this.radarCtx || !this.dom.radarCanvas) return;
    const ctx = this.radarCtx;
    const size = this.dom.radarCanvas.width;
    const c = size / 2;
    const range = 2400;
    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(76, 201, 240, 0.18)';
    ctx.beginPath();
    ctx.arc(c, c, c * 0.45, 0, Math.PI * 2);
    ctx.arc(c, c, c * 0.9, 0, Math.PI * 2);
    ctx.moveTo(c, 0); ctx.lineTo(c, size);
    ctx.moveTo(0, c); ctx.lineTo(size, c);
    ctx.stroke();

    this.radarAngle += 2.5 * dt;
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(this.radarAngle);
    const grad = ctx.createLinearGradient(0, 0, c * 0.9, 0);
    grad.addColorStop(0, 'rgba(76, 201, 240, 0)');
    grad.addColorStop(1, 'rgba(76, 201, 240, 0.45)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.arc(0, 0, c * 0.9, 0, 0.4); ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(c, c, 2.5, 0, Math.PI * 2); ctx.fill();

    const probe = entityManager.probe;
    if (!probe) return;
    const toRadar = (wx, wy) => {
      const dx = wx - probe.x; const dy = wy - probe.y;
      return { rx: c + (dx / range) * (c * 0.9), ry: c + (dy / range) * (c * 0.9), ok: Math.hypot(dx, dy) <= range };
    };

    entityManager.celestialBodies.forEach(b => {
      const { rx, ry, ok } = toRadar(b.x, b.y);
      if (ok) { ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(rx, ry, 4.5, 0, Math.PI * 2); ctx.fill(); }
    });
    entityManager.collectibles.forEach(col => {
      const { rx, ry, ok } = toRadar(col.x, col.y);
      if (ok) { ctx.fillStyle = col.itemType === 'GOLDEN_RECORD' ? '#ffd166' : '#06d6a0'; ctx.beginPath(); ctx.arc(rx, ry, 2.2, 0, Math.PI * 2); ctx.fill(); }
    });
    entityManager.hazards.forEach(h => {
      const { rx, ry, ok } = toRadar(h.x, h.y);
      if (ok) { ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(rx, ry, 1.8, 0, Math.PI * 2); ctx.fill(); }
    });
  }
}
const hudView = new HUDView();

// 19. LEADERBOARD VIEW
class LeaderboardView {
  constructor() {
    this.dom = {
      modal: document.getElementById('modal-leaderboard'),
      tableBody: document.getElementById('leaderboard-tbody'),
      statusPill: document.getElementById('cloud-status-indicator'),
      btnClose: document.getElementById('btn-close-leaderboard')
    };
    if (this.dom.btnClose) this.dom.btnClose.addEventListener('click', () => this.hide());
    eventBus.on('FIREBASE_STATUS_CHANGED', ({ mode }) => {
      if (this.dom.statusPill) {
        this.dom.statusPill.className = mode === 'CLOUD' ? 'cloud-status-pill' : 'cloud-status-pill offline';
        this.dom.statusPill.textContent = mode === 'CLOUD' ? '● CLOUD FIRESTORE SYNC' : '● LOCAL RECOVERY MODE';
      }
    });
  }
  show() { if (this.dom.modal) this.dom.modal.classList.remove('hidden'); this.renderTable(); }
  hide() { if (this.dom.modal) this.dom.modal.classList.add('hidden'); }
  async renderTable() {
    if (!this.dom.tableBody) return;
    const entries = await firebaseService.fetchLeaderboard();
    this.dom.tableBody.innerHTML = '';
    entries.forEach((item, idx) => {
      const row = document.createElement('tr');
      const badge = idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`;
      row.innerHTML = `
        <td class="${idx === 0 ? 'rank-top' : ''}">${badge}</td>
        <td style="font-weight: 600; color: #ffffff;">${item.name || 'ANON-PROBE'}</td>
        <td style="color: var(--accent-cyan); font-weight: 700;">${(item.score || 0).toLocaleString()}</td>
        <td>${item.distanceAU || '0.00'} AU</td>
        <td style="color: var(--text-muted); font-size: 11px;">${item.sector || 'Deep Space'}</td>
      `;
      this.dom.tableBody.appendChild(row);
    });
  }
}
const leaderboardView = new LeaderboardView();

// 20. UI MANAGER
class UIManager {
  constructor() {
    this.modals = {
      start: document.getElementById('modal-start'),
      howToPlay: document.getElementById('modal-how-to-play'),
      pause: document.getElementById('modal-pause'),
      gameOver: document.getElementById('modal-gameover'),
      victory: document.getElementById('modal-victory')
    };
    this.bindButtons();
    this.bindState();
  }
  bindButtons() {
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-launch-game', () => eventBus.emit('START_NEW_GAME'));
    on('btn-how-to-play', () => this.showModal('howToPlay'));
    on('btn-close-how-to', () => this.showModal('start'));
    on('btn-open-leaderboard', () => leaderboardView.show());
    on('btn-hud-leaderboard', () => leaderboardView.show());
    on('btn-resume-game', () => stateManager.transitionTo(GAME_STATES.PLAYING));
    on('btn-hud-pause', () => stateManager.togglePause());

    on('btn-submit-gameover', async () => {
      const input = document.getElementById('input-callsign-gameover');
      const name = (input && input.value) ? input.value : 'VOYAGER';
      const stats = scoreManager.getFinalStats(sectorManager.getCurrentSector().name);
      await firebaseService.submitScore({ name, ...stats });
      eventBus.emit('START_NEW_GAME');
    });

    on('btn-submit-victory', async () => {
      const input = document.getElementById('input-callsign-victory');
      const name = (input && input.value) ? input.value : 'VOYAGER';
      const stats = scoreManager.getFinalStats('Interstellar Space');
      await firebaseService.submitScore({ name, ...stats });
      eventBus.emit('START_NEW_GAME');
    });
  }
  bindState() {
    eventBus.on('STATE_CHANGED', ({ to, context }) => {
      this.hideAll();
      if (to === GAME_STATES.MENU) this.showModal('start');
      else if (to === GAME_STATES.PAUSED) this.showModal('pause');
      else if (to === GAME_STATES.GAME_OVER) { this.populateGameOver(context); this.showModal('gameOver'); }
      else if (to === GAME_STATES.VICTORY) { this.populateVictory(context); this.showModal('victory'); }
    });
  }
  showModal(name) {
    this.hideAll();
    if (this.modals[name]) this.modals[name].classList.remove('hidden');
  }
  hideAll() { Object.values(this.modals).forEach(m => m && m.classList.add('hidden')); }
  populateGameOver(ctx) {
    const stats = scoreManager.getFinalStats(sectorManager.getCurrentSector().name);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('gameover-stat-score', stats.score.toLocaleString());
    set('gameover-stat-distance', `${stats.distanceAU.toFixed(2)} AU`);
    set('gameover-stat-records', stats.goldenRecords);
    set('gameover-stat-assists', stats.gravityAssists);
    set('gameover-reason', ctx.reason || 'Signal Lost');
  }
  populateVictory() {
    const stats = scoreManager.getFinalStats('Interstellar Medium');
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('victory-stat-score', stats.score.toLocaleString());
    set('victory-stat-distance', `${stats.distanceAU.toFixed(2)} AU`);
  }
}
const uiManager = new UIManager();

// 21. GAME ENGINE
class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.camera = { x: 0, y: 0, zoom: 1.0, targetZoom: 1.0, shakeIntensity: 0, shakeDuration: 0 };
    this.stars = [];
    for (let i = 0; i < CONFIG.DISPLAY.STARS_COUNT; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 8000,
        y: (Math.random() - 0.5) * 8000,
        size: Math.random() * 2.0 + 0.5,
        layer: Math.floor(Math.random() * 3) + 1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 2 + 1,
        color: ['#ffffff', '#a0c4ff', '#ffd166', '#bdb2ff', '#e0fbfc'][Math.floor(Math.random() * 5)]
      });
    }
    this.lastTime = 0;
    this.accumulator = 0;
    this.isRunning = false;
    this.rafId = null;
    this.updateHooks = [];
    this.renderHooks = [];

    window.addEventListener('resize', () => this.resize());
    this.resize();

    eventBus.on('SCREEN_SHAKE', ({ intensity = 8, duration = 0.35 }) => {
      this.camera.shakeIntensity = intensity;
      this.camera.shakeDuration = duration;
    });
    eventBus.on('STATE_CHANGED', ({ to }) => {
      if (to === GAME_STATES.PLAYING && !this.isRunning) this.start();
    });
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }
  tick(t) {
    if (!this.isRunning) return;
    let dt = (t - this.lastTime) / 1000;
    this.lastTime = t;
    if (dt > 0.1) dt = 0.1;

    if (stateManager.is(GAME_STATES.PLAYING) || stateManager.is(GAME_STATES.SECTOR_WARP)) {
      this.accumulator += dt;
      while (this.accumulator >= 1 / 60) {
        if (this.camera.shakeDuration > 0) {
          this.camera.shakeDuration -= 1 / 60;
          if (this.camera.shakeDuration <= 0) this.camera.shakeIntensity = 0;
        }
        this.updateHooks.forEach(fn => fn(1 / 60));
        this.accumulator -= 1 / 60;
      }
    }

    this.render(dt);
    this.rafId = requestAnimationFrame((time) => this.tick(time));
  }
  render(dt) {
    const ctx = this.ctx; const w = this.width; const h = this.height;
    let sx = 0; let sy = 0;
    if (this.camera.shakeIntensity > 0) {
      sx = (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
      sy = (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
    }
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, w, h);

    // Parallax stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.twinkle += star.twinkleSpeed * dt;
      const factor = star.layer * 0.07;
      let starX = ((star.x - this.camera.x * factor) % w + w) % w;
      let starY = ((star.y - this.camera.y * factor) % h + h) % h;
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(star.twinkle));
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    ctx.save();
    ctx.translate(w / 2 + sx, h / 2 + sy);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);
    this.renderHooks.forEach(fn => fn(ctx, this.camera));
    ctx.restore();
  }
}

// 22. MASTER BOOTSTRAPPER
class VoyagerApp {
  async init() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    this.engine = new GameEngine(canvas);
    this.probe = new Probe(0, 0);
    entityManager.setProbe(this.probe);

    await firebaseService.init();

    this.engine.updateHooks.push((dt) => {
      if (this.probe.isAlive()) {
        this.probe.applyInput(inputManager.getState(), dt);
      }
      physicsSystem.update(dt);
      entityManager.update(dt);
      particleSystem.update(dt);
      collisionSystem.update();
      sectorManager.update(dt);
      scoreManager.update(dt, sectorManager.distanceTraveledAU);

      const spd = Math.hypot(this.probe.vx, this.probe.vy);
      this.engine.camera.x += (this.probe.x - this.engine.camera.x) * 0.08;
      this.engine.camera.y += (this.probe.y - this.engine.camera.y) * 0.08;
      const targetZoom = 1.0 - Math.min(spd / 700, 1.0) * 0.28;
      this.engine.camera.zoom += (targetZoom - this.engine.camera.zoom) * 0.05;
    });

    this.engine.renderHooks.push((ctx, cam) => {
      entityManager.render(ctx, cam);
      particleSystem.render(ctx);
      hudView.renderRadar(1 / 60);
    });

    eventBus.on('START_NEW_GAME', () => {
      this.probe.reset(0, 0);
      particleSystem.clear();
      entityManager.clearWorld();
      scoreManager.reset();
      sectorManager.reset();
      stateManager.transitionTo(GAME_STATES.PLAYING);
    });

    stateManager.transitionTo(GAME_STATES.MENU);
    this.engine.start();
  }
}

// Auto-boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VoyagerApp().init());
} else {
  new VoyagerApp().init();
}
