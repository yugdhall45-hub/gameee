/**
 * Centralized Environment Configuration & Defaults
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development',
  clientOrigins: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5500', 'http://localhost:8080', 'http://127.0.0.1:5500', 'http://127.0.0.1:8080'],
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || null,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null
  }
};

module.exports = config;
