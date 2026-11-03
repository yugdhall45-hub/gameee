# CampusConnect 🎓🏛️
> **Your College, Your Community.**

A modern, student-centric full-stack web platform designed to streamline collegiate life. CampusConnect helps university students manage academic schedules, access verified course notes and solved past year exam papers (PYQs), track assignment deadlines, monitor attendance thresholds, discover campus fests & hackathons, and stay updated with official administrative announcements.

---

## 🌟 Key Highlights & Modules

### 1. 📚 Smart Academic Study Vault (Notes & PYQs)
- **Course & Topic Search**: Instant search by Course Code (e.g., `CS301`, `MA201`, `EC402`) or key concepts.
- **Department & Semester Filters**: Filter study materials across Computer Science, AI, Electronics, Mechanical, and Basic Sciences from Semesters 1 to 8.
- **Material Types**: Lecture Notes, Solved Past Exam Papers (PYQs), Lab Manuals, and Formula Sheets.
- **Peer Ratings & Upvotes**: Live upvoting system powered by backend REST endpoints.
- **Document Previews & Downloads**: In-browser document viewer with realistic academic layouts and simulated PDF download generation.
- **Upload Modal**: Dedicated form for students and class representatives to contribute new study material.

### 2. 📅 Campus Events & Hackathons Hub
- **Event Categories**: Tech & Hackathons, Cultural & Fests, Technical Workshops, and Inter-Department Sports.
- **Real-Time RSVP**: One-click registration toggle that dynamically updates attendee counts on the Node.js backend.
- **Calendar Integration**: Export `.ics` calendar files directly to Google Calendar, Apple Calendar, or Outlook.
- **Club Organizer Spotlights**: Event cards detail host societies (GDSC, ACM, Robotics Society, etc.), venue, and seat availability meters.

### 3. ⏱️ Academic Hub & Attendance Suite
- **Today's Lecture Schedule**: Real-time visual timetable displaying period timings, lecture rooms, faculty names, and a pulsing "Happening Now" status indicator.
- **Assignment & Submission Tracker**: Interactive to-do list with course tags, due dates, priority labels (High, Medium, Low), and complete/delete toggles.
- **75% Attendance Calculator**:
  - Interactive sliders for classes attended and total classes held.
  - Custom target percentage selector (75%, 80%, 85%).
  - Real-time bunker algorithm: Calculates how many classes a student can safely skip, or how many consecutive classes they must attend to meet exam eligibility.

### 4. 📢 Campus Announcements & Circulars Board
- **Official Administrative Feeds**: Notices from the Controller of Examinations, Training & Placement Cell (TPC), Dean of Student Affairs, and Department Heads.
- **Pinned Urgent Alerts**: Top-level announcement banner for examination datesheets, hall tickets, and campus drives.
- **Full Circular Reader**: Interactive modal displaying complete official circulars with administrative guidance.

### 5. 👥 Peer Doubts & Student Societies
- **Doubt Resolution Forum**: Subject-wise discussions where students can ask academic doubts and receive answers from seniors and peers.
- **Replies & Upvotes**: Threaded responses with instant backend persistence.
- **Campus Clubs Directory**: Directory of student chapters (GDSC, ACM, Robotics, Literary & Debating) with one-click "Join Club" membership toggles.

---

## 🎨 Design System & Color Palette

Crafted to reflect a clean, authentic university portal aesthetic:
- **Navy Blue (Primary Brand)**: `#0a1626` / `#0f243e` / `#1b375b`
- **Light Blue (Action & Accents)**: `#38bdf8` / `#0284c7` / `#e0f2fe`
- **Clean White (Surfaces)**: `#ffffff` / `#f8fafc`
- **Typography**: Inter & Poppins typography loaded via Google Fonts.
- **Icons**: Lucide React vector icons.
- **Responsive**: 100% mobile, tablet, and desktop friendly with a responsive mobile drawer navigation.

---

