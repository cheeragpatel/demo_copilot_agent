import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getItemCount();

  return (
    <Link
      to="/cart"
      className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Shopping cart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h2.5m-2.5 0h15"
        />
      </svg>

      {/* Item count badge */}
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full border-2 border-white"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}