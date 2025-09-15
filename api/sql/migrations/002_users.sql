-- Users table migration
-- Migration 002: Create users table for Google-authenticated shoppers
-- 
-- This migration creates a users table to store authenticated user profiles
-- from Google OAuth integration. It supports the OctoCAT Supply Chain Management
-- system's user authentication and authorization requirements.

-- Create users table to store authenticated user profiles
CREATE TABLE users (
    -- Primary key for the users table, auto-incremented integer
    user_id INTEGER PRIMARY KEY,
    
    -- Google's unique subject identifier from OAuth token (sub claim)
    -- This is the immutable identifier that Google provides for each user
    -- UNIQUE constraint ensures one Google account = one user record
    google_sub TEXT UNIQUE NOT NULL,
    
    -- User's email address from Google profile
    -- UNIQUE constraint prevents duplicate email registrations
    -- Used for user lookup and communication
    email TEXT UNIQUE NOT NULL,
    
    -- User's display name from Google profile
    -- Required field for user identification in the UI
    name TEXT NOT NULL,
    
    -- URL to user's profile picture from Google
    -- Optional field that can be NULL if user has no profile picture
    picture_url TEXT,
    
    -- User's role in the system (e.g., 'shopper', 'admin', 'manager')
    -- Defaults to 'shopper' for new registrations
    -- Used for authorization and access control
    role TEXT NOT NULL DEFAULT 'shopper',
    
    -- Timestamp when the user record was first created
    -- Automatically set to current time when record is inserted
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamp when the user record was last modified
    -- Should be updated whenever any user data changes
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance optimization indexes
-- These indexes improve query performance for common lookup patterns

-- Index on google_sub for fast OAuth token validation
-- Used when authenticating users via Google OAuth flow
CREATE INDEX idx_users_google_sub ON users(google_sub);

-- Index on email for user lookup and duplicate checking
-- Used for finding existing users by email during registration
CREATE INDEX idx_users_email ON users(email);

-- Index on role for authorization queries
-- Used when filtering users by role or checking permissions
CREATE INDEX idx_users_role ON users(role);