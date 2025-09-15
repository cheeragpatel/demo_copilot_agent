import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersRepository } from '../repositories/usersRepo';
import { User, GoogleProfile } from '../models/user';
import { NotFoundError } from '../utils/errors';

// Mock the getDatabase function first
vi.mock('../db/sqlite', () => ({
  getDatabase: vi.fn(),
}));

// Import the mocked module
import { getDatabase } from '../db/sqlite';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockDb: any;

  const mockUser: User = {
    userId: 1,
    googleSub: 'google123',
    email: 'test@example.com',
    name: 'Test User',
    pictureUrl: 'https://example.com/picture.jpg',
    role: 'shopper',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockGoogleProfile: GoogleProfile = {
    sub: 'google123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/picture.jpg',
  };

  beforeEach(() => {
    // Create mock database connection
    mockDb = {
      db: {} as any,
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn(),
    };

    // Mock getDatabase to return our mock
    (getDatabase as any).mockResolvedValue(mockDb);

    repository = new UsersRepository(mockDb);
    vi.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockResult = {
        user_id: 1,
        google_sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };
      mockDb.get.mockResolvedValue(mockResult);

      const result = await repository.findById(1);

      expect(mockDb.get).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?', [1]);
      expect(result?.userId).toBe(1);
      expect(result?.googleSub).toBe('google123');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockDb.get.mockResolvedValue(undefined);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByGoogleSub', () => {
    it('should return user when found by Google Sub', async () => {
      const mockResult = {
        user_id: 1,
        google_sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };
      mockDb.get.mockResolvedValue(mockResult);

      const result = await repository.findByGoogleSub('google123');

      expect(mockDb.get).toHaveBeenCalledWith('SELECT * FROM users WHERE google_sub = ?', [
        'google123',
      ]);
      expect(result?.googleSub).toBe('google123');
    });

    it('should return null when user not found by Google Sub', async () => {
      mockDb.get.mockResolvedValue(undefined);

      const result = await repository.findByGoogleSub('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const mockResult = {
        user_id: 1,
        google_sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };
      mockDb.get.mockResolvedValue(mockResult);

      const result = await repository.findByEmail('test@example.com');

      expect(mockDb.get).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [
        'test@example.com',
      ]);
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user not found by email', async () => {
      mockDb.get.mockResolvedValue(undefined);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const newUser = {
        googleSub: 'google456',
        email: 'new@example.com',
        name: 'New User',
        pictureUrl: 'https://example.com/new.jpg',
        role: 'shopper' as const,
      };

      mockDb.run.mockResolvedValue({ lastID: 2, changes: 1 });
      mockDb.get.mockResolvedValue({
        user_id: 2,
        google_sub: 'google456',
        email: 'new@example.com',
        name: 'New User',
        picture_url: 'https://example.com/new.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      });

      const result = await repository.create(newUser);

      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO users (google_sub, email, name, picture_url, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['google456', 'new@example.com', 'New User', 'https://example.com/new.jpg', 'shopper', expect.any(String), expect.any(String)],
      );
      expect(result.userId).toBe(2);
      expect(result.email).toBe('new@example.com');
    });
  });

  describe('update', () => {
    it('should update existing user and return updated data', async () => {
      const updateData = { name: 'Updated User' };

      mockDb.run.mockResolvedValue({ changes: 1 });
      mockDb.get.mockResolvedValue({
        user_id: 1,
        google_sub: 'google123',
        email: 'test@example.com',
        name: 'Updated User',
        picture_url: 'https://example.com/picture.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      });

      const result = await repository.update(1, updateData);

      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE users SET name = ?, updated_at = ? WHERE user_id = ?',
        ['Updated User', expect.any(String), 1],
      );
      expect(result.name).toBe('Updated User');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 });

      await expect(repository.update(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      mockDb.get.mockResolvedValue({ count: 1 });

      const result = await repository.exists(1);

      expect(result).toBe(true);
      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM users WHERE user_id = ?',
        [1],
      );
    });

    it('should return false when user does not exist', async () => {
      mockDb.get.mockResolvedValue({ count: 0 });

      const result = await repository.exists(999);

      expect(result).toBe(false);
    });
  });

  describe('upsertFromGoogleProfile', () => {
    it('should create new user when none exists', async () => {
      // No existing user found by Google Sub or email
      mockDb.get.mockResolvedValueOnce(undefined); // findByGoogleSub
      mockDb.get.mockResolvedValueOnce(undefined); // findByEmail

      // Create new user
      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 });
      mockDb.get.mockResolvedValueOnce({
        user_id: 1,
        google_sub: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      });

      const result = await repository.upsertFromGoogleProfile(mockGoogleProfile);

      expect(result.googleSub).toBe('google123');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('shopper');
    });

    it('should update existing user when found by Google Sub', async () => {
      // User found by Google Sub
      const existingUser = {
        user_id: 1,
        google_sub: 'google123',
        email: 'old@example.com',
        name: 'Old Name',
        picture_url: null,
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };
      mockDb.get.mockResolvedValueOnce(existingUser); // findByGoogleSub

      // Update user
      mockDb.run.mockResolvedValue({ changes: 1 });
      mockDb.get.mockResolvedValueOnce({
        ...existingUser,
        email: 'test@example.com',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        updated_at: '2023-01-02T00:00:00.000Z',
      });

      const result = await repository.upsertFromGoogleProfile(mockGoogleProfile);

      expect(result.googleSub).toBe('google123');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should attach Google Sub to existing user found by email', async () => {
      // No user found by Google Sub
      mockDb.get.mockResolvedValueOnce(undefined); // findByGoogleSub

      // User found by email (without Google Sub)
      const existingUser = {
        user_id: 1,
        google_sub: null,
        email: 'test@example.com',
        name: 'Existing User',
        picture_url: null,
        role: 'shopper',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };
      mockDb.get.mockResolvedValueOnce(existingUser); // findByEmail

      // Update user with Google Sub
      mockDb.run.mockResolvedValue({ changes: 1 });
      mockDb.get.mockResolvedValueOnce({
        ...existingUser,
        google_sub: 'google123',
        name: 'Test User',
        picture_url: 'https://example.com/picture.jpg',
        updated_at: '2023-01-02T00:00:00.000Z',
      });

      const result = await repository.upsertFromGoogleProfile(mockGoogleProfile);

      expect(result.googleSub).toBe('google123');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });
  });
});