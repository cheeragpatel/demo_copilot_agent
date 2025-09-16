import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CartContextType, CartItem, CartAction, Product } from '../types/cart';
import { debounce } from '../utils/debounce';

const CART_STORAGE_KEY = 'octocat_cart';
const UNDO_TIMEOUT = 5000; // 5 seconds to undo

const CartContext = createContext<CartContextType | undefined>(undefined);

// Utility functions for cart calculations
const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { itemCount, totalPrice };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<CartAction | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculate derived state
  const { itemCount, totalPrice } = calculateTotals(items);
  const canUndo = lastAction !== null;

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((items: CartItem[]) => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }, 300),
    []
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedItems = JSON.parse(savedCart) as CartItem[];
        // Validate and sanitize data
        const validItems = parsedItems.filter(item => 
          item.productId && 
          item.name && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
        setItems(validItems);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    debouncedSave(items);
  }, [items, debouncedSave]);

  // Clear undo timeout after 5 seconds
  useEffect(() => {
    if (lastAction) {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setLastAction(null);
      }, UNDO_TIMEOUT);
    }
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, [lastAction]);

  // Create action for undo functionality
  const createAction = (
    type: CartAction['type'], 
    productId?: number, 
    quantity?: number, 
    previousState?: CartItem[]
  ): CartAction => ({
    type,
    productId,
    quantity,
    previousState,
    timestamp: Date.now()
  });

  const addItem = useCallback(async (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    
    setIsLoading(true);
    
    try {
      // Optimistic update
      const previousItems = [...items];
      const existingItemIndex = items.findIndex(item => item.productId === product.productId);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          lastModified: Date.now()
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity,
          imgName: product.imgName,
          timestamp: Date.now(),
          lastModified: Date.now()
        };
        newItems = [...items, newItem];
      }
      
      setItems(newItems);
      setLastAction(createAction('add', product.productId, quantity, previousItems));
      
      // Simulate API call delay for demo
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Rollback optimistic update
      setItems(items);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const removeItem = useCallback(async (productId: number) => {
    setIsLoading(true);
    
    try {
      const previousItems = [...items];
      const newItems = items.filter(item => item.productId !== productId);
      
      setItems(newItems);
      setLastAction(createAction('remove', productId, undefined, previousItems));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      setItems(items);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity < 0) return;
    
    setIsLoading(true);
    
    try {
      const previousItems = [...items];
      
      if (quantity === 0) {
        await removeItem(productId);
        return;
      }
      
      const newItems = items.map(item =>
        item.productId === productId
          ? { ...item, quantity, lastModified: Date.now() }
          : item
      );
      
      setItems(newItems);
      setLastAction(createAction('update', productId, quantity, previousItems));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      setItems(items);
    } finally {
      setIsLoading(false);
    }
  }, [items, removeItem]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const previousItems = [...items];
      setItems([]);
      setLastAction(createAction('clear', undefined, undefined, previousItems));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setItems(items);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const undo = useCallback(async () => {
    if (!lastAction || !lastAction.previousState) return;
    
    setIsLoading(true);
    
    try {
      setItems(lastAction.previousState);
      setLastAction(null);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to undo action:', error);
    } finally {
      setIsLoading(false);
    }
  }, [lastAction]);

  const getItem = useCallback((productId: number) => {
    return items.find(item => item.productId === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = getItem(productId);
    return item ? item.quantity : 0;
  }, [getItem]);

  const value: CartContextType = {
    // State
    items,
    itemCount,
    totalPrice,
    isLoading,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    
    // Undo functionality
    canUndo,
    undo,
    
    // Quick access
    getItem,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}