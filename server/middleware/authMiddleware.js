// Plik server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Token z cookie lub nagłówka Authorization: Bearer <token>
  const header = req.headers.authorization;
  const headerToken = header && header.startsWith('Bearer ') ? header.slice(7) : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken; // Pozostawiamy cookieToken dla ewentualnej przyszłej kompatybilności

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is missing.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('Server Error: JWT_SECRET is not defined.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }
  try {
    const auth = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = auth; // np. { userId: 1, email: '...', role: 'admin' }
    return next();
  } catch (err) {
    // Błąd weryfikacji tokenu (np. wygasł)
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Opcjonalne middleware do autentykacji.
 * Próbuje zweryfikować token, jeśli jest dostępny, i dodaje `req.auth`.
 * Jeśli tokenu nie ma lub jest nieprawidłowy, po prostu przechodzi dalej bez błędu.
 */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  // Jeśli nie ma tokenu, po prostu idź dalej. req.auth będzie niezdefiniowane.
  if (!token) {
    return next();
  }

  if (!process.env.JWT_SECRET) {
    // Ten błąd powinien być logowany, ale nie powinien zatrzymywać żądania
    console.error('Server Error: JWT_SECRET is not defined for optional auth.');
    return next();
  }

  try {
    const auth = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = auth; // Dodaj dane użytkownika do żądania
  } catch (err) {
    // Ignoruj błędy weryfikacji (np. wygaśnięcie tokenu) i po prostu kontynuuj
  }
  return next();
};

/**
 * Middleware do sprawdzania, czy użytkownik ma jedną z wymaganych ról.
 * @param {string[]} roles - Tablica dozwolonych ról (np. ['admin', 'dispatcher']).
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    // Zakładamy, że authenticateToken zostało już użyte i req.auth istnieje.
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Insufficient permissions to perform this operation.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth,
};