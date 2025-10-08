import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrdersRepository } from './ordersRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('OrdersRepository Additional Methods', () => {
  let repository: OrdersRepository;

  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);

    // Seed test data
    await db.run('INSERT INTO headquarters (headquarters_id, name) VALUES (?, ?)', [1, 'HQ One']);
    await db.run('INSERT INTO branches (branch_id, headquarters_id, name) VALUES (?, ?, ?)', [
      1,
      1,
      'Main Branch',
    ]);
    await db.run('INSERT INTO branches (branch_id, headquarters_id, name) VALUES (?, ?, ?)', [
      2,
      1,
      'East Branch',
    ]);
    
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-15T10:00:00Z', 'Order 1', 'pending'],
    );
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [2, 1, '2024-01-16T10:00:00Z', 'Order 2', 'processing'],
    );
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [3, 2, '2024-01-17T10:00:00Z', 'Order 3', 'shipped'],
    );

    repository = new OrdersRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findByBranchId', () => {
    it('should find orders by branch ID', async () => {
      const orders = await repository.findByBranchId(1);
      expect(orders).toHaveLength(2);
      // Orders are returned in DESC order by date
      expect(orders[0].name).toBe('Order 2');
      expect(orders[1].name).toBe('Order 1');
    });

    it('should return empty array for branch with no orders', async () => {
      const orders = await repository.findByBranchId(999);
      expect(orders).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing order', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing order', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
