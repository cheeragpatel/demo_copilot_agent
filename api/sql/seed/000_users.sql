-- Default admin user for development
-- Reference: OWASP A07, Secure Coding Instructions 7
-- Password: AdminPass123! (hashed with bcrypt)
INSERT INTO users (email, password_hash, is_admin) VALUES (
    'admin@github.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeUuhrCM9TBQqJ3.q',
    1
);

-- Default user for testing
-- Password: UserPass123! (hashed with bcrypt)
INSERT INTO users (email, password_hash, is_admin) VALUES (
    'user@example.com',
    '$2b$12$mK1Q2s8Vw9Ej3Q9Nx7G8O.OQ8rR2cR7X9mY6.4xK1O.pV3wB8vF5S',
    0
);