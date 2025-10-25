// Plik server/routes/postcodeZoneRoutes.js
import express from 'express';
import * as zoneController from '../controllers/postcodeZoneController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/export', zoneController.exportZones);
router.post('/import', zoneController.importZones);
router.get('/', zoneController.getAllZones);
router.post('/', zoneController.createZone);
router.put('/:zoneId', zoneController.updateZone);
router.delete('/:zoneId', zoneController.deleteZone);

export default router;