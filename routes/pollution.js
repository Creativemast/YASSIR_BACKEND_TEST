const express = require('express');
const PollutionController = require('../controllers/pollution');

const router = express.Router();

/**
 * latitude
 * longitude
 */
router.get('/byPosition/:latitude/:longitude', PollutionController.getPollutionByPosition);

/**
 * standard: EPA or MEP
 */
router.get('/mostPolluted/:standard', PollutionController.getMostPollutedTimeByStandard);

module.exports = router;