const express = require('express');
const userController = require('../controllers/userController.js');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware.js');

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

router.get('/', userController.getAllUsers);
router.get('/export', userController.exportUsers);
router.post('/', userController.createUser); // Dodajemy walidację
router.post('/import', userController.importUsers); // Dodajemy walidację
router.put('/:userId', userController.updateUser); // Dodajemy walidację
router.delete('/:userId', userController.deleteUser); // Dodajemy walidację

module.exports = router;