import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', userController.getAllUsers);
router.get('/export', userController.exportUsers);
router.post('/', userController.createUser);
router.post('/import', userController.importUsers);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export default router;