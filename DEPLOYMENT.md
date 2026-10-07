# 🚀 VOYAGER: Production Deployment Guide

A step-by-step breakdown for deploying the **Voyager: Interstellar Odyssey** frontend game client, backend API server, and configuring Cloud Firestore persistence.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Option A: Frontend on Vercel (Recommended)](#-option-a-deploy-frontend-on-vercel)
3. [Option B: Frontend on GitHub Pages](#-option-b-deploy-frontend-on-github-pages)
4. [Option C: Frontend on Firebase Hosting](#-option-c-deploy-frontend-on-firebase-hosting)
5. [Backend Deployment on Render / Railway](#-deploy-backend-api-on-render)
6. [Connecting Frontend to Live Backend](#-connecting-frontend-to-live-backend)
7. [Cloud Leaderboard (Firebase Setup)](#-cloud-leaderboard-configuration)
8. [Production Verification Checklist](#-production-verification-checklist)

---

## 🏛️ Architecture Overview

| Component | Stack | Recommended Host | Zero-Cost Tier Available? |
| :--- | :--- | :--- | :--- |
| **Frontend** | HTML5 Canvas, Vanilla CSS, ES Modules | **Vercel** / **GitHub Pages** | ✅ 100% Free |
| **Backend API** | Node.js, Express, REST | **Render** / **Railway** | ✅ Free Web Service |
| **Database** | Cloud Firestore / Local Cache | **Firebase** | ✅ Free Spark Tier |

---

## 🌐 Option A: Deploy Frontend on Vercel

The workspace already includes an optimized [`vercel.json`](./vercel.json) configured with static asset caching, clean URLs, and CORS headers.

### Step 1: Log in to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (`yugdhall45-hub`).

### Step 2: Import Repository
1. Click **"Add New..."** → **"Project"**.
2. Select your repository: `yugdhall45-hub/gameee`.

### Step 3: Configure Project Settings
- **Framework Preset**: Select `Other`.
- **Root Directory**: Leave as `./` (root).
- **Build Command**: Leave blank (no build step needed for static canvas engine).
- **Output Directory**: Leave blank.

### Step 4: Deploy
1. Click **"Deploy"**.
2. In ~15 seconds, your game will be live at a custom URL like:
   `https://gameee-yugdhall45-hub.vercel.app`

---

## 🐙 Option B: Deploy Frontend on GitHub Pages

Since your repository is already hosted on GitHub, you can activate GitHub Pages instantly without signing up for external services.

### Step 1: Open Repository Settings
1. Navigate to: `https://github.com/yugdhall45-hub/gameee/settings/pages`

### Step 2: Configure Build and Deployment
1. Under **"Build and deployment"** → **"Source"**, select **"Deploy from a branch"**.
2. Under **"Branch"**:
   - Select branch: `main`
   - Select folder: `/(root)`
3. Click **"Save"**.

### Step 3: View Live Game
Within 1–2 minutes, GitHub Pages will deploy your site to:
`https://yugdhall45-hub.github.io/gameee/`

---

## 🔥 Option C: Deploy Frontend on Firebase Hosting

The workspace includes a pre-configured [`firebase.json`](./firebase.json).

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Authenticate
```bash
firebase login
```

### Step 3: Link Project
```bash
firebase use --add
```
Select your Firebase project ID from the interactive list.

### Step 4: Deploy
```bash
firebase deploy --only hosting
```
Firebase will return your hosting URL: `https://<YOUR-PROJECT-ID>.web.app`.

---

## 🛡️ Deploy Backend API on Render

The backend is organized in the [`backend/`](./backend/) directory with an Express server, health check endpoints, anti-cheat validation, and telemetry logging.

### Step 1: Sign Up on Render
1. Visit [render.com](https://render.com) and log in with your GitHub account.

### Step 2: Create a New Web Service
1. Click **"New +"** → **"Web Service"**.
2. Select your repository: `yugdhall45-hub/gameee`.

### Step 3: Configure Service Parameters
- **Name**: `voyager-api`
- **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Ohio).
- **Root Directory**: `backend` *(Critical: Tell Render to run from the backend folder)*.
- **Runtime**: `Node`.
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`.

### Step 4: Add Environment Variables
Under the **"Environment Variables"** tab:
- `PORT` = `10000`
- `NODE_ENV` = `production`
- `CLIENT_ORIGIN` = `https://gameee-yugdhall45-hub.vercel.app,https://yugdhall45-hub.github.io` *(your frontend domain)*.

### Step 5: Deploy
Click **"Create Web Service"**. Once deployed, Render will provide your public API URL:
`https://voyager-api.onrender.com`

Verify the health check in your browser:
`https://voyager-api.onrender.com/api/health`

---

## 🔗 Connecting Frontend to Live Backend

Once your backend is live:

1. Open [`js/services/ApiService.js`](./js/services/ApiService.js).
2. Update the default constructor URL:
   ```javascript
   // Change:
   constructor(baseUrl = 'http://localhost:4000/api') {
   
   // To your live backend URL:
   constructor(baseUrl = 'https://voyager-api.onrender.com/api') {
   ```
3. Commit and push the update:
   ```bash
   git add js/services/ApiService.js
   git commit -m "feat(api): connect frontend to live backend URL"
   git push origin main
   ```

---

## ☁️ Cloud Leaderboard Configuration

Voyager supports instant offline play via LocalStorage fallback, but you can enable global multiplayer leaderboards with Cloud Firestore:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it (e.g. `voyager-odyssey`).

### Step 2: Enable Anonymous Authentication
1. Go to **Build** → **Authentication** → **Sign-in method**.
2. Enable **Anonymous** provider.

### Step 3: Create Firestore Database
1. Go to **Build** → **Firestore Database** → **Create Database**.
2. Choose **Production mode**.
3. Set Security Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /leaderboard/{docId} {
         allow read: if true;
         allow create: if request.auth != null
                       && request.resource.data.score is int
                       && request.resource.data.score < 10000000;
       }
     }
   }
   ```

### Step 4: Add Web App Credentials
1. In Project Settings, click **"Add App" (Web `</>`)**.
2. Copy the `firebaseConfig` object and insert it into [`js/config.js`](./js/config.js).

---

## ✅ Production Verification Checklist

Before sharing your game:
- [ ] **Canvas Scaling**: Open the game on both mobile and desktop screens to verify 60 FPS viewport scaling.
- [ ] **Audio Initialization**: Click "Launch Expedition" to ensure Web Audio synthesizer context unlocks after user gesture.
- [ ] **Controls Check**:
  - Desktop: Verify `W`/`A`/`S`/`D` steering and `Space` overdrive.
  - Mobile: Verify left steering D-Pad and right thruster buttons.
- [ ] **Leaderboard Submission**: Complete a test run, collide or reach interstellar space, and submit a callsign.
- [ ] **Security**: Ensure CORS origins on the backend match your production frontend domain.
