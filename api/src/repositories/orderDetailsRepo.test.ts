import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrderDetailsRepository } from './orderDetailsRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('OrderDetailsRepository Additional Methods', () => {
  let repository: OrderDetailsRepository;

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
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-15T10:00:00Z', 'Test Order', 'pending'],
    );
    await db.run(
      'INSERT INTO orders (order_id, branch_id, order_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [2, 1, '2024-01-16T10:00:00Z', 'Test Order 2', 'pending'],
    );
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 'Test Product', 99.99, 'TEST-001', 'each'],
    );
    
    await db.run(
      'INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 1, 10, 99.99, 'Test detail 1'],
    );
    await db.run(
      'INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 1, 1, 5, 99.99, 'Test detail 2'],
    );
    await db.run(
      'INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [3, 2, 1, 3, 99.99, 'Test detail 3'],
    );

    repository = new OrderDetailsRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findByOrderId', () => {
    it('should find order details by order ID', async () => {
      const details = await repository.findByOrderId(1);
      expect(details).toHaveLength(2);
      expect(details[0].orderDetailId).toBe(1);
      expect(details[1].orderDetailId).toBe(2);
    });

    it('should return empty array for order with no details', async () => {
      const details = await repository.findByOrderId(999);
      expect(details).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing order detail', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing order detail', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
