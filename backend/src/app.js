/**
 * Voyager Express Application Setup
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const telemetryRoutes = require('./routes/telemetry.routes');

const app = express();

// Security & CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or local file)
    if (!origin || config.clientOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Lightweight Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VOYAGER Deep Space Mission API',
    endpoints: {
      health: '/api/health',
      leaderboard: '/api/leaderboard',
      telemetry: '/api/telemetry'
    },
    documentation: 'See backend/README.md for usage details.'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `API route not found: ${req.method} ${req.url}`,
      status: 404
    }
  });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
