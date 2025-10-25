// Plik server/routes/truckRoutes.js
import express from 'express';
import * as truckController from '../controllers/truckController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', truckController.getAllTrucks);
router.get('/export', truckController.exportTrucks);
router.post('/import', truckController.importTrucks); // Add the import route
router.post('/', truckController.createTruck);
router.put('/:truckId', truckController.updateTruck);
router.delete('/:truckId', truckController.deleteTruck);

export default router;