// Plik server/routes/assignmentRoutes.js
import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authenticateToken, requireRole(['admin', 'dispatcher']), assignmentController.getAllAssignments);
router.post('/', authenticateToken, requireRole(['admin', 'dispatcher']), assignmentController.createAssignment);
router.delete('/:id', authenticateToken, requireRole(['admin', 'dispatcher']), assignmentController.deleteAssignment); // Changed from :assignmentId to :id
router.post('/bulk', authenticateToken, requireRole(['admin', 'dispatcher']), assignmentController.bulkCreateAssignments);

export default router;