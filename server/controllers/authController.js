// server/controllers/authController.js
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { isStrongPassword, passwordStrengthMessage } = require('../utils/validation.js');
const authService = require('../services/authService.js');
const userService = require('../services/userService.js');

// --- Walidacja rejestracji ---
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('firstName').not().isEmpty().withMessage('First name is required.').trim().escape(),
  body('lastName').not().isEmpty().withMessage('Last name is required.').trim().escape(),
  body('password').custom(value => {
    if (!isStrongPassword(value)) {
      throw new Error(passwordStrengthMessage);
    }
    return true;
  }),
];

// --- Rejestracja użytkownika ---
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    const newUser = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: 'user', // jawnie ustawiamy rolę
    });

    const userPayload = {
      email: newUser.email,
      role: newUser.role,
    };

    return res.status(201).json({
      message: 'User registered successfully.',
      user: userPayload,
    });
  } catch (error) {
    next(error);
  }
};

// --- Walidacja logowania ---
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').not().isEmpty().withMessage('Password cannot be empty.'),
];

// --- Logowanie użytkownika ---
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = await authService.generateTokens(user);

    // Zapisz refreshToken w httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // tylko HTTPS w produkcji
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni
    });

    const userPayload = {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.json({ accessToken, user: userPayload });
  } catch (error) {
    next(error);
  }
};

// --- Weryfikacja access tokenu ---
const verifyToken = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.auth.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.json({ valid: true, user: userPayload });
  } catch (error) {
    next(error);
  }
};

// --- Odświeżanie tokenu (refresh token flow) ---
const refreshToken = async (req, res, next) => {
  const tokenFromCookie = req.cookies.refreshToken;
  if (!tokenFromCookie) {
    return res.status(401).json({ error: 'Refresh token not found.' });
  }

  try {
    console.log('🔁 Refresh request received. Cookie present:', !!tokenFromCookie);

    const user = await userService.findUserByRefreshToken(tokenFromCookie);
    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
    if (user.id !== decoded.userId) {
      return res.status(403).json({ error: 'Invalid refresh token payload.' });
    }

    // Generujemy nowy accessToken
    const accessToken = await authService.refreshAccessToken(user);

    return res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: 'Refresh token has expired. Please log in again.' });
    }
    next(error);
  }
};

// --- Wylogowanie użytkownika ---
const logout = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    if (tokenFromCookie) {
      const user = await userService.findUserByRefreshToken(tokenFromCookie);
      if (user) {
        await userService.updateUserRefreshToken(user.id, null);
      }
    }

    // Usuwamy cookie po stronie klienta
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerValidation,
  register,
  loginValidation,
  login,
  verifyToken,
  logout,
  refreshToken,
};
