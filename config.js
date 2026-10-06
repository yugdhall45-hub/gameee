/**
 * Voyager Game Configuration & Constant Registry
 * All game balance parameters, celestial definitions, and settings are configured here.
 */

export const CONFIG = {
  VERSION: '1.0.0',
  GAME_TITLE: 'VOYAGER: Interstellar Odyssey',

  // Canvas & Display
  DISPLAY: {
    TARGET_FPS: 60,
    PHYSICS_TIMESTEP: 1 / 60,
    MAX_DELTA: 0.1, // Prevent physics spiral of death
    STARS_COUNT: 220,
    COSMIC_DUST_COUNT: 45,
    PARALLAX_LAYERS: 3
  },

  // Spacecraft Flight Dynamics (Newtonian Physics)
  PROBE: {
    RADIUS: 18,
    MASS: 1.0,
    THRUST_POWER: 420,       // Acceleration pixels/sec^2
    BOOST_MULTIPLIER: 1.8,   // Overdrive thruster multiplier
    ROTATION_SPEED: 4.2,     // Radians/sec
    LINEAR_DAMPING: 0.992,   // Subtle deep space friction
    ANGULAR_DAMPING: 0.94,   // Gyro stabilizer damping
    MAX_SPEED: 700,
    INITIAL_HULL: 100,
    INITIAL_ENERGY: 100,
    ENERGY_DRAIN_THRUST: 12, // Units per second while thrusting
    ENERGY_DRAIN_BOOST: 28,  // Units per second during overdrive
    PASSIVE_ENERGY_REGEN: 3.5, // Solar panel/RTG passive recharge
    INVULNERABILITY_TIME: 1.8 // Seconds after collision
  },

  // Celestial Bodies & Gravity Wells
  GRAVITY: {
    G_CONSTANT: 125000,       // Gravitational force constant
    ASSIST_BONUS_MIN_DIST: 90,
    ASSIST_VELOCITY_BOOST: 1.35,
    ASSIST_SCORE_AWARD: 1500
  },

  // Sectors & Interstellar Journey
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

  // Hazards & Obstacles
  HAZARDS: {
    ASTEROID_SMALL: { radius: 14, damage: 15, scoreKill: 100, mass: 2.0, color: '#8d99ae' },
    ASTEROID_MEDIUM: { radius: 26, damage: 30, scoreKill: 200, mass: 6.0, color: '#6c757d' },
    ASTEROID_LARGE: { radius: 44, damage: 55, scoreKill: 400, mass: 18.0, color: '#495057' },
    SPACE_JUNK: { radius: 18, damage: 20, scoreKill: 150, mass: 3.0, color: '#00f5d4' },
    COMET: { radius: 22, damage: 40, speed: 280, scoreKill: 350, mass: 4.5, color: '#70d6ff' }
  },

  // Collectibles & Discoveries
  COLLECTIBLES: {
    GOLDEN_RECORD: {
      radius: 16,
      score: 5000,
      energyRestore: 30,
      hullRestore: 20,
      label: 'Golden Record Fragment',
      color: '#ffd166',
      pulseSpeed: 3.5
    },
    SCIENCE_DATA: {
      radius: 12,
      score: 1200,
      energyRestore: 10,
      hullRestore: 0,
      label: 'Planetary Telemetry',
      color: '#06d6a0',
      pulseSpeed: 2.5
    },
    ENERGY_CELL: {
      radius: 14,
      score: 500,
      energyRestore: 55,
      hullRestore: 0,
      label: 'Radioisotope Cell',
      color: '#4cc9f0',
      pulseSpeed: 2.0
    },
    REPAIR_NANITES: {
      radius: 14,
      score: 800,
      energyRestore: 15,
      hullRestore: 35,
      label: 'Emergency Repair Nanites',
      color: '#118ab2',
      pulseSpeed: 2.2
    }
  },

  // Scoring & Progression
  SCORING: {
    DISTANCE_SCORE_PER_AU: 200,
    COMBO_TIMEOUT_SECS: 4.0,
    MAX_COMBO_MULTIPLIER: 5.0,
    GRAVITY_SLINGSHOT_SCORE: 2500
  },

  // Input Keys Mapping
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

  // Firebase Cloud Services
  FIREBASE: {
    COLLECTION_LEADERBOARD: 'voyager_leaderboard',
    COLLECTION_EXPEDITIONS: 'voyager_expeditions',
    MAX_LEADERBOARD_ENTRIES: 20,
    LOCAL_STORAGE_KEY: 'voyager_offline_leaderboard_v1',
    LOCAL_STATS_KEY: 'voyager_local_stats_v1'
  }
};
