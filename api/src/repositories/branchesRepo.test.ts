import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BranchesRepository } from './branchesRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('BranchesRepository Additional Methods', () => {
  let repository: BranchesRepository;

  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);

    // Seed test data
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [1, 'HQ One']);
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [2, 'HQ Two']);
    
    await db.run(
      'INSERT INTO branches (branch_id, headquarters_id, name, description) VALUES (?, ?, ?, ?)',
      [1, 1, 'Main Branch', 'Main branch location'],
    );
    await db.run(
      'INSERT INTO branches (branch_id, headquarters_id, name, description) VALUES (?, ?, ?, ?)',
      [2, 1, 'East Branch', 'Eastern district branch'],
    );
    await db.run(
      'INSERT INTO branches (branch_id, headquarters_id, name, description) VALUES (?, ?, ?, ?)',
      [3, 2, 'West Branch', 'Western district branch'],
    );

    repository = new BranchesRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findByHeadquartersId', () => {
    it('should find branches by headquarters ID', async () => {
      const branches = await repository.findByHeadquartersId(1);
      expect(branches).toHaveLength(2);
      expect(branches[0].name).toBe('East Branch');
      expect(branches[1].name).toBe('Main Branch');
    });

    it('should return empty array for headquarters with no branches', async () => {
      const branches = await repository.findByHeadquartersId(999);
      expect(branches).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing branch', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing branch', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
