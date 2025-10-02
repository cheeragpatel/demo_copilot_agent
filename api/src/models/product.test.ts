import { describe, it, expect } from 'vitest';
import { Product } from './product';

describe('Product Model', () => {
  it('should define a valid product object with required properties', () => {
    const product: Product = {
      productId: 1,
      supplierId: 1,
      name: 'Test Product',
      description: 'Test description',
      price: 99.99,
      sku: 'TEST-001',
      unit: 'each',
      imgName: 'test.jpg',
    };

    expect(product.productId).toBe(1);
    expect(product.supplierId).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(99.99);
  });

  it('should define a product with optional discount', () => {
    const product: Product = {
      productId: 1,
      supplierId: 1,
      name: 'Discounted Product',
      description: 'Product with discount',
      price: 99.99,
      sku: 'DISC-001',
      unit: 'each',
      imgName: 'discount.jpg',
      discount: 0.15,
    };

    expect(product.discount).toBe(0.15);
  });

  it('should allow product without discount', () => {
    const product: Product = {
      productId: 1,
      supplierId: 1,
      name: 'No Discount Product',
      description: 'Product without discount',
      price: 99.99,
      sku: 'NO-DISC-001',
      unit: 'each',
      imgName: 'nodiscount.jpg',
    };

    expect(product.discount).toBeUndefined();
  });
});
