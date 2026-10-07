/**
 * Firebase Admin SDK Integration (Optional Server-Side Auth / DB)
 * Gracefully operates in mock/in-memory mode if credentials are not configured.
 */
const config = require('./env');

let adminDb = null;
let isInitialized = false;

try {
  if (config.firebase.projectId && config.firebase.privateKey) {
    const admin = require('firebase-admin');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      })
    });
    adminDb = admin.firestore();
    isInitialized = true;
    console.log('[FirebaseAdmin] Connected to Cloud Firestore successfully.');
  } else {
    console.log('[FirebaseAdmin] No service account credentials found. Using high-performance in-memory cache.');
  }
} catch (err) {
  console.warn('[FirebaseAdmin] Firebase Admin initialization skipped:', err.message);
}

module.exports = {
  adminDb,
  isInitialized: () => isInitialized
};
