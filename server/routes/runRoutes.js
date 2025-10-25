// Plik server/routes/runRoutes.js
import express from 'express';
import * as runController from '../controllers/runController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { validateRun } from '../middleware/validationMiddleware.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin', 'dispatcher']));

router.get('/', runController.getAllRuns);
router.post('/', validateRun, runController.createRun);
router.delete('/:id', runController.deleteRun);
router.get('/:id/manifest', runController.generateManifest);
router.put('/:id', validateRun, runController.updateRun); // Zmieniamy na :id dla spójności z kontrolerem
router.patch('/:id/status', runController.updateStatus); // Zmieniamy na :id dla spójności z kontrolerem

export default router;