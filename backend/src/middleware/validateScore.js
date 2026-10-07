/**
 * Score Validation & Anti-Cheat Middleware
 * Verifies payload sanity: callsign length, positive scores, realistic distance-to-score ratio.
 */
function validateScore(req, res, next) {
  const { callsign, score, distanceAU, sector } = req.body;

  if (!callsign || typeof callsign !== 'string' || callsign.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Callsign is required and must be a non-empty string (max 14 characters).'
    });
  }

  const cleanCallsign = callsign.trim().substring(0, 14);
  const numScore = Number(score);
  const numDistance = Number(distanceAU);

  if (isNaN(numScore) || numScore < 0) {
    return res.status(400).json({
      success: false,
      error: 'Score must be a positive number.'
    });
  }

  if (isNaN(numDistance) || numDistance < 0) {
    return res.status(400).json({
      success: false,
      error: 'Distance (AU) must be a positive number.'
    });
  }

  // Sanity check: score vs distance realistic bound
  if (numScore > 10000000) {
    return res.status(400).json({
      success: false,
      error: 'Telemetry anomaly detected: Score exceeds maximum allowable simulation threshold.'
    });
  }

  // Attach sanitized data to request
  req.sanitizedEntry = {
    callsign: cleanCallsign,
    score: Math.floor(numScore),
    distanceAU: parseFloat(numDistance.toFixed(2)),
    sector: sector || 'Deep Space',
    timestamp: new Date().toISOString()
  };

  next();
}

module.exports = validateScore;
