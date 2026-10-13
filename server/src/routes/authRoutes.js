import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../services/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, registerSchema, loginSchema, preferencesSchema } from '../middleware/validation.js';

const router = express.Router();

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'signbridge_dev_secret_key_894372985729357';
  const id = user._id || user.id;
  return jwt.sign(
    { userId: id, email: user.email },
    secret,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { name, email, password, preferredLanguage, accessibilityPreferences } = req.validatedBody;

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await store.createUser({
      name,
      email,
      password: hashedPassword,
      preferredLanguage: preferredLanguage || 'en',
      accessibilityPreferences: accessibilityPreferences || {
        fontSize: 'normal',
        highContrast: false,
        reducedMotion: false,
        speechRate: 1.0,
        autoSpeak: false,
      },
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete registration. Please try again.',
    });
  }
});

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    const userWithPassword = await store.findUserByEmail(email, true);
    if (!userWithPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(userWithPassword);
    const sanitizedUser = await store.findUserById(userWithPassword._id || userWithPassword.id);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login request failed. Please try again.',
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

// PUT /api/auth/preferences
router.put('/preferences', authenticateToken, validateRequest(preferencesSchema), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updatedUser = await store.updateUserPreferences(userId, req.validatedBody);

    return res.json({
      success: true,
      message: 'Accessibility preferences updated.',
      user: updatedUser,
      preferences: updatedUser?.accessibilityPreferences,
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update preferences.',
    });
  }
});

export default router;
