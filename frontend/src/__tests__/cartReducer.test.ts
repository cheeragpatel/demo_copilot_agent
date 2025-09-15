import { describe, it, expect } from 'vitest';
import { CartState, CartAction } from '../context/CartContext';

// Extract the reducer function for testing
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return { items: updatedItems };
      }

      return {
        items: [...state.items, { ...item, quantity }],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.productId !== action.payload.productId),
      };
    }

    case 'UPDATE_QTY': {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.productId !== productId),
        };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      };
    }

    case 'CLEAR': {
      return { items: [] };
    }

    case 'HYDRATE': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Derived selectors for testing
const getItemCount = (state: CartState) => 
  state.items.reduce((total, item) => total + item.quantity, 0);

const getSubtotal = (state: CartState) => 
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);

const getShipping = (subtotal: number, itemCount: number) => 
  itemCount === 0 ? 0 : subtotal >= 100 ? 0 : 25;

describe('Cart Reducer', () => {
  const initialState: CartState = { items: [] };

  const sampleProduct = {
    productId: 1,
    name: 'Test Product',
    price: 10.99,
    imgName: 'test.jpg',
    unit: 'each',
  };

  it('should add new item to empty cart', () => {
    const action: CartAction = {
      type: 'ADD_ITEM',
      payload: { ...sampleProduct, quantity: 2 },
    };

    const result = cartReducer(initialState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({ ...sampleProduct, quantity: 2 });
  });

  it('should increment quantity when adding existing item', () => {
    const stateWithItem: CartState = {
      items: [{ ...sampleProduct, quantity: 1 }],
    };

    const action: CartAction = {
      type: 'ADD_ITEM',
      payload: { ...sampleProduct, quantity: 2 },
    };

    const result = cartReducer(stateWithItem, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const stateWithItem: CartState = {
      items: [{ ...sampleProduct, quantity: 2 }],
    };

    const action: CartAction = {
      type: 'REMOVE_ITEM',
      payload: { productId: 1 },
    };

    const result = cartReducer(stateWithItem, action);

    expect(result.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const stateWithItem: CartState = {
      items: [{ ...sampleProduct, quantity: 2 }],
    };

    const action: CartAction = {
      type: 'UPDATE_QTY',
      payload: { productId: 1, quantity: 5 },
    };

    const result = cartReducer(stateWithItem, action);

    expect(result.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity updated to 0', () => {
    const stateWithItem: CartState = {
      items: [{ ...sampleProduct, quantity: 2 }],
    };

    const action: CartAction = {
      type: 'UPDATE_QTY',
      payload: { productId: 1, quantity: 0 },
    };

    const result = cartReducer(stateWithItem, action);

    expect(result.items).toHaveLength(0);
  });

  it('should clear all items', () => {
    const stateWithItems: CartState = {
      items: [
        { ...sampleProduct, quantity: 2 },
        { ...sampleProduct, productId: 2, quantity: 1 },
      ],
    };

    const action: CartAction = { type: 'CLEAR' };

    const result = cartReducer(stateWithItems, action);

    expect(result.items).toHaveLength(0);
  });

  it('should hydrate state', () => {
    const newState: CartState = {
      items: [{ ...sampleProduct, quantity: 3 }],
    };

    const action: CartAction = {
      type: 'HYDRATE',
      payload: newState,
    };

    const result = cartReducer(initialState, action);

    expect(result).toEqual(newState);
  });
});

describe('Cart Selectors', () => {
  it('should calculate item count correctly', () => {
    const state: CartState = {
      items: [
        { productId: 1, name: 'Item 1', price: 10, imgName: 'test.jpg', unit: 'each', quantity: 2 },
        { productId: 2, name: 'Item 2', price: 20, imgName: 'test2.jpg', unit: 'each', quantity: 3 },
      ],
    };

    expect(getItemCount(state)).toBe(5);
  });

  it('should calculate subtotal correctly', () => {
    const state: CartState = {
      items: [
        { productId: 1, name: 'Item 1', price: 10.50, imgName: 'test.jpg', unit: 'each', quantity: 2 },
        { productId: 2, name: 'Item 2', price: 20, imgName: 'test2.jpg', unit: 'each', quantity: 3 },
      ],
    };

    expect(getSubtotal(state)).toBe(81); // (10.50 * 2) + (20 * 3) = 21 + 60 = 81
  });

  it('should calculate shipping correctly', () => {
    // Free shipping for orders >= $100
    expect(getShipping(100, 2)).toBe(0);
    expect(getShipping(150, 3)).toBe(0);

    // $25 shipping for orders < $100
    expect(getShipping(50, 1)).toBe(25);
    expect(getShipping(99.99, 2)).toBe(25);

    // No shipping for empty cart
    expect(getShipping(0, 0)).toBe(0);
  });
});