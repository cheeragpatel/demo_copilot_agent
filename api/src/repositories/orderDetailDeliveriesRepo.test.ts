import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrderDetailDeliveriesRepository } from './orderDetailDeliveriesRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('OrderDetailDeliveriesRepository Additional Methods', () => {
  let repository: OrderDetailDeliveriesRepository;

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
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 'Test Product', 99.99, 'TEST-001', 'each'],
    );
    await db.run(
      'INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 1, 10, 99.99, 'Test order detail'],
    );
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [1, 1, '2024-01-20T10:00:00Z', 'Test Delivery', 'pending'],
    );
    await db.run(
      'INSERT INTO deliveries (delivery_id, supplier_id, delivery_date, name, status) VALUES (?, ?, ?, ?, ?)',
      [2, 1, '2024-01-21T10:00:00Z', 'Test Delivery 2', 'pending'],
    );
    
    await db.run(
      'INSERT INTO order_detail_deliveries (order_detail_delivery_id, order_detail_id, delivery_id, quantity, notes) VALUES (?, ?, ?, ?, ?)',
      [1, 1, 1, 5, 'First shipment'],
    );
    await db.run(
      'INSERT INTO order_detail_deliveries (order_detail_delivery_id, order_detail_id, delivery_id, quantity, notes) VALUES (?, ?, ?, ?, ?)',
      [2, 1, 2, 3, 'Second shipment'],
    );

    repository = new OrderDetailDeliveriesRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findByOrderDetailId', () => {
    it('should find order detail deliveries by order detail ID', async () => {
      const deliveries = await repository.findByOrderDetailId(1);
      expect(deliveries).toHaveLength(2);
      expect(deliveries[0].quantity).toBe(5);
      expect(deliveries[1].quantity).toBe(3);
    });

    it('should return empty array for order detail with no deliveries', async () => {
      const deliveries = await repository.findByOrderDetailId(999);
      expect(deliveries).toHaveLength(0);
    });
  });

  describe('findByDeliveryId', () => {
    it('should find order detail deliveries by delivery ID', async () => {
      const deliveries = await repository.findByDeliveryId(1);
      expect(deliveries).toHaveLength(1);
      expect(deliveries[0].quantity).toBe(5);
    });

    it('should return empty array for delivery with no order details', async () => {
      const deliveries = await repository.findByDeliveryId(999);
      expect(deliveries).toHaveLength(0);
    });
  });

  describe('getTotalQuantityByOrderDetailId', () => {
    it('should calculate total quantity for an order detail', async () => {
      const total = await repository.getTotalQuantityByOrderDetailId(1);
      expect(total).toBe(8); // 5 + 3
    });

    it('should return 0 for order detail with no deliveries', async () => {
      const total = await repository.getTotalQuantityByOrderDetailId(999);
      expect(total).toBe(0);
    });
  });
});
