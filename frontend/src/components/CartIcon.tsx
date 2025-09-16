import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartIcon() {
  const { state, togglePanel, getCartSummary } = useCart();
  const { darkMode } = useTheme();
  const { itemCount } = getCartSummary();

  return (
    <button
      onClick={togglePanel}
      className={`relative p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
      }`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <div className="relative">
        {/* Cart Icon */}
        <svg
          className={`w-6 h-6 transition-colors duration-300 ${
            darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>

        {/* Item Count Badge */}
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-300 animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        )}

        {/* Recently Added Indicator */}
        {state.items.some(item => {
          const addedTime = new Date(item.addedAt).getTime();
          const now = new Date().getTime();
          return (now - addedTime) < 3000; // 3 seconds
        }) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
        )}
      </div>
    </button>
  );
}