import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart, CartItem } from '../context/CartContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock console.error to avoid noise in tests
vi.spyOn(console, 'error').mockImplementation(() => {});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('Cart operations', () => {
    it('should initialize with empty cart', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.getTotalCount()).toBe(0);
      expect(result.current.getTotalAmount()).toBe(0);
    });

    it('should add item to cart', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(testItem);
      expect(result.current.getTotalCount()).toBe(2);
      expect(result.current.getTotalAmount()).toBe(21.98);
    });

    it('should merge duplicate items by increasing quantity', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.addItem({ ...testItem, quantity: 3 });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.getTotalCount()).toBe(5);
    });

    it('should update item quantity', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.getTotalCount()).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalCount()).toBe(0);
    });

    it('should remove item from cart', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.removeItem(1);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalCount()).toBe(0);
    });

    it('should clear entire cart', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem1: CartItem = {
        productId: 1,
        name: 'Test Product 1',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test1.jpg',
      };

      const testItem2: CartItem = {
        productId: 2,
        name: 'Test Product 2',
        quantity: 1,
        unitPrice: 15.50,
        imgName: 'test2.jpg',
      };

      act(() => {
        result.current.addItem(testItem1);
        result.current.addItem(testItem2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalCount()).toBe(0);
      expect(result.current.getTotalAmount()).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should save cart to localStorage when items change', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useCart(), { wrapper });

      const testItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        imgName: 'test.jpg',
      };

      act(() => {
        result.current.addItem(testItem);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'octocat-cart',
        JSON.stringify([testItem])
      );
    });

    it('should load cart from localStorage on initialization', () => {
      const savedCart = [
        {
          productId: 1,
          name: 'Saved Product',
          quantity: 3,
          unitPrice: 20.00,
          imgName: 'saved.jpg',
        },
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));
      
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual(savedCart);
      expect(result.current.getTotalCount()).toBe(3);
      expect(result.current.getTotalAmount()).toBe(60.00);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load cart from localStorage:',
        expect.any(Error)
      );
    });
  });
});