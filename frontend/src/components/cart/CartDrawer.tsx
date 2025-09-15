import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useCartUI } from '../../hooks/useCartUI';
import CartLineItem from './CartLineItem';
import SummaryCard from './SummaryCard';

export default function CartDrawer() {
  const { darkMode } = useTheme();
  const { items, getTotalItems } = useCart();
  const { isDrawerOpen, closeDrawer } = useCartUI();
  const headerRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const totalItems = getTotalItems();

  // Handle focus management
  useEffect(() => {
    if (isDrawerOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus on heading when drawer opens
      setTimeout(() => {
        headerRef.current?.focus();
      }, 100);
    } else {
      // Return focus to previous element when drawer closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isDrawerOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, closeDrawer]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Drawer */}
      <div
        className={`relative ${darkMode ? 'bg-dark' : 'bg-white'} w-full sm:w-96 h-full shadow-xl transform transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2
            ref={headerRef}
            id="cart-drawer-title"
            className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}
            tabIndex={-1}
          >
            Your Cart ({totalItems})
          </h2>
          <button
            onClick={closeDrawer}
            className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-300`}
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {totalItems === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <svg
                className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h12.5"
                />
              </svg>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                Your cart is empty
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Start shopping to add items to your cart
              </p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <CartLineItem key={item.product.productId} item={item} />
                ))}
              </div>

              {/* Summary and Actions */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-4`}>
                <SummaryCard />
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className={`block w-full text-center py-2 px-4 border ${darkMode ? 'border-gray-600 text-light hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg font-medium transition-colors`}
                >
                  View Full Cart
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}