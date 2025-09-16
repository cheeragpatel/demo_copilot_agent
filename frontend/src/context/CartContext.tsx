import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  addedAt: string;
  originalPrice?: number;
  discount?: number;
  sku?: string;
  unit?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  isOpen: boolean;
  lastUpdated: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'SAVE_FOR_LATER'; payload: { productId: number } }
  | { type: 'MOVE_TO_CART'; payload: { productId: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_SAVED' }
  | { type: 'BULK_UPDATE'; payload: { updates: { productId: number; quantity: number }[] } }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'OPEN_PANEL' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'addedAt'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  clearCart: () => void;
  clearSaved: () => void;
  bulkUpdate: (updates: { productId: number; quantity: number }[]) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  getCartSummary: () => CartSummary;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
  isInSaved: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'octocat-cart';
const TAX_RATE = 0.08; // 8% tax
const SHIPPING_THRESHOLD = 50; // Free shipping over $50
const SHIPPING_COST = 5.99;

const initialState: CartState = {
  items: [],
  savedForLater: [],
  isOpen: false,
  lastUpdated: new Date().toISOString(),
};

function cartReducer(state: CartState, action: CartAction): CartState {
  const newState = { ...state, lastUpdated: new Date().toISOString() };

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = newState.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        newState.items = newState.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newState.items = [
          ...newState.items,
          { ...action.payload, addedAt: new Date().toISOString() }
        ];
      }
      return newState;
    }

    case 'REMOVE_ITEM': {
      newState.items = newState.items.filter(item => item.productId !== action.payload.productId);
      return newState;
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        newState.items = newState.items.filter(item => item.productId !== action.payload.productId);
      } else {
        newState.items = newState.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      return newState;
    }

    case 'SAVE_FOR_LATER': {
      const item = newState.items.find(item => item.productId === action.payload.productId);
      if (item) {
        newState.items = newState.items.filter(item => item.productId !== action.payload.productId);
        newState.savedForLater = [...newState.savedForLater, item];
      }
      return newState;
    }

    case 'MOVE_TO_CART': {
      const item = newState.savedForLater.find(item => item.productId === action.payload.productId);
      if (item) {
        newState.savedForLater = newState.savedForLater.filter(item => item.productId !== action.payload.productId);
        const existingItem = newState.items.find(cartItem => cartItem.productId === item.productId);
        
        if (existingItem) {
          newState.items = newState.items.map(cartItem =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
        } else {
          newState.items = [...newState.items, { ...item, addedAt: new Date().toISOString() }];
        }
      }
      return newState;
    }

    case 'CLEAR_CART': {
      newState.items = [];
      return newState;
    }

    case 'CLEAR_SAVED': {
      newState.savedForLater = [];
      return newState;
    }

    case 'BULK_UPDATE': {
      action.payload.updates.forEach(update => {
        if (update.quantity <= 0) {
          newState.items = newState.items.filter(item => item.productId !== update.productId);
        } else {
          newState.items = newState.items.map(item =>
            item.productId === update.productId
              ? { ...item, quantity: update.quantity }
              : item
          );
        }
      });
      return newState;
    }

    case 'TOGGLE_PANEL': {
      newState.isOpen = !newState.isOpen;
      return newState;
    }

    case 'OPEN_PANEL': {
      newState.isOpen = true;
      return newState;
    }

    case 'CLOSE_PANEL': {
      newState.isOpen = false;
      return newState;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state]);

  const addItem = (item: Omit<CartItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const saveForLater = (productId: number) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: { productId } });
  };

  const moveToCart = (productId: number) => {
    dispatch({ type: 'MOVE_TO_CART', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearSaved = () => {
    dispatch({ type: 'CLEAR_SAVED' });
  };

  const bulkUpdate = (updates: { productId: number; quantity: number }[]) => {
    dispatch({ type: 'BULK_UPDATE', payload: { updates } });
  };

  const togglePanel = () => {
    dispatch({ type: 'TOGGLE_PANEL' });
  };

  const openPanel = () => {
    dispatch({ type: 'OPEN_PANEL' });
  };

  const closePanel = () => {
    dispatch({ type: 'CLOSE_PANEL' });
  };

  const getCartSummary = (): CartSummary => {
    const subtotal = state.items.reduce((sum, item) => {
      const price = item.discount ? item.price * (1 - item.discount) : item.price;
      return sum + (price * item.quantity);
    }, 0);

    const discount = state.items.reduce((sum, item) => {
      if (item.discount) {
        return sum + (item.price * item.discount * item.quantity);
      }
      return sum;
    }, 0);

    const tax = subtotal * TAX_RATE;
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;
    const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
      itemCount,
    };
  };

  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const isInSaved = (productId: number): boolean => {
    return state.savedForLater.some(item => item.productId === productId);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    clearCart,
    clearSaved,
    bulkUpdate,
    togglePanel,
    openPanel,
    closePanel,
    getCartSummary,
    getItemQuantity,
    isInCart,
    isInSaved,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}