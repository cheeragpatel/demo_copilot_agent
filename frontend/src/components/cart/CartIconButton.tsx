import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

interface CartIconButtonProps {
  onClick: () => void;
}

export default function CartIconButton({ onClick }: CartIconButtonProps) {
  const { darkMode } = useTheme();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Cart Icon */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h12.5M7 13v8M13 21a2 2 0 11-4 0 2 2 0 014 0zM21 21a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge */}
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]"
          aria-live="polite"
          aria-label={`${totalItems} items in cart`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}