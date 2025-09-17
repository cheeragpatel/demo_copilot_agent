import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Product interface (matching existing structure)
interface Product {
  productId: number;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  unit: string;
  imgName: string;
  discount?: number;
}

// Cart item interface
export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  shippingCost: number;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
}

// Cart context interface
interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => void;
  removeCoupon: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

// Cart calculations helper
const calculateCartTotals = (items: CartItem[], couponDiscount: number, shippingCost: number): Omit<CartState, 'items' | 'couponCode'> => {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const itemDiscount = items.reduce((sum, item) => sum + ((item.discount || 0) * item.quantity), 0);
  const totalDiscount = itemDiscount + couponDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscount + shippingCost);

  return {
    subtotal,
    totalDiscount,
    couponDiscount,
    shippingCost,
    grandTotal,
  };
};

// Cart storage helpers
const CART_STORAGE_KEY = 'octocat-cart';

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsedCart = JSON.parse(stored);
      // Recalculate totals in case of any changes in logic
      const totals = calculateCartTotals(parsedCart.items || [], parsedCart.couponDiscount || 0, parsedCart.shippingCost || 0);
      return {
        items: parsedCart.items || [],
        couponCode: parsedCart.couponCode,
        ...totals,
      };
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
  }
  
  return {
    items: [],
    couponCode: undefined,
    couponDiscount: 0,
    shippingCost: 5.99, // Default shipping cost
    subtotal: 0,
    totalDiscount: 0,
    grandTotal: 0,
  };
};

const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(loadCartFromStorage);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(item => item.productId === product.productId);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = currentCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.productId,
          product,
          quantity,
          unitPrice: product.price,
          discount: product.discount,
        };
        newItems = [...currentCart.items, newItem];
      }

      const totals = calculateCartTotals(newItems, currentCart.couponDiscount, currentCart.shippingCost);
      return {
        ...currentCart,
        items: newItems,
        ...totals,
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(item => item.productId !== productId);
      const totals = calculateCartTotals(newItems, currentCart.couponDiscount, currentCart.shippingCost);
      return {
        ...currentCart,
        items: newItems,
        ...totals,
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(currentCart => {
      const newItems = currentCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const totals = calculateCartTotals(newItems, currentCart.couponDiscount, currentCart.shippingCost);
      return {
        ...currentCart,
        items: newItems,
        ...totals,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      couponCode: undefined,
      couponDiscount: 0,
      shippingCost: 5.99,
      subtotal: 0,
      totalDiscount: 0,
      grandTotal: 5.99,
    });
  };

  const applyCoupon = (couponCode: string) => {
    // Simple coupon logic - in a real app, this would validate with the backend
    let discount = 0;
    switch (couponCode.toUpperCase()) {
      case 'SAVE10':
        discount = cart.subtotal * 0.1; // 10% off
        break;
      case 'SAVE20':
        discount = cart.subtotal * 0.2; // 20% off
        break;
      case 'FREESHIP':
        discount = 0; // This would set shipping to 0 instead
        break;
      default:
        return; // Invalid coupon
    }

    setCart(currentCart => {
      const newShippingCost = couponCode.toUpperCase() === 'FREESHIP' ? 0 : currentCart.shippingCost;
      const totals = calculateCartTotals(currentCart.items, discount, newShippingCost);
      return {
        ...currentCart,
        couponCode,
        ...totals,
      };
    });
  };

  const removeCoupon = () => {
    setCart(currentCart => {
      const totals = calculateCartTotals(currentCart.items, 0, 5.99); // Reset shipping to default
      return {
        ...currentCart,
        couponCode: undefined,
        ...totals,
      };
    });
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
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