## 🏗️ Project Architecture

```
CampusConnect/
├── backend/                      # 🛡️ Node.js & Express REST API
│   ├── src/
│   │   ├── server.js             # HTTP server & static frontend host
│   │   ├── routes/
│   │   │   └── api.js            # REST endpoints (auth, vault, events, tasks, forum)
│   │   └── services/
│   │       └── db.js             # JSON persistence engine
│   ├── data/
│   │   ├── initialData.json      # Pre-seeded rich college data
│   │   └── db.json               # Live persistent database
│   └── package.json
│
├── frontend/                     # ⚛️ React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, alerts, profile pill, mobile drawer
│   │   │   ├── HeroBanner.jsx    # Tagline, stats counter, quick actions
│   │   │   ├── StudyVault.jsx    # Notes, PYQs, filters, upvotes, downloads
│   │   │   ├── CampusEvents.jsx  # Hackathons, fests, RSVP, .ics calendar export
│   │   │   ├── AcademicHub.jsx   # Class timetable, assignments, attendance calc
│   │   │   ├── NoticeBoard.jsx   # Circulars, pinned alerts, circular modals
│   │   │   ├── CommunityAndClubs.jsx # Peer doubts forum & club directory
│   │   │   ├── Modals.jsx        # Upload note, create event, notice, doubt, profile
│   │   │   └── Footer.jsx        # Campus helplines, emergency contacts
│   │   ├── services/
│   │   │   └── api.js            # Backend API client
│   │   ├── App.jsx               # Root application state & tab manager
│   │   ├── main.jsx              # React DOM bootstrap
│   │   └── index.css             # Tailwind design tokens
│   ├── vite.config.js            # Vite configuration with API proxy
│   ├── tailwind.config.js        # Navy & Light Blue theme palette
│   └── package.json
│
└── package.json                  # Root orchestration (concurrent dev runner)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### Running the Full-Stack Application

From the root directory:

```bash
# 1. Run both Backend & Frontend concurrently in development mode:
npm run dev
```

- **Frontend (Vite HMR)**: `http://localhost:5173`
- **Backend (Express API)**: `http://localhost:5000`

### Individual Component Commands

```bash
# Start Backend only:
npm run dev:backend

# Start Frontend only:
npm run dev:frontend

# Build Frontend for Production:
npm run build

# Start Production Server (Serves built React App + API from port 5000):
npm run start:prod
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & uptime |
| `GET` | `/api/profile` | Current student profile & GPA |
| `POST` | `/api/auth/login` | Update student profile details |
| `GET` | `/api/announcements` | Fetch all campus notices & circulars |
| `POST` | `/api/announcements` | Publish a new administrative circular |
| `GET` | `/api/resources` | Fetch study notes & PYQs (supports `?search`, `?department`, `?semester`, `?type`) |
| `POST` | `/api/resources` | Upload new study material / past paper |
| `POST` | `/api/resources/:id/upvote`| Upvote a helpful resource |
| `GET` | `/api/events` | Fetch campus events & hackathons |
| `POST` | `/api/events` | Register a new campus event |
| `POST` | `/api/events/:id/rsvp` | Toggle student RSVP attendance |
| `GET` | `/api/tasks` | Fetch student assignment to-dos |
| `POST` | `/api/tasks` | Add a new assignment deadline |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task completion |
| `DELETE`| `/api/tasks/:id` | Remove an assignment |
| `GET` | `/api/forum` | Fetch peer discussion & doubts threads |
| `POST` | `/api/forum` | Post a doubt or query |
| `POST` | `/api/forum/:id/upvote` | Upvote a discussion thread |
| `POST` | `/api/forum/:id/reply` | Submit a reply to a doubt thread |
| `GET` | `/api/clubs` | Fetch student societies & clubs |
| `POST` | `/api/clubs/:id/toggle` | Join or leave a student club |

---

## 📜 License
MIT License. Built for university student communities.
