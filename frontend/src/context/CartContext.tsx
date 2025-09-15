import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
  unit: string;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QTY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartState };

const CART_STORAGE_KEY = 'cart:v1';

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

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'HYDRATE', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state]);

  // Derived values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = itemCount === 0 ? 0 : subtotal >= 100 ? 0 : 25;
  const total = subtotal + shipping;

  const contextValue: CartContextType = {
    state,
    dispatch,
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};