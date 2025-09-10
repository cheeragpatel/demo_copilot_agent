/**
 * Authentication utilities - Reference: OWASP A07, Secure Coding Instructions 7
 */

import bcrypt from 'bcrypt';
import { Request } from 'express';

const SALT_ROUNDS = 12; // Strong salt rounds for bcrypt
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Hash password using bcrypt with salt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Check if account is locked
 */
export function isAccountLocked(failedAttempts: number, lockedUntil?: string): boolean {
  if (failedAttempts >= MAX_LOGIN_ATTEMPTS && lockedUntil) {
    return new Date(lockedUntil) > new Date();
  }
  return false;
}

/**
 * Calculate lockout expiry time
 */
export function getLockoutExpiry(): string {
  return new Date(Date.now() + LOCKOUT_DURATION).toISOString();
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Rate limiting tracking for authentication attempts
 */
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }
  
  if (now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (attempt.count >= 10) { // 10 attempts per 15 minutes per IP
    return false;
  }
  
  attempt.count++;
  return true;
}

/**
 * Get client IP address safely
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress || 'unknown';
  
  return ip;
}