// Plik server/routes/orderRoutes.js
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import * as orderController from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validationMiddleware.js'; // Importujemy walidację

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

export default router;
