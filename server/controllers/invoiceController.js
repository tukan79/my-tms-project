// Plik: server/controllers/invoiceController.js
import * as invoiceService from '../services/invoiceService.js';
import * as invoicePdfService from '../services/invoicePdfService.js';

export const createInvoice = async (req, res, next) => {
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

export const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.findAllInvoices();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const downloadInvoicePDF = async (req, res, next) => {
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