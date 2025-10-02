import { describe, it, expect } from 'vitest';
import {
  SelectQueryBuilder,
  toSnakeCase,
  toCamelCase,
  objectToSnakeCase,
  objectToCamelCase,
  generatePlaceholders,
  buildInsertSQL,
  buildUpdateSQL,
  validateRequiredFields,
} from './sql';

describe('SQL Utilities', () => {
  describe('SelectQueryBuilder', () => {
    it('should build a simple SELECT query', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.build();
      expect(sql).toBe('SELECT * FROM products');
    });

    it('should build SELECT query with specific columns', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.select(['id', 'name', 'price']).build();
      expect(sql).toBe('SELECT id, name, price FROM products');
    });

    it('should build SELECT query with WHERE clause', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.where('price > 100').build();
      expect(sql).toBe('SELECT * FROM products WHERE price > 100');
    });

    it('should build SELECT query with multiple WHERE conditions', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.where('price > 100').where('category = "electronics"').build();
      expect(sql).toBe('SELECT * FROM products WHERE price > 100 AND category = "electronics"');
    });

    it('should build SELECT query with ORDER BY', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.orderBy('name', 'ASC').build();
      expect(sql).toBe('SELECT * FROM products ORDER BY name ASC');
    });

    it('should build SELECT query with multiple ORDER BY clauses', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.orderBy('price', 'DESC').orderBy('name', 'ASC').build();
      expect(sql).toBe('SELECT * FROM products ORDER BY price DESC, name ASC');
    });

    it('should build SELECT query with INNER JOIN', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.join('suppliers', 'products.supplier_id = suppliers.id', 'INNER').build();
      expect(sql).toBe(
        'SELECT * FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.id',
      );
    });

    it('should build SELECT query with LEFT JOIN', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.join('suppliers', 'products.supplier_id = suppliers.id', 'LEFT').build();
      expect(sql).toBe(
        'SELECT * FROM products LEFT JOIN suppliers ON products.supplier_id = suppliers.id',
      );
    });

    it('should build SELECT query with LIMIT', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.limit(10).build();
      expect(sql).toBe('SELECT * FROM products LIMIT 10');
    });

    it('should build SELECT query with OFFSET', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.offset(20).build();
      expect(sql).toBe('SELECT * FROM products OFFSET 20');
    });

    it('should build SELECT query with LIMIT and OFFSET', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder.limit(10).offset(20).build();
      expect(sql).toBe('SELECT * FROM products LIMIT 10 OFFSET 20');
    });

    it('should build complex SELECT query with all clauses', () => {
      const builder = new SelectQueryBuilder('products');
      const sql = builder
        .select(['id', 'name', 'price'])
        .join('suppliers', 'products.supplier_id = suppliers.id', 'INNER')
        .where('price > 100')
        .where('category = "electronics"')
        .orderBy('price', 'DESC')
        .orderBy('name', 'ASC')
        .limit(10)
        .offset(20)
        .build();

      expect(sql).toBe(
        'SELECT id, name, price FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.id WHERE price > 100 AND category = "electronics" ORDER BY price DESC, name ASC LIMIT 10 OFFSET 20',
      );
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('productId')).toBe('product_id');
      expect(toSnakeCase('supplierId')).toBe('supplier_id');
      expect(toSnakeCase('orderDate')).toBe('order_date');
    });

    it('should handle strings that are already lowercase', () => {
      expect(toSnakeCase('product')).toBe('product');
    });

    it('should handle multiple uppercase letters', () => {
      expect(toSnakeCase('productIDValue')).toBe('product_i_d_value');
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('product_id')).toBe('productId');
      expect(toCamelCase('supplier_id')).toBe('supplierId');
      expect(toCamelCase('order_date')).toBe('orderDate');
    });

    it('should handle strings without underscores', () => {
      expect(toCamelCase('product')).toBe('product');
    });
  });

  describe('objectToSnakeCase', () => {
    it('should convert object keys from camelCase to snake_case', () => {
      const input = {
        productId: 1,
        supplierId: 2,
        orderDate: '2024-01-15',
      };
      const output = objectToSnakeCase(input);
      expect(output).toEqual({
        product_id: 1,
        supplier_id: 2,
        order_date: '2024-01-15',
      });
    });

    it('should preserve values', () => {
      const input = { productName: 'Test Product', price: 99.99 };
      const output = objectToSnakeCase(input);
      expect(output.product_name).toBe('Test Product');
      expect(output.price).toBe(99.99);
    });
  });

  describe('objectToCamelCase', () => {
    it('should convert object keys from snake_case to camelCase', () => {
      const input = {
        product_id: 1,
        supplier_id: 2,
        order_date: '2024-01-15',
      };
      const output = objectToCamelCase(input);
      expect(output).toEqual({
        productId: 1,
        supplierId: 2,
        orderDate: '2024-01-15',
      });
    });

    it('should preserve values', () => {
      const input = { product_name: 'Test Product', price: 99.99 };
      const output = objectToCamelCase(input);
      expect(output.productName).toBe('Test Product');
      expect(output.price).toBe(99.99);
    });
  });

  describe('generatePlaceholders', () => {
    it('should generate placeholders for parameterized queries', () => {
      expect(generatePlaceholders(1)).toBe('?');
      expect(generatePlaceholders(3)).toBe('?, ?, ?');
      expect(generatePlaceholders(5)).toBe('?, ?, ?, ?, ?');
    });

    it('should handle zero placeholders', () => {
      expect(generatePlaceholders(0)).toBe('');
    });
  });

  describe('buildInsertSQL', () => {
    it('should build INSERT SQL with placeholders', () => {
      const data = {
        productId: 1,
        supplierId: 2,
        name: 'Test Product',
        price: 99.99,
      };
      const result = buildInsertSQL('products', data);

      expect(result.sql).toBe(
        'INSERT INTO products (product_id, supplier_id, name, price) VALUES (?, ?, ?, ?)',
      );
      expect(result.values).toEqual([1, 2, 'Test Product', 99.99]);
    });

    it('should handle single column insert', () => {
      const data = { name: 'Test' };
      const result = buildInsertSQL('categories', data);

      expect(result.sql).toBe('INSERT INTO categories (name) VALUES (?)');
      expect(result.values).toEqual(['Test']);
    });
  });

  describe('buildUpdateSQL', () => {
    it('should build UPDATE SQL with placeholders', () => {
      const data = {
        name: 'Updated Product',
        price: 129.99,
      };
      const result = buildUpdateSQL('products', data, 'product_id = ?');

      expect(result.sql).toBe('UPDATE products SET name = ?, price = ? WHERE product_id = ?');
      expect(result.values).toEqual(['Updated Product', 129.99]);
    });

    it('should handle single column update', () => {
      const data = { status: 'active' };
      const result = buildUpdateSQL('products', data, 'id = 1');

      expect(result.sql).toBe('UPDATE products SET status = ? WHERE id = 1');
      expect(result.values).toEqual(['active']);
    });
  });

  describe('validateRequiredFields', () => {
    it('should not throw for objects with all required fields', () => {
      const obj = { name: 'Test', email: 'test@test.com', age: 25 };
      expect(() => validateRequiredFields(obj, ['name', 'email'])).not.toThrow();
    });

    it('should throw for missing required field', () => {
      const obj = { name: 'Test' };
      expect(() => validateRequiredFields(obj, ['name', 'email'])).toThrow(
        "Required field 'email' is missing or empty",
      );
    });

    it('should throw for null required field', () => {
      const obj = { name: 'Test', email: null };
      expect(() => validateRequiredFields(obj, ['name', 'email'])).toThrow(
        "Required field 'email' is missing or empty",
      );
    });

    it('should throw for empty string required field', () => {
      const obj = { name: 'Test', email: '' };
      expect(() => validateRequiredFields(obj, ['name', 'email'])).toThrow(
        "Required field 'email' is missing or empty",
      );
    });

    it('should throw for undefined required field', () => {
      const obj = { name: 'Test', email: undefined };
      expect(() => validateRequiredFields(obj, ['name', 'email'])).toThrow(
        "Required field 'email' is missing or empty",
      );
    });
  });
});
