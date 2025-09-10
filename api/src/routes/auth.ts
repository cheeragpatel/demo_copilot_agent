/**
 * Authentication routes - Reference: OWASP A07, Secure Coding Instructions 7
 */

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { handleValidationErrors } from '../utils/validation';
import { csrfProtection } from '../utils/csrf';
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength,
  isAccountLocked,
  getLockoutExpiry,
  checkRateLimit,
  getClientIP
} from '../utils/auth';
import { getDatabase } from '../db/sqlite';
import { User } from '../models/user';
import { ENV_CONFIG } from '../config/environment';

// Extend Express session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
    email?: string;
  }
}

const router = express.Router();

// Enhanced rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Session configuration
const sessionConfig = session({
  secret: ENV_CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Don't use default session name
  cookie: {
    secure: ENV_CONFIG.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
});

router.use(sessionConfig);

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
];

// Registration validation  
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .custom((value) => {
      const { valid, errors } = validatePasswordStrength(value);
      if (!valid) {
        throw new Error(errors.join(', '));
      }
      return true;
    }),
];

/**
 * GET /api/auth/csrf-token
 */
router.get('/csrf-token', (req: Request, res: Response) => {
  res.json({ 
    csrfToken: req.cookies?.csrfToken || 'no-token',
    message: 'Include this token in X-CSRF-Token header for POST requests'
  });
});

/**
 * POST /api/auth/login
 */
router.post('/login', csrfProtection, authRateLimit, loginValidation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const clientIP = getClientIP(req);
    
    // Additional IP-based rate limiting
    if (!checkRateLimit(clientIP)) {
      res.status(429).json({ 
        error: 'Too many login attempts from this IP address' 
      });
      return;
    }

    const db = await getDatabase();
    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if account is locked
    if (isAccountLocked(user.failedLoginAttempts, user.lockedUntil)) {
      res.status(423).json({ 
        error: 'Account is temporarily locked due to too many failed attempts' 
      });
      return;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      // Increment failed attempts
      const newFailedAttempts = user.failedLoginAttempts + 1;
      const lockoutExpiry = newFailedAttempts >= 5 ? getLockoutExpiry() : null;
      
      await db.run(
        'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE user_id = ?',
        [newFailedAttempts, lockoutExpiry, user.userId]
      );
      
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Reset failed attempts and update last login
    await db.run(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = datetime("now") WHERE user_id = ?',
      [user.userId]
    );

    // Set session
    req.session.userId = user.userId;
    req.session.isAdmin = Boolean(user.isAdmin);
    req.session.email = user.email;

    res.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        isAdmin: Boolean(user.isAdmin)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/register
 */
router.post('/register', csrfProtection, authRateLimit, registerValidation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const db = await getDatabase();
    
    // Check if user already exists
    const existingUser = await db.get('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
      [email, passwordHash, 0]
    );

    res.status(201).json({
      success: true,
      user: {
        userId: result.lastID,
        email,
        isAdmin: false
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', csrfProtection, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('sessionId');
    res.json({ success: true });
  });
});

/**
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({
      userId: req.session.userId,
      email: req.session.email,
      isAdmin: req.session.isAdmin
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Authentication middleware for protecting routes
export const requireAuth = (req: any, res: any, next: any): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

export const requireAdmin = (req: any, res: any, next: any): void => {
  if (!req.session.userId || !req.session.isAdmin) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

export default router;