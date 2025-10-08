import { describe, it, expect } from 'vitest';
import { OrderDetailDelivery } from './orderDetailDelivery';

describe('OrderDetailDelivery Model', () => {
  it('should define a valid order detail delivery object with required properties', () => {
    const orderDetailDelivery: OrderDetailDelivery = {
      orderDetailDeliveryId: 1,
      orderDetailId: 1,
      deliveryId: 1,
      quantity: 5,
      notes: 'First shipment',
    };

    expect(orderDetailDelivery.orderDetailDeliveryId).toBe(1);
    expect(orderDetailDelivery.orderDetailId).toBe(1);
    expect(orderDetailDelivery.deliveryId).toBe(1);
    expect(orderDetailDelivery.quantity).toBe(5);
  });

  it('should accept order detail delivery with notes', () => {
    const orderDetailDelivery: OrderDetailDelivery = {
      orderDetailDeliveryId: 2,
      orderDetailId: 1,
      deliveryId: 2,
      quantity: 3,
      notes: 'Partial shipment - remaining items pending',
    };

    expect(orderDetailDelivery.notes).toBe('Partial shipment - remaining items pending');
  });

  it('should handle different quantities', () => {
    const orderDetailDelivery: OrderDetailDelivery = {
      orderDetailDeliveryId: 3,
      orderDetailId: 2,
      deliveryId: 1,
      quantity: 50,
      notes: 'Bulk delivery',
    };

    expect(orderDetailDelivery.quantity).toBe(50);
  });
});
