/**
 * VOYAGER Backend Server Entry Point
 */
const app = require('./src/app');
const config = require('./src/config/env');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 VOYAGER Deep Space API Server is Online`);
  console.log(`🛰️  Listening on: http://localhost:${PORT}`);
  console.log(`📡 Environment:  ${config.env}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏆 Leaderboard:  http://localhost:${PORT}/api/leaderboard`);
  console.log(`📊 Telemetry:    http://localhost:${PORT}/api/telemetry`);
  console.log(`======================================================\n`);
});

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down cosmic server gracefully...`);
  server.close(() => {
    console.log('[Server] Deep Space connection closed. Mission terminated cleanly.');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
