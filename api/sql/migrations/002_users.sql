-- Users table migration
-- Migration 002: Create users table for Google-authenticated shoppers

-- Create users table
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    google_sub TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    picture_url TEXT,
    role TEXT NOT NULL DEFAULT 'shopper',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_google_sub ON users(google_sub);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);