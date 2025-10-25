// Plik server/routes/trailerRoutes.js
import express from 'express';
import * as trailerController from '../controllers/trailerController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', trailerController.getAllTrailers);
router.get('/export', trailerController.exportTrailers);
router.post('/import', trailerController.importTrailers);
router.post('/', trailerController.createTrailer);
router.put('/:trailerId', trailerController.updateTrailer);
router.delete('/:trailerId', trailerController.deleteTrailer);

export default router;