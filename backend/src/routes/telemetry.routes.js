const express = require('express');
const router = express.Router();
const { recordTelemetry, getRecentTelemetry } = require('../controllers/telemetry.controller');

router.get('/', getRecentTelemetry);
router.post('/', recordTelemetry);

module.exports = router;
