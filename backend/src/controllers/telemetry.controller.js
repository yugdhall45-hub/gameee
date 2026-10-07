/**
 * Flight Telemetry Controller
 * Logs mission flight packets, assists, and milestone achievements.
 */
let missionLogs = [];

function recordTelemetry(req, res, next) {
  try {
    const { callsign, auDistance, sectorId, hull, energy, velocity } = req.body;

    const logEntry = {
      id: `TLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      callsign: callsign || 'ANONYMOUS-PROBE',
      auDistance: parseFloat(Number(auDistance || 0).toFixed(2)),
      sectorId: sectorId || 1,
      hull: Math.max(0, Math.min(100, Number(hull || 100))),
      energy: Math.max(0, Math.min(100, Number(energy || 100))),
      velocity: parseFloat(Number(velocity || 0).toFixed(1)),
      timestamp: new Date().toISOString()
    };

    missionLogs.push(logEntry);
    if (missionLogs.length > 500) {
      missionLogs = missionLogs.slice(-500); // keep last 500 packets
    }

    res.status(201).json({
      success: true,
      packetId: logEntry.id,
      timestamp: logEntry.timestamp
    });
  } catch (err) {
    next(err);
  }
}

function getRecentTelemetry(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const recent = missionLogs.slice(-limit).reverse();

  res.json({
    success: true,
    count: recent.length,
    packets: recent
  });
}

module.exports = {
  recordTelemetry,
  getRecentTelemetry
};
