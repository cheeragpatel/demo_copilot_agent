import { describe, it, expect } from 'vitest';
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
  ConflictError,
  handleDatabaseError,
  errorHandler,
} from './errors';

describe('Error Classes', () => {
  describe('DatabaseError', () => {
    it('should create a database error with default values', () => {
      const error = new DatabaseError('Test error');
      expect(error.name).toBe('DatabaseError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
    });

    it('should create a database error with custom code and status', () => {
      const error = new DatabaseError('Custom error', 'CUSTOM_CODE', 503);
      expect(error.code).toBe('CUSTOM_CODE');
      expect(error.statusCode).toBe(503);
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error for entity with numeric id', () => {
      const error = new NotFoundError('Product', 123);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Product with ID 123 not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });

    it('should create a not found error for entity with string id', () => {
      const error = new NotFoundError('User', 'abc-123');
      expect(error.message).toBe('User with ID abc-123 not found');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error', () => {
      const error = new ValidationError('Invalid input');
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Validation error: Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('ConflictError', () => {
    it('should create a conflict error', () => {
      const error = new ConflictError('Resource already exists');
      expect(error.name).toBe('ConflictError');
      expect(error.message).toBe('Conflict: Resource already exists');
      expect(error.code).toBe('CONFLICT');
      expect(error.statusCode).toBe(409);
    });
  });
});

describe('handleDatabaseError', () => {
  it('should throw ConflictError for UNIQUE constraint violation', () => {
    const sqliteError = {
      code: 'SQLITE_CONSTRAINT',
      message: 'UNIQUE constraint failed: products.sku',
    };

    expect(() => handleDatabaseError(sqliteError)).toThrow(ConflictError);
    expect(() => handleDatabaseError(sqliteError)).toThrow('Resource already exists');
  });

  it('should throw ValidationError for FOREIGN KEY constraint violation', () => {
    const sqliteError = {
      code: 'SQLITE_CONSTRAINT',
      message: 'FOREIGN KEY constraint failed',
    };

    expect(() => handleDatabaseError(sqliteError)).toThrow(ValidationError);
    expect(() => handleDatabaseError(sqliteError)).toThrow('Invalid reference to related entity');
  });

  it('should throw ValidationError for other constraint violations', () => {
    const sqliteError = {
      code: 'SQLITE_CONSTRAINT',
      message: 'CHECK constraint failed',
    };

    expect(() => handleDatabaseError(sqliteError)).toThrow(ValidationError);
  });

  it('should throw DatabaseError for SQLITE_BUSY', () => {
    const sqliteError = {
      code: 'SQLITE_BUSY',
      message: 'database is locked',
    };

    expect(() => handleDatabaseError(sqliteError)).toThrow(DatabaseError);
    expect(() => handleDatabaseError(sqliteError)).toThrow('Database is temporarily unavailable');
  });

  it('should rethrow DatabaseError instances', () => {
    const dbError = new NotFoundError('Product', 123);
    expect(() => handleDatabaseError(dbError)).toThrow(NotFoundError);
  });

  it('should throw NotFoundError when no rows affected with entity and id', () => {
    const error = {
      message: 'No rows affected',
    };

    expect(() => handleDatabaseError(error, 'Product', 123)).toThrow(NotFoundError);
    expect(() => handleDatabaseError(error, 'Product', 123)).toThrow(
      'Product with ID 123 not found',
    );
  });

  it('should throw generic DatabaseError for unknown errors', () => {
    const error = {
      message: 'Unknown database error',
    };

    expect(() => handleDatabaseError(error)).toThrow(DatabaseError);
    expect(() => handleDatabaseError(error)).toThrow('Database operation failed');
  });
});

describe('errorHandler middleware', () => {
  it('should handle DatabaseError and return appropriate status code', () => {
    const error = new NotFoundError('Product', 123);
    const req = {};
    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(404);
          expect(data.error.code).toBe('NOT_FOUND');
          expect(data.error.message).toBe('Product with ID 123 not found');
          return res;
        },
      }),
    };
    const next = () => {};

    errorHandler(error, req, res, next);
  });

  it('should handle non-DatabaseError and return 500', () => {
    const error = new Error('Unexpected error');
    const req = {};
    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          expect(code).toBe(500);
          expect(data.error.code).toBe('INTERNAL_ERROR');
          expect(data.error.message).toBe('An unexpected error occurred');
          return res;
        },
      }),
    };
    const next = () => {};

    errorHandler(error, req, res, next);
  });
});
