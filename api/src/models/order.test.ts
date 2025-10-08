import { describe, it, expect } from 'vitest';
import { Order } from './order';

describe('Order Model', () => {
  it('should define a valid order object with required properties', () => {
    const order: Order = {
      orderId: 1,
      branchId: 1,
      orderDate: '2024-01-15T10:00:00Z',
      name: 'Monthly Order',
      description: 'Monthly supplies order',
      status: 'pending',
    };

    expect(order.orderId).toBe(1);
    expect(order.branchId).toBe(1);
    expect(order.orderDate).toBe('2024-01-15T10:00:00Z');
    expect(order.status).toBe('pending');
  });

  it('should accept different order statuses', () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    statuses.forEach((status) => {
      const order: Order = {
        orderId: 1,
        branchId: 1,
        orderDate: '2024-01-15T10:00:00Z',
        name: 'Test Order',
        description: 'Test order',
        status: status,
      };

      expect(order.status).toBe(status);
    });
  });
});
