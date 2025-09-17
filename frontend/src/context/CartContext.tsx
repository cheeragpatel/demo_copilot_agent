import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Cart item interface matching the specification
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  description: string;
  sku: string;
  unit: string;
}

// Product interface for adding items to cart
export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

// Context type interface as specified in the issue
export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  finalTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

// localStorage key with versioning
const CART_STORAGE_KEY = 'octocat-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  // Add item to cart with optimistic updates
  const addItem = (product: Product, quantity: number) => {
    if (quantity <= 0) return;

    setIsLoading(true);
    
    // Simulate brief loading for smooth UX
    setTimeout(() => {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.productId === product.productId);
        
        if (existingItem) {
          // Update quantity of existing item
          return currentItems.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product.productId,
            name: product.name,
            price: product.price,
            quantity,
            imgName: product.imgName,
            description: product.description,
            sku: product.sku,
            unit: product.unit,
          };
          return [...currentItems, newItem];
        }
      });
      setIsLoading(false);
    }, 150); // Brief delay for smooth UX
  };

  // Remove item completely from cart
  const removeItem = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.productId !== productId));
  };

  // Update quantity of specific item
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Shipping logic: $25 fee, free for orders over $150
  const shippingCost = totalPrice > 150 ? 0 : (totalPrice > 0 ? 25 : 0);
  const finalTotal = totalPrice + shippingCost;

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    shippingCost,
    finalTotal,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}