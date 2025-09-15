import { cartReducer, initialCartState } from '../utils/cartReducer';
import { Product } from '../types/cart';

// Mock product for testing
const mockProduct: Product = {
  productId: 1,
  name: 'Test Product',
  description: 'A test product',
  price: 100,
  imgName: 'test.jpg',
  sku: 'TEST-001',
  unit: 'each',
  supplierId: 1,
  discount: 0.1, // 10% discount
};

describe('cartReducer', () => {
  it('should return initial state', () => {
    expect(initialCartState).toEqual({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    });
  });

  it('should add item to empty cart', () => {
    const action = {
      type: 'ADD_ITEM' as const,
      payload: { product: mockProduct, quantity: 2 },
    };
    
    const newState = cartReducer(initialCartState, action);
    
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].product).toEqual(mockProduct);
    expect(newState.items[0].quantity).toBe(2);
    expect(newState.itemCount).toBe(2);
    expect(newState.subtotal).toBe(180); // $100 * 0.9 * 2 = $180 (with 10% discount)
  });

  it('should update quantity of existing item', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 1 },
    });
    
    const action = {
      type: 'ADD_ITEM' as const,
      payload: { product: mockProduct, quantity: 2 },
    };
    
    const newState = cartReducer(stateWithItem, action);
    
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].quantity).toBe(3);
    expect(newState.itemCount).toBe(3);
  });

  it('should remove item from cart', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 2 },
    });
    
    const action = {
      type: 'REMOVE_ITEM' as const,
      payload: { productId: mockProduct.productId },
    };
    
    const newState = cartReducer(stateWithItem, action);
    
    expect(newState.items).toHaveLength(0);
    expect(newState.itemCount).toBe(0);
    expect(newState.subtotal).toBe(0);
  });

  it('should update item quantity', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 2 },
    });
    
    const action = {
      type: 'UPDATE_QUANTITY' as const,
      payload: { productId: mockProduct.productId, quantity: 5 },
    };
    
    const newState = cartReducer(stateWithItem, action);
    
    expect(newState.items[0].quantity).toBe(5);
    expect(newState.itemCount).toBe(5);
  });

  it('should remove item when quantity updated to 0', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 2 },
    });
    
    const action = {
      type: 'UPDATE_QUANTITY' as const,
      payload: { productId: mockProduct.productId, quantity: 0 },
    };
    
    const newState = cartReducer(stateWithItem, action);
    
    expect(newState.items).toHaveLength(0);
    expect(newState.itemCount).toBe(0);
  });

  it('should calculate shipping correctly', () => {
    // Test with subtotal under $100 (should have $10 shipping)
    const lowValueState = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: { ...mockProduct, price: 50, discount: 0 }, quantity: 1 },
    });
    
    expect(lowValueState.shipping).toBe(10);
    expect(lowValueState.total).toBe(64); // $50 + $10 shipping + $4 tax
    
    // Test with subtotal over $100 (should have free shipping)
    const highValueState = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: { ...mockProduct, price: 120, discount: 0 }, quantity: 1 },
    });
    
    expect(highValueState.shipping).toBe(0);
    expect(highValueState.total).toBe(129.6); // $120 + $0 shipping + $9.60 tax
  });

  it('should clear cart', () => {
    const stateWithItems = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 3 },
    });
    
    const action = { type: 'CLEAR_CART' as const };
    const newState = cartReducer(stateWithItems, action);
    
    expect(newState.items).toHaveLength(0);
    expect(newState.itemCount).toBe(0);
    expect(newState.subtotal).toBe(0);
    expect(newState.tax).toBe(0);
    expect(newState.shipping).toBe(10); // Shipping still applies to empty cart
    expect(newState.total).toBe(10); // Only shipping cost
  });
});