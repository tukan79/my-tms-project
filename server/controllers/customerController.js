// Plik server/controllers/customerController.js
import * as customerService from '../services/customerService.js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.findAllCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const exportCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.findAllCustomers();
    const csv = Papa.unparse(customers);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `customers_${timestamp}.csv`;
    const exportsDir = path.join(__dirname, '../exports');

    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const filePath = path.join(exportsDir, filename);
    fs.writeFileSync(filePath, csv, 'utf8');

    res.status(200).json({ message: `File successfully exported to server as ${filename}` });
  } catch (error) {
    console.error('Failed to export customers:', error);
    res.status(500).json({ error: 'An error occurred while exporting customers.' });
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const updatedCustomer = await customerService.updateCustomer(req.params.customerId, req.body);
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const changes = await customerService.deleteCustomer(req.params.customerId);
    if (changes === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const importCustomers = async (req, res, next) => {
  try {
    const result = await customerService.importCustomers(req.body);
    res.status(201).json({ message: `Successfully imported ${result.count} customers.`, ...result });
  } catch (error) {
    next(error);
  }
};