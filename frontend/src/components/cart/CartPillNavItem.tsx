import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/useCart';

export default function CartPillNavItem() {
  const { darkMode } = useTheme();
  const { state } = useCart();
  const location = useLocation();
  
  const isActive = location.pathname === '/cart';

  return (
    <Link
      to="/cart"
      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-primary text-white'
          : darkMode
          ? 'text-light hover:text-primary hover:bg-gray-700/50'
          : 'text-gray-700 hover:text-primary hover:bg-gray-100'
      } relative`}
      aria-label={`Shopping cart with ${state.itemCount} items`}
    >
      {/* Cart Icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m0 0L1.5 1.5M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
        />
      </svg>
      
      {/* Cart Text */}
      <span>
        {state.itemCount > 0 ? `Cart (${state.itemCount})` : 'Cart'}
      </span>
      
      {/* Badge for item count (alternative visual) */}
      {state.itemCount > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          aria-hidden="true"
        >
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </Link>
  );
}