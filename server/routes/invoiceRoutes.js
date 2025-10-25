// Plik: server/routes/invoiceRoutes.js
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import * as invoiceController from '../controllers/invoiceController.js';

// Wszystkie trasy dla faktur wymagają uwierzytelnienia i roli admina lub dyspozytora
const router = express.Router();
router.use(authenticateToken, requireRole(['admin', 'dispatcher']));

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id/pdf', invoiceController.downloadInvoicePDF);

export default router;