// Plik: server/routes/invoiceRoutes.js
const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware.js');
const invoiceController = require('../controllers/invoiceController.js');

// Wszystkie trasy dla faktur wymagają uwierzytelnienia i roli admina lub dyspozytora
const router = express.Router();
router.use(authenticateToken, requireRole(['admin', 'dispatcher']));

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id/pdf', invoiceController.downloadInvoicePDF);

module.exports = router;