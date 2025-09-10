/**
 * User model for authentication
 * Reference: OWASP A07, Secure Coding Instructions 7
 */

export interface User {
  userId: number;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
}