import { useCart as useCartContext } from '../context/CartContext';

/**
 * Utility hook that provides additional cart functionality
 */
export function useCart() {
  const cartContext = useCartContext();

  // Helper to check if a product is in cart
  const isInCart = (productId: number) => {
    return cartContext.cart.items.some(item => item.productId === productId);
  };

  // Helper to get quantity of a specific product in cart
  const getProductQuantity = (productId: number) => {
    const item = cartContext.cart.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  // Helper to get cart item by product ID
  const getCartItem = (productId: number) => {
    return cartContext.cart.items.find(item => item.productId === productId);
  };

  // Helper to check if cart has items
  const hasItems = () => {
    return cartContext.cart.items.length > 0;
  };

  return {
    ...cartContext,
    isInCart,
    getProductQuantity,
    getCartItem,
    hasItems,
  };
}