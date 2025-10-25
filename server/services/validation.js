// Plik: server/utils/validation.js
import validator from 'validator';

export const passwordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export const passwordStrengthMessage = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';

/**
 * Sprawdza, czy hasło spełnia zdefiniowane wymagania bezpieczeństwa.
 * @param {string} password - Hasło do sprawdzenia.
 * @returns {boolean} - Zwraca true, jeśli hasło jest silne.
 */
export const isStrongPassword = (password) => {
  if (!password) return false;
  return validator.isStrongPassword(password, passwordOptions);
};