import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { runMigrations } from './migrate';
import { closeDatabase, getDatabase } from './sqlite';

describe('Database Migrations', () => {
  beforeEach(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('runMigrations', () => {
    it('should run migrations successfully on in-memory database', async () => {
      await runMigrations(true);
      const db = await getDatabase(true);
      
      // Check that tables were created
      const tables = await db.all<any>(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      );
      const tableNames = tables.map((t) => t.name);
      
      expect(tableNames).toContain('suppliers');
      expect(tableNames).toContain('products');
      expect(tableNames).toContain('headquarters');
      expect(tableNames).toContain('branches');
      expect(tableNames).toContain('orders');
      expect(tableNames).toContain('order_details');
      expect(tableNames).toContain('deliveries');
      expect(tableNames).toContain('order_detail_deliveries');
      expect(tableNames).toContain('migrations');
    });

    it('should not rerun already applied migrations', async () => {
      // First run
      await runMigrations(true);
      const db = await getDatabase(true);
      const migrations1 = await db.all<any>('SELECT * FROM migrations ORDER BY version');
      
      // Second run (should be idempotent)
      await runMigrations(true);
      const migrations2 = await db.all<any>('SELECT * FROM migrations ORDER BY version');
      
      // Should have the same number of migrations
      expect(migrations1.length).toBe(migrations2.length);
      expect(migrations1.length).toBeGreaterThan(0);
    });

    it('should track migrations in migrations table', async () => {
      await runMigrations(true);
      const db = await getDatabase(true);
      
      const migrations = await db.all<any>('SELECT * FROM migrations ORDER BY version');
      expect(migrations.length).toBeGreaterThan(0);
      expect(migrations[0]).toHaveProperty('version');
      expect(migrations[0]).toHaveProperty('filename');
      expect(migrations[0]).toHaveProperty('applied_at');
    });
  });
});
