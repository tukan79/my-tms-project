// Plik: server/routes/surchargeTypeRoutes.js
import express from 'express';
import * as surchargeTypeController from '../controllers/surchargeTypeController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

// Wszystkie operacje na typach dopłat wymagają uprawnień admina
const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', surchargeTypeController.getAll);
router.post('/', surchargeTypeController.create);
router.put('/:id', surchargeTypeController.update);
router.delete('/:id', surchargeTypeController.deleteSurcharge);

export default router;