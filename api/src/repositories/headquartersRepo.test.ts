import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HeadquartersRepository } from './headquartersRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('HeadquartersRepository Additional Methods', () => {
  let repository: HeadquartersRepository;

  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);

    // Seed test data
    await db.run(
      'INSERT INTO headquarters (headquarters_id, name, description) VALUES (?, ?, ?)',
      [1, 'Main Headquarters', 'Primary office location'],
    );
    await db.run(
      'INSERT INTO headquarters (headquarters_id, name, description) VALUES (?, ?, ?)',
      [2, 'Regional HQ', 'Regional office'],
    );

    repository = new HeadquartersRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findByName', () => {
    it('should find headquarters by name partial match', async () => {
      const hqs = await repository.findByName('Main');
      expect(hqs).toHaveLength(1);
      expect(hqs[0].name).toBe('Main Headquarters');
    });

    it('should find multiple matches', async () => {
      const hqs = await repository.findByName('HQ');
      expect(hqs.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array when no matches found', async () => {
      const hqs = await repository.findByName('Nonexistent');
      expect(hqs).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing headquarters', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing headquarters', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
