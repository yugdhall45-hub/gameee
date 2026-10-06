# VOYAGER: Interstellar Odyssey 🚀🪐

A browser-based space exploration video game inspired by the legendary NASA Voyager interstellar mission.

---

## 🌟 Key Highlights & Gameplay Features

- **60 FPS Canvas Simulation**: Smooth Newtonian flight dynamics with realistic inertia, gyro attitude steering, and ion thruster mechanics.
- **Planetary Gravity Assists**: Slingshot around massive worlds including Mars, Jupiter, Saturn, and Neptune to gain velocity boosts and scientific discovery points.
- **5 Interstellar Sectors**:
  1. *Sector I: Asteroid Belt* (Inner Solar System Boundary)
  2. *Sector II: Jovian Encounter* (Jupiter Flyby & Radiation Belts)
  3. *Sector III: Saturnian Rings* (Ring Plane Transit & Cassini Division)
  4. *Sector IV: Outer Ice Giants* (Uranus & Neptune Deep Freeze)
  5. *Sector V: Heliopause & Interstellar Space* (Terminal Shock & Interstellar Medium)
- **Scientific Discoveries & Collectibles**:
  - **Golden Records**: NASA's historic record of Earth with pulsar map glyphs.
  - **Planetary Telemetry**: Science packets boosting combo score multipliers.
  - **RTG Power Cells**: Replenish depleted spacecraft battery.
  - **Repair Nanites**: Restore hull integrity after asteroid impacts.
- **NASA JPL Heads-Up Display (HUD)**:
  - Real-time Astronomical Unit (AU) distance tracker.
  - Telemetry score readout with combo multipliers.
  - 360-degree radar scanner tracking nearby planets, asteroids, and collectibles.
  - Hull integrity & RTG energy battery gauges.
- **Dual Controls**:
  - **Desktop Keyboard**: `W`/`▲` for Thruster, `A`/`D`/`◀`/`▶` for Steering, `Space` for Overdrive Boost, `P` for Pause, `M` for Mute.
  - **Mobile & Tablet**: Ergonomic floating virtual touch pads.
- **Zero-Dependency Procedural Audio**:
  - Built-in Web Audio API synthesizer generates thruster rumbles, discovery chimes, slingshot whooshes, and impact alarms without external audio files.
- **Firebase & Offline Persistence**:
  - Firebase Authentication (Anonymous sign-in for zero-friction access).
  - Cloud Firestore global expedition leaderboard.
  - Graceful automatic local cache fallback for instant offline play.

---

## 🏗️ Architecture & Multi-Agent Modularity

The project uses an **Event-Driven Architecture (Pub/Sub EventBus)** ensuring complete decoupling across 5 independent subsystem tracks:

```
voyager/
├── index.html                   # High-DPI canvas mount, HUD overlays, modals
├── firebase.json                # Firebase Hosting configuration
├── css/
│   ├── main.css                 # Cosmic dark design tokens & glassmorphism
│   ├── hud.css                  # Telemetry bar, gauges, radar scanner
│   ├── modals.css               # Briefing, game over, victory & leaderboard modals
│   └── touch-controls.css       # Responsive virtual on-screen controls
└── js/
    ├── config.js                # Game constants, physics parameters, sector definitions
    ├── app.js                   # Master bootstrap & dependency injection root
    ├── core/
    │   ├── EventBus.js          # Decoupled pub/sub message hub
    │   ├── GameEngine.js        # Fixed-timestep loop & parallax starfield renderer
    │   ├── StateManager.js      # Finite State Machine (MENU, PLAYING, PAUSED, GAMEOVER)
    │   └── InputManager.js      # Unified keyboard & touch controller
    ├── entities/
    │   ├── Entity.js            # Base game object
    │   ├── EntityManager.js     # Spatial culling & lifecycle pool
    │   ├── Probe.js             # Voyager spacecraft model & flight physics
    │   ├── CelestialBody.js     # Planets with real gravity well calculations
    │   ├── Hazard.js            # Procedural asteroids & space debris
    │   ├── Collectible.js       # Golden records, telemetry & power cells
    │   └── ParticleSystem.js    # Thruster plumes, explosions & sparkles
    ├── systems/
    │   ├── PhysicsSystem.js     # Gravitational attraction & slingshot calculations
    │   ├── CollisionSystem.js   # Intersect checks, damage & pickup triggers
    │   ├── SectorManager.js     # Procedural sector generation & milestones
    │   ├── ScoreManager.js      # Scoring algorithms & combo multipliers
    │   └── AudioSystem.js       # Procedural Web Audio API sound generator
    ├── ui/
    │   ├── UIManager.js         # Modal coordinator & screen transitions
    │   ├── HUDView.js           # Real-time telemetry & radar renderer
    │   └── LeaderboardView.js   # Rankings table & score submission
    └── services/
        ├── FirebaseService.js   # Cloud Firestore & Anonymous Auth API
        └── StorageService.js    # LocalStorage offline persistence adapter
```

---

## 🕹️ Controls

| Action | Desktop Keyboard | Mobile / Tablet Touch |
| :--- | :--- | :--- |
| **Main Thruster** | `W` or `ArrowUp` | Right Pad `▲` button |
| **Reverse Thruster** | `S` or `ArrowDown` | — |
| **Steer Left** | `A` or `ArrowLeft` | Left Pad `◀` button |
| **Steer Right** | `D` or `ArrowRight` | Left Pad `▶` button |
| **Overdrive Boost** | `Spacebar` | Right Pad `⚡` button |
| **Pause / Resume** | `P` or `Escape` | Top HUD `⏸️` icon |
| **Mute / Unmute** | `M` | Top HUD `🔊` icon |

---

## ☁️ Firebase Configuration

To connect the game to your Firebase project:
1. Open [`js/app.js`](file:///c:/Users/dhall/New%20folder/js/app.js)
2. Replace `customFirebaseConfig` with your credentials:
```javascript
const customFirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```
3. Enable **Anonymous Authentication** in the Firebase Console under `Authentication > Sign-in method`.
4. Enable **Cloud Firestore** under `Firestore Database`.

*Note: If credentials are not configured, Voyager automatically operates in **Local Recovery Mode** via `localStorage` with full leaderboard functionality.*

---

## 🚀 Running Locally

Open [`index.html`](file:///c:/Users/dhall/New%20folder/index.html) using any modern web server (e.g. VS Code Live Server, Python HTTP server, or `npx serve .`):
```bash
npx -y serve .
```
Navigate to `http://localhost:3000` (or the reported local port).
