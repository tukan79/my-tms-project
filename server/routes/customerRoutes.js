// Plik server/routes/customerRoutes.js
import express from 'express';
import * as customerController from '../controllers/customerController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

// Wszystkie trasy chronione, dostępne tylko dla admina
const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', customerController.getAllCustomers);
router.get('/export', customerController.exportCustomers);
router.post('/', customerController.createCustomer);
router.post('/import', customerController.importCustomers);
router.put('/:customerId', customerController.updateCustomer);
router.delete('/:customerId', customerController.deleteCustomer);

export default router;