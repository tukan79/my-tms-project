// Plik: server/controllers/invoiceController.js
const invoiceService = require('../services/invoiceService.js');
const invoicePdfService = require('../services/invoicePdfService.js');

exports.createInvoice = async (req, res, next) => {
  try {
    const { customerId, startDate, endDate } = req.body;
    if (!customerId || !startDate || !endDate) {
      return res.status(400).json({ error: 'customerId, startDate, and endDate are required.' });
    }

    const newInvoice = await invoiceService.createInvoice(customerId, startDate, endDate);
    res.status(201).json(newInvoice);
  } catch (error) {
    // Przekazujemy błąd do centralnego middleware'a obsługi błędów
    next(error);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.findAllInvoices();
    res.json({ invoices: invoices || [] });
  } catch (error) {
    next(error);
  }
};

exports.downloadInvoicePDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pdfBuffer = await invoicePdfService.generateInvoicePDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice_${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};