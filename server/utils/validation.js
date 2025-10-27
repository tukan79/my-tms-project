// Plik: server/utils/validation.js
const validator = require('validator');

const passwordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const passwordStrengthMessage = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';

/**
 * Sprawdza, czy hasło spełnia zdefiniowane wymagania bezpieczeństwa.
 * @param {string} password - Hasło do sprawdzenia.
 * @returns {boolean} - Zwraca true, jeśli hasło jest silne.
 */
const isStrongPassword = (password) => {
  if (!password) return false;
  return validator.isStrongPassword(password, passwordOptions);
};

module.exports = {
  passwordOptions,
  passwordStrengthMessage,
  isStrongPassword
};