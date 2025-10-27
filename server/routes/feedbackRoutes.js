// Plik: server/routes/feedbackRoutes.js
const express = require('express');
const feedbackController = require('../controllers/feedbackController.js');
const { authenticateToken } = require('../middleware/authMiddleware.js');

// Wszystkie trasy w tym pliku wymagają zalogowanego użytkownika
const router = express.Router();
router.use(authenticateToken);

router.post('/report-bug', feedbackController.reportBug);

module.exports = router;