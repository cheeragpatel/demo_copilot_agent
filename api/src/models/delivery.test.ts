import { describe, it, expect } from 'vitest';
import { Delivery } from './delivery';

describe('Delivery Model', () => {
  it('should define a valid delivery object with required properties', () => {
    const delivery: Delivery = {
      deliveryId: 1,
      supplierId: 1,
      deliveryDate: '2024-01-20T10:00:00Z',
      name: 'Monthly Delivery',
      description: 'Monthly supplies delivery',
      status: 'pending',
    };

    expect(delivery.deliveryId).toBe(1);
    expect(delivery.supplierId).toBe(1);
    expect(delivery.deliveryDate).toBe('2024-01-20T10:00:00Z');
    expect(delivery.status).toBe('pending');
  });

  it('should accept different delivery statuses', () => {
    const statuses = ['pending', 'in-transit', 'delivered', 'failed'];

    statuses.forEach((status) => {
      const delivery: Delivery = {
        deliveryId: 1,
        supplierId: 1,
        deliveryDate: '2024-01-20T10:00:00Z',
        name: 'Test Delivery',
        description: 'Test delivery',
        status: status,
      };

      expect(delivery.status).toBe(status);
    });
  });
});
