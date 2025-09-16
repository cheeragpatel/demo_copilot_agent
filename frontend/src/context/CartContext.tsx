import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: { productId: number; name: string; price: number; imgName: string }, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'octocat-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Calculate derived values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 25 : 0;
  const total = subtotal + shipping;

  const addItem = (product: { productId: number; name: string; price: number; imgName: string }, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, {
          ...product,
          quantity: Math.min(99, quantity)
        }];
      }
    });
  };

  const removeItem = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(99, Math.max(1, quantity)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    totalItems,
    subtotal,
    shipping,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}