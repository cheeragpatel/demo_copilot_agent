import { CartState, CartAction, CartItem } from '../types/cart';

// Constants for calculations
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;
const TAX_RATE = 0.08; // 8% tax

export function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.product.productId === action.payload.product.productId
      );
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.productId === action.payload.product.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          product: action.payload.product,
          quantity: action.payload.quantity
        }];
      }
      break;
    }
      
    case 'REMOVE_ITEM':
      newItems = state.items.filter(
        item => item.product.productId !== action.payload.productId
      );
      break;
      
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(
          item => item.product.productId !== action.payload.productId
        );
      } else {
        newItems = state.items.map(item =>
          item.product.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
      
    case 'CLEAR_CART':
      newItems = [];
      break;
      
    default:
      return state;
  }
  
  // Calculate derived values
  const subtotal = newItems.reduce((sum, item) => {
    const itemPrice = item.product.discount 
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items: newItems,
    subtotal,
    shipping,
    tax,
    total,
    itemCount
  };
}

export const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0
};