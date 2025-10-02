import { describe, it, expect } from 'vitest';
import { OrderDetail } from './orderDetail';

describe('OrderDetail Model', () => {
  it('should define a valid order detail object with required properties', () => {
    const orderDetail: OrderDetail = {
      orderDetailId: 1,
      orderId: 1,
      productId: 1,
      quantity: 10,
      unitPrice: 99.99,
      notes: 'Standard order',
    };

    expect(orderDetail.orderDetailId).toBe(1);
    expect(orderDetail.orderId).toBe(1);
    expect(orderDetail.productId).toBe(1);
    expect(orderDetail.quantity).toBe(10);
    expect(orderDetail.unitPrice).toBe(99.99);
  });

  it('should accept order detail with notes', () => {
    const orderDetail: OrderDetail = {
      orderDetailId: 2,
      orderId: 1,
      productId: 2,
      quantity: 5,
      unitPrice: 49.99,
      notes: 'Express delivery required',
    };

    expect(orderDetail.notes).toBe('Express delivery required');
  });

  it('should handle different quantities and prices', () => {
    const orderDetail: OrderDetail = {
      orderDetailId: 3,
      orderId: 1,
      productId: 3,
      quantity: 100,
      unitPrice: 1.99,
      notes: 'Bulk order',
    };

    expect(orderDetail.quantity).toBe(100);
    expect(orderDetail.unitPrice).toBe(1.99);
  });
});
