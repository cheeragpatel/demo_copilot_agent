import React, { createContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { CartState, Product } from '../types/cart';
import { cartReducer, initialCartState } from '../utils/cartReducer';

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'octocat-cart';
const PERSISTENCE_DELAY = 150; // 150ms debounce

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Load initial state from localStorage
  const loadCartFromStorage = (): CartState => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsedCart = JSON.parse(stored);
        // Validate the structure and recalculate derived values
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // Use reducer to recalculate all derived values
          let tempState = initialCartState;
          for (const item of parsedCart.items) {
            tempState = cartReducer(tempState, { 
              type: 'ADD_ITEM', 
              payload: { product: item.product, quantity: item.quantity }
            });
          }
          return tempState;
        }
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
    }
    return initialCartState;
  };

  const [state, dispatch] = useReducer(cartReducer, null, loadCartFromStorage);
  const persistenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced persistence to localStorage
  const persistCart = useCallback((cartState: CartState) => {
    if (persistenceTimeoutRef.current) {
      clearTimeout(persistenceTimeoutRef.current);
    }
    persistenceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    }, PERSISTENCE_DELAY);
  }, []);

  // Persist cart state changes
  useEffect(() => {
    persistCart(state);
  }, [state, persistCart]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (persistenceTimeoutRef.current) {
        clearTimeout(persistenceTimeoutRef.current);
      }
    };
  }, []);

  const addItem = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}