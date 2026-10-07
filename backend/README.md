# Voyager Game Backend API 🚀🛰️

A Node.js and Express REST API supporting global leaderboards, anti-cheat score validation, and flight telemetry logging for **Voyager: Interstellar Odyssey**.

---

## 📁 Directory Architecture

```
backend/
├── server.js                 # HTTP server entry point & graceful shutdown
├── package.json              # Backend dependencies and run scripts
├── .env.example              # Sample environment configuration
├── README.md                 # Backend documentation
└── src/
    ├── app.js                # Express app setup, CORS, JSON parsing, logging
    ├── config/
    │   ├── env.js            # Environment variable loader
    │   └── firebaseAdmin.js  # Optional server-side Cloud Firestore adapter
    ├── controllers/
    │   ├── health.controller.js      # System status & diagnostics
    │   ├── leaderboard.controller.js # High scores retrieval & submissions
    │   └── telemetry.controller.js   # Flight telemetry logging
    ├── middleware/
    │   ├── errorHandler.js   # Standardized JSON error response handler
    │   └── validateScore.js  # Anti-cheat validator (sanitizes scores & distances)
    └── routes/
        ├── health.routes.js          # GET /api/health
        ├── leaderboard.routes.js     # GET & POST /api/leaderboard
        └── telemetry.routes.js       # GET & POST /api/telemetry
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` if you wish to customize port or origins:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:4000` with auto-reload enabled.

---

## 📡 API Endpoints

### 1. Health Diagnostics
- **Method**: `GET`
- **Path**: `/api/health`
- **Response**:
```json
{
  "status": "ONLINE",
  "system": "VOYAGER Deep Space Mission API",
  "version": "1.0.0",
  "uptime": "12s",
  "database": "In-Memory Engine (Ready)",
  "timestamp": "2026-10-07T09:30:00.000Z"
}
```

### 2. Leaderboard
- **Get Top Scores**:
  - **Method**: `GET`
  - **Path**: `/api/leaderboard?limit=10`
  - **Response**: Array of top mission rankings sorted by score descending.

- **Submit Flight Log**:
  - **Method**: `POST`
  - **Path**: `/api/leaderboard`
  - **Body**:
    ```json
    {
      "callsign": "VOYAGER-1",
      "score": 98450,
      "distanceAU": 162.8,
      "sector": "Interstellar Space"
    }
    ```
  - **Anti-Cheat Validation**: Enforces string length, non-negative numbers, realistic telemetry thresholds.

### 3. Flight Telemetry
- **Record Telemetry Packet**:
  - **Method**: `POST`
  - **Path**: `/api/telemetry`
  - **Body**:
    ```json
    {
      "callsign": "VOYAGER-1",
      "auDistance": 42.5,
      "sectorId": 2,
      "hull": 95,
      "energy": 80,
      "velocity": 510
    }
    ```
- **Fetch Recent Packets**:
  - **Method**: `GET`
  - **Path**: `/api/telemetry?limit=20`

---

## 🛡️ Anti-Cheat & Security
- **Origin Validation**: Strict CORS restricts browser origins to approved game hosts.
- **Payload Sanitization**: Rejects negative scores, NaN values, excessive callsign lengths, and impossible multipliers.
- **Centralized Error Handling**: Ensures stack traces are never leaked to clients in production.
