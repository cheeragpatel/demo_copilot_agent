import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

interface SummaryCardProps {
  showProceedButton?: boolean;
  onProceedClick?: () => void;
}

export default function SummaryCard({ showProceedButton = false, onProceedClick }: SummaryCardProps) {
  const { darkMode } = useTheme();
  const { getSubtotal, getShipping, getTotal, getTotalItems } = useCart();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const totalItems = getTotalItems();

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
        Order Summary
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Shipping
          </span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping === 0 && subtotal > 0 && (
          <div className="text-primary text-sm">
            🎉 You qualify for free shipping!
          </div>
        )}

        {shipping > 0 && subtotal > 0 && (
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Free shipping on orders over $100
          </div>
        )}

        <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

        <div className="flex justify-between text-lg font-semibold">
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Total
          </span>
          <span className="text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {showProceedButton && (
        <button
          onClick={onProceedClick}
          disabled={totalItems === 0}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
            totalItems === 0
              ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
              : 'bg-primary hover:bg-accent text-white'
          }`}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}