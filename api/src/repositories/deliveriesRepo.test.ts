import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DeliveriesRepository } from './deliveriesRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('DeliveriesRepository Additional Methods', () => {
  let repository: DeliveriesRepository;

  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);

    // Seed test data
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [2, 'Another Supplier']);
    
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-20T10:00:00Z', 'Delivery 1', 'pending'],
    );
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [2, 1, '2024-01-21T10:00:00Z', 'Delivery 2', 'in-transit'],
    );
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [3, 2, '2024-01-22T10:00:00Z', 'Delivery 3', 'delivered'],
    );

    repository = new DeliveriesRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findBySupplierId', () => {
    it('should find deliveries by supplier ID', async () => {
      const deliveries = await repository.findBySupplierId(1);
      expect(deliveries).toHaveLength(2);
      // Deliveries are returned in DESC order by date
      expect(deliveries[0].name).toBe('Delivery 2');
      expect(deliveries[1].name).toBe('Delivery 1');
    });

    it('should return empty array for supplier with no deliveries', async () => {
      const deliveries = await repository.findBySupplierId(999);
      expect(deliveries).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing delivery', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing delivery', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
