import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProductsRepository } from './productsRepo';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';

describe('ProductsRepository Additional Methods', () => {
  let repository: ProductsRepository;

  beforeEach(async () => {
    // Ensure a fresh in-memory database for each test
    await closeDatabase();
    const db = await getDatabase(true);
    await runMigrations(true);

    // Seed test data
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [1, 'Test Supplier']);
    await db.run('INSERT INTO suppliers (supplier_id, name) VALUES (?, ?)', [2, 'Another Supplier']);
    
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, 'Laptop Computer', 1299.99, 'LAP-001', 'each'],
    );
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 1, 'Wireless Mouse', 29.99, 'MOU-001', 'each'],
    );
    await db.run(
      'INSERT INTO products (product_id, supplier_id, name, price, sku, unit) VALUES (?, ?, ?, ?, ?, ?)',
      [3, 2, 'Keyboard', 79.99, 'KEY-001', 'each'],
    );

    repository = new ProductsRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  describe('findBySupplierId', () => {
    it('should find products by supplier ID', async () => {
      const products = await repository.findBySupplierId(1);
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Laptop Computer');
      expect(products[1].name).toBe('Wireless Mouse');
    });

    it('should return empty array for supplier with no products', async () => {
      const products = await repository.findBySupplierId(999);
      expect(products).toHaveLength(0);
    });
  });

  describe('findByName', () => {
    it('should find products by name partial match', async () => {
      const products = await repository.findByName('Mouse');
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Wireless Mouse');
    });

    it('should be case insensitive', async () => {
      const products = await repository.findByName('laptop');
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Laptop Computer');
    });

    it('should return empty array when no matches found', async () => {
      const products = await repository.findByName('Nonexistent');
      expect(products).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing product', async () => {
      const exists = await repository.exists(1);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing product', async () => {
      const exists = await repository.exists(999);
      expect(exists).toBe(false);
    });
  });
});
