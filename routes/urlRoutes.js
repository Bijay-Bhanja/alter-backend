const express = require('express');
const { createShortUrl, redirectUrl, getAnalytics, getTopicAnalytics, getOverallAnalytics } = require('../controllers/urlController');
const router = express.Router();

/**
 * @route POST /api/shorten
 * @desc Create a short URL
 */
router.post('/shorten', createShortUrl);

/**
 * @route GET /api/shorten/:alias
 * @desc Redirect to original URL
 */
router.get('/shorten/:alias', redirectUrl);

/**
 * @route GET /api/analytics/:alias
 * @desc Get analytics for a specific short URL
 */
router.get('/analytics/:alias', getAnalytics);

/**
 * @route GET /api/analytics/topic/:topic
 * @desc Get analytics for URLs under a topic
 */
router.get('/analytics/topic/:topic', getTopicAnalytics);

/**
 * @route GET /api/analytics/overall
 * @desc Get overall analytics for the user
 */
router.get('/analytics/overall', getOverallAnalytics);

module.exports = router;    
