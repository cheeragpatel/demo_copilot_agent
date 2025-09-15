import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartIcon: React.FC = () => {
  const { itemCount } = useCart();
  const { darkMode } = useTheme();

  return (
    <Link to="/cart" className="relative inline-flex items-center">
      <svg
        className={`h-6 w-6 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 3H3m4 10v6a1 1 0 001 1h9a1 1 0 001-1v-6m-5 3h0" />
      </svg>
      {itemCount > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          aria-live="polite"
          aria-label={`${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      <span className="sr-only">Shopping cart</span>
    </Link>
  );
};

export default CartIcon;