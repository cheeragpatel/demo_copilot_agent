import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  description: string;
  sku: string;
}

interface Product {
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

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  finalTotal: number;
  shippingProgress: number; // percentage toward free shipping
  isAnimating: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const SHIPPING_THRESHOLD = 100; // Free shipping at $100
const SHIPPING_COST = 10; // Standard shipping cost

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('cart');
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Calculate derived values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingProgress = Math.min((totalPrice / SHIPPING_THRESHOLD) * 100, 100);
  const shippingCost = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = totalPrice + shippingCost;

  const addItem = (product: Product, quantity: number) => {
    setIsAnimating(true);
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.productId);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity,
          imgName: product.imgName,
          description: product.description,
          sku: product.sku,
        };
        return [...prevItems, newItem];
      }
    });
    
    // Reset animation state after a brief delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        shippingCost,
        finalTotal,
        shippingProgress,
        isAnimating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}