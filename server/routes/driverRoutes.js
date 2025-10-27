// Plik server/routes/driverRoutes.js
const express = require('express');
const driverController = require('../controllers/driverController.js');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware.js');

// Wszystkie trasy w tym pliku są chronione i wymagają uwierzytelnienia oraz uprawnień admina
const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', driverController.getAllDrivers);
router.get('/export', driverController.exportDrivers);
router.post('/import', driverController.importDrivers);
router.post('/', driverController.createDriver);
router.put('/:driverId', driverController.updateDriver);
router.delete('/:driverId', driverController.deleteDriver);

module.exports = router;