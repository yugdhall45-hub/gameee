/**
 * Leaderboard Controller
 * Handles high score retrieval and submission with Firestore support + In-Memory fallback.
 */
const { adminDb, isInitialized } = require('../config/firebaseAdmin');

// Default initial high scores (NASA Voyager Historical Pioneers)
let memoryLeaderboard = [
  { rank: 1, callsign: 'VOYAGER-1', score: 98450, distanceAU: 162.8, sector: 'Interstellar Space', date: '1977-09-05' },
  { rank: 2, callsign: 'VOYAGER-2', score: 87120, distanceAU: 135.4, sector: 'Heliopause Boundary', date: '1977-08-20' },
  { rank: 3, callsign: 'NEW-HORIZONS', score: 64300, distanceAU: 58.2, sector: 'Outer Ice Giants', date: '2006-01-19' },
  { rank: 4, callsign: 'PIONEER-10', score: 52100, distanceAU: 80.5, sector: 'Saturnian Rings', date: '1972-03-03' },
  { rank: 5, callsign: 'PIONEER-11', score: 48900, distanceAU: 44.1, sector: 'Jovian Encounter', date: '1973-04-06' }
];

async function getLeaderboard(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    if (isInitialized() && adminDb) {
      const snapshot = await adminDb.collection('leaderboard')
        .orderBy('score', 'desc')
        .limit(limit)
        .get();

      const records = [];
      snapshot.forEach((doc, idx) => {
        records.push({
          id: doc.id,
          rank: idx + 1,
          ...doc.data()
        });
      });

      return res.json({
        success: true,
        source: 'firestore',
        count: records.length,
        leaderboard: records
      });
    }

    // In-Memory sorted return
    const sorted = [...memoryLeaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    res.json({
      success: true,
      source: 'memory_cache',
      count: sorted.length,
      leaderboard: sorted
    });
  } catch (err) {
    next(err);
  }
}

async function submitScore(req, res, next) {
  try {
    const entry = req.sanitizedEntry;

    if (isInitialized() && adminDb) {
      const docRef = await adminDb.collection('leaderboard').add(entry);
      return res.status(201).json({
        success: true,
        message: 'Flight log recorded in Deep Space Archives.',
        id: docRef.id,
        entry
      });
    }

    // Add to in-memory store
    memoryLeaderboard.push(entry);
    memoryLeaderboard.sort((a, b) => b.score - a.score);

    // Keep top 100
    if (memoryLeaderboard.length > 100) {
      memoryLeaderboard = memoryLeaderboard.slice(0, 100);
    }

    const rank = memoryLeaderboard.findIndex(e => e === entry) + 1;

    res.status(201).json({
      success: true,
      message: 'Flight log recorded in Deep Space Archives.',
      rank,
      entry
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeaderboard,
  submitScore
};
