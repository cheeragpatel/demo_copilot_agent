/**
 * CSRF Protection utilities - Reference: OWASP A01, Secure Coding Instructions 1
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * CSRF protection middleware using double-submit cookies
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF protection for GET requests and certain endpoints
  if (req.method === 'GET' || req.path === '/api/auth/csrf-token') {
    return next();
  }

  const tokenFromHeader = req.headers['x-csrf-token'] as string;
  const tokenFromCookie = req.cookies?.csrfToken;

  if (!tokenFromHeader || !tokenFromCookie || tokenFromHeader !== tokenFromCookie) {
    res.status(403).json({ 
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_MISMATCH'
    });
    return;
  }

  next();
}

/**
 * Middleware to generate and set CSRF token
 */
export function setCSRFToken(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies?.csrfToken) {
    const token = generateCSRFToken();
    res.cookie('csrfToken', token, {
      httpOnly: false, // Needs to be accessible to JavaScript for headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }
  next();
}