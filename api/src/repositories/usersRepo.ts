/**
 * Repository for users data access
 */

import { getDatabase, DatabaseConnection } from '../db/sqlite';
import { User, GoogleProfile } from '../models/user';
import { handleDatabaseError, NotFoundError } from '../utils/errors';
import { buildInsertSQL, buildUpdateSQL, objectToCamelCase } from '../utils/sql';

export class UsersRepository {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  /**
   * Get user by ID
   */
  async findById(id: number): Promise<User | null> {
    try {
      const row = await this.db.get<any>('SELECT * FROM users WHERE user_id = ?', [id]);
      return row ? (objectToCamelCase(row) as User) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get user by Google Sub
   */
  async findByGoogleSub(googleSub: string): Promise<User | null> {
    try {
      const row = await this.db.get<any>('SELECT * FROM users WHERE google_sub = ?', [googleSub]);
      return row ? (objectToCamelCase(row) as User) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const row = await this.db.get<any>('SELECT * FROM users WHERE email = ?', [email]);
      return row ? (objectToCamelCase(row) as User) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Create a new user
   */
  async create(user: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const { sql, values } = buildInsertSQL('users', {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const result = await this.db.run(sql, values);

      const createdUser = await this.findById(result.lastID!);
      if (!createdUser) {
        throw new Error('Failed to retrieve created user');
      }

      return createdUser;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Update user by ID
   */
  async update(id: number, user: Partial<Omit<User, 'userId' | 'createdAt'>>): Promise<User> {
    try {
      const updateData = {
        ...user,
        updatedAt: new Date().toISOString(),
      };

      const { sql, values } = buildUpdateSQL('users', updateData, 'user_id = ?');
      const result = await this.db.run(sql, [...values, id]);

      if (result.changes === 0) {
        throw new NotFoundError('User', id);
      }

      const updatedUser = await this.findById(id);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      return updatedUser;
    } catch (error) {
      handleDatabaseError(error, 'User', id);
    }
  }

  /**
   * Upsert user from Google profile
   * Creates new user if doesn't exist, or updates existing user if found by googleSub or email
   */
  async upsertFromGoogleProfile(profile: GoogleProfile): Promise<User> {
    try {
      // First try to find by Google Sub
      let existingUser = await this.findByGoogleSub(profile.sub);

      if (existingUser) {
        // Update existing user found by Google Sub
        return await this.update(existingUser.userId, {
          email: profile.email,
          name: profile.name,
          pictureUrl: profile.picture,
        });
      }

      // Try to find by email (to handle case where user signed up with email but now using Google)
      existingUser = await this.findByEmail(profile.email);

      if (existingUser) {
        // Attach Google Sub to existing user
        return await this.update(existingUser.userId, {
          googleSub: profile.sub,
          name: profile.name,
          pictureUrl: profile.picture,
        });
      }

      // Create new user
      return await this.create({
        googleSub: profile.sub,
        email: profile.email,
        name: profile.name,
        pictureUrl: profile.picture,
        role: 'shopper', // Default role
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Check if user exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE user_id = ?',
        [id],
      );
      return (result?.count || 0) > 0;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}

// Factory function to create repository instance
export async function createUsersRepository(isTest: boolean = false): Promise<UsersRepository> {
  const db = await getDatabase(isTest);
  return new UsersRepository(db);
}

// Singleton instance for default usage
let usersRepo: UsersRepository | null = null;

export async function getUsersRepository(isTest: boolean = false): Promise<UsersRepository> {
  const isTestEnv = isTest || process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
  if (isTestEnv) {
    return createUsersRepository(true);
  }
  if (!usersRepo) {
    usersRepo = await createUsersRepository(false);
  }
  return usersRepo;
}