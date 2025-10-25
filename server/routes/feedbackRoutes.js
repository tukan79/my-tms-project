// Plik: server/routes/feedbackRoutes.js
import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Wszystkie trasy w tym pliku wymagają zalogowanego użytkownika
const router = express.Router();
router.use(authenticateToken);

router.post('/report-bug', feedbackController.reportBug);

export default router;