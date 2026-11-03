import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both local development and Vercel Serverless (/tmp)
const isServerless = Boolean(process.env.VERCEL);
const DATA_DIR = isServerless ? '/tmp' : path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const INITIAL_DATA_FILE = path.resolve(__dirname, '../../data/initialData.json');

// In-memory fallback cache
let memoryDb = null;

function loadInitialData() {
  try {
    if (fs.existsSync(INITIAL_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(INITIAL_DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Could not read INITIAL_DATA_FILE:', err.message);
  }
  return {
    currentUser: {
      name: 'Alex Morgan',
      department: 'Computer Science',
      gpa: '3.84'
    },
    announcements: [],
    resources: [],
    events: [],
    tasks: [],
    forumPosts: [],
    clubs: []
  };
}

function ensureDb() {
  if (memoryDb) return;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = loadInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      memoryDb = initial;
    } else {
      memoryDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Filesystem access failed, using memory state:', err.message);
    if (!memoryDb) {
      memoryDb = loadInitialData();
    }
  }
}

export function getDb() {
  ensureDb();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
    }
  } catch (err) {
    // If reading fails, keep using memoryDb
  }
  return memoryDb || loadInitialData();
}

export function saveDb(data) {
  memoryDb = data;
  try {
    ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Persistence to disk skipped (serverless memory updated):', err.message);
  }
  return data;
}
