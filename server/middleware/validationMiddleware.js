// Plik: server/middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator';

// Middleware do obsługi błędów walidacji
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Zwracamy tylko pierwszą wiadomość o błędzie dla uproszczenia
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({ error: firstError });
  }
  next();
};

// Walidacja dla tworzenia i aktualizacji przejazdu (run)
export const validateRun = [
  body('run_date')
    .isISO8601()
    .withMessage('A valid run date is required.'),
  body('type')
    .isIn(['collection', 'delivery', 'trunking'])
    .withMessage('A valid run type is required (collection, delivery, or trunking).'),
  body('driver_id')
    .isInt({ min: 1 })
    .withMessage('A valid driver ID is required.'),
  body('truck_id')
    .isInt({ min: 1 })
    .withMessage('A valid truck ID is required.'),
  // Dodajemy obsługę błędów na końcu łańcucha walidacji
  handleValidationErrors,
];

// Walidacja dla tworzenia i aktualizacji zamówienia (order)
export const validateOrder = [
  body('client_id')
    .isInt({ min: 1 })
    .withMessage('A valid client ID is required.'),
  body('pickup_postcode')
    .notEmpty()
    .withMessage('Pickup postcode is required.'),
  body('delivery_postcode')
    .notEmpty()
    .withMessage('Delivery postcode is required.'),
  body('status')
    .optional() // Status może nie być ustawiany przy tworzeniu
    .isIn(['new', 'assigned', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid order status.'),
  body('pallets')
    .isArray()
    .withMessage('Pallets must be an array.'),
  // Dodajemy obsługę błędów na końcu łańcucha walidacji
  handleValidationErrors,
];