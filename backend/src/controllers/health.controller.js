/**
 * System Health & Diagnostics Controller
 */
const { isInitialized } = require('../config/firebaseAdmin');

const startTime = Date.now();

function getHealth(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    status: 'ONLINE',
    system: 'VOYAGER Deep Space Mission API',
    version: '1.0.0',
    uptime: `${uptimeSeconds}s`,
    database: isInitialized() ? 'Cloud Firestore (Connected)' : 'In-Memory Engine (Ready)',
    timestamp: new Date().toISOString()
  });
}

module.exports = { getHealth };
