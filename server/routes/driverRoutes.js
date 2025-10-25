// Plik server/routes/driverRoutes.js
import express from 'express';
import * as driverController from '../controllers/driverController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

// Wszystkie trasy w tym pliku są chronione i wymagają uwierzytelnienia oraz uprawnień admina
const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', driverController.getAllDrivers);
router.get('/export', driverController.exportDrivers);
router.post('/import', driverController.importDrivers);
router.post('/', driverController.createDriver);
router.put('/:driverId', driverController.updateDriver);
router.delete('/:driverId', driverController.deleteDriver);

export default router;