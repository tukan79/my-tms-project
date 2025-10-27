// Plik server/routes/orderRoutes.js
const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware.js');
const orderController = require('../controllers/orderController.js');
const { validateOrder } = require('../middleware/validationMiddleware.js'); // Importujemy walidację

// Wszystkie trasy dla zleceń wymagają autentykacji
const router = express.Router();
router.use(authenticateToken, requireRole(['admin', 'dispatcher']));

router.get('/', orderController.getAllOrders);
router.post('/', validateOrder, orderController.createOrder); // Dodajemy walidację
router.post('/import', orderController.importOrders);
router.put('/:id', validateOrder, orderController.updateOrder); // Dodajemy walidację
router.delete('/bulk', orderController.bulkDeleteOrders); // Nowa trasa
router.delete('/:id', orderController.deleteOrder);
router.get('/:id/labels', orderController.generateLabels);

module.exports = router;
