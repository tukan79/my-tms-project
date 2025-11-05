// Plik: server/routes/feedbackRoutes.js
const express = require('express');
const feedbackController = require('../controllers/feedbackController.js');
const { optionalAuth } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Używamy opcjonalnej autentykacji. Jeśli użytkownik jest zalogowany, jego dane zostaną dołączone.
router.post('/report-bug', optionalAuth, feedbackController.reportBug);

module.exports = router;