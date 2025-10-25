// Plik server/controllers/runController.js
import * as runService from '../services/runService.js';
import * as manifestService from '../services/manifestService.js';

export const getAllRuns = async (req, res, next) => {
  try {
    // Przekazujemy filtry z zapytania (np. ?date=YYYY-MM-DD) do serwisu
    const filters = req.query;
    const runs = await runService.findAllRuns(filters);
    res.json(runs);
  } catch (error) {
    next(error);
  }
};

export const generateManifest = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[runController] Otrzymano żądanie wygenerowania manifestu dla przejazdu o ID: ${id}`);
    
    const pdfBuffer = await manifestService.generateRunManifestPDF(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="manifest_run_${id}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error(`[runController] Błąd podczas generowania manifestu:`, error);
    next(error);
  }
};

export const createRun = async (req, res, next) => {
  try {
    const newRun = await runService.createRun(req.body);
    res.status(201).json(newRun);
  } catch (error) {
    next(error);
  }
};

export const deleteRun = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[runController] Otrzymano żądanie usunięcia przejazdu o ID: ${id}`);
    const changes = await runService.deleteRun(id);
    if (changes === 0) {
      console.warn(`[runController] Nie znaleziono przejazdu o ID: ${id} do usunięcia.`);
      return res.status(404).json({ error: 'Run not found.' });
    }
    console.log(`[runController] Pomyślnie usunięto przejazd o ID: ${id}.`);
    res.status(204).send(); // 204 No Content - standardowa odpowiedź dla udanego usunięcia
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Zmiana z runId na id
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const updatedRun = await runService.updateRunStatus(id, status);

    if (!updatedRun) {
      return res.status(404).json({ error: 'Run not found.' });
    }
    res.json(updatedRun);
  } catch (error) {
    next(error);
  }
};

export const updateRun = async (req, res, next) => {
  try {
    const { id } = req.params; // Zmiana z runId na id
    const updatedRun = await runService.updateRun(id, req.body);
    if (!updatedRun) {
      return res.status(404).json({ error: 'Run not found or already deleted.' });
    }
    res.status(200).json(updatedRun);
  } catch (error) {
    next(error);
  }
};