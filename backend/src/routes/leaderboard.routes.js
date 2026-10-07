const express = require('express');
const router = express.Router();
const { getLeaderboard, submitScore } = require('../controllers/leaderboard.controller');
const validateScore = require('../middleware/validateScore');

router.get('/', getLeaderboard);
router.post('/', validateScore, submitScore);

module.exports = router;
