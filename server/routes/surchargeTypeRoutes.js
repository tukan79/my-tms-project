// Plik: server/routes/surchargeTypeRoutes.js
const express = require('express');
const surchargeTypeController = require('../controllers/surchargeTypeController.js');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware.js');

// Wszystkie operacje na typach dopłat wymagają uprawnień admina
const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', surchargeTypeController.getAll);
router.post('/', surchargeTypeController.create);
router.put('/:id', surchargeTypeController.update);
router.delete('/:id', surchargeTypeController.deleteSurcharge);

module.exports = router;