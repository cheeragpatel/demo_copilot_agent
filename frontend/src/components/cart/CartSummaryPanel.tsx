import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/useCart';

export default function CartSummaryPanel() {
  const { darkMode } = useTheme();
  const { state } = useCart();

  return (
    <aside 
      className={`rounded-lg shadow-lg p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } lg:sticky lg:top-24 lg:h-fit`}
      role="complementary"
      aria-label="Order summary"
    >
      <h2 className={`text-lg font-semibold mb-6 ${
        darkMode ? 'text-light' : 'text-gray-900'
      }`}>
        Order Summary
      </h2>
      
      <div className="space-y-4">
        {/* Item Count */}
        <div className={`flex justify-between text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>Items ({state.itemCount})</span>
          <span>${state.subtotal.toFixed(2)}</span>
        </div>
        
        {/* Shipping */}
        <div className={`flex justify-between text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>Shipping</span>
          <span>
            {state.shipping === 0 ? (
              <span className="text-green-500 font-medium">FREE</span>
            ) : (
              `$${state.shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        {/* Free shipping threshold message */}
        {state.subtotal > 0 && state.subtotal < 100 && (
          <div className={`text-xs p-3 rounded-md ${
            darkMode 
              ? 'bg-blue-900/20 text-blue-300 border border-blue-800' 
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            Add ${(100 - state.subtotal).toFixed(2)} more for free shipping!
          </div>
        )}
        
        {/* Tax */}
        <div className={`flex justify-between text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>Tax (8%)</span>
          <span>${state.tax.toFixed(2)}</span>
        </div>
        
        {/* Divider */}
        <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
        
        {/* Total */}
        <div className={`flex justify-between text-lg font-semibold ${
          darkMode ? 'text-light' : 'text-gray-900'
        }`}>
          <span>Total</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
        
        {/* Checkout Button */}
        <button
          disabled={state.itemCount === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            state.itemCount > 0
              ? 'bg-primary hover:bg-accent text-white'
              : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
          }`}
        >
          {state.itemCount > 0 ? 'Proceed to Checkout' : 'Add Items to Checkout'}
        </button>
        
        {/* Continue Shopping Link */}
        <div className="text-center">
          <a
            href="/products"
            className={`text-sm hover:underline ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Continue Shopping
          </a>
        </div>
        
        {/* Additional Info */}
        {state.itemCount > 0 && (
          <div className={`mt-6 pt-4 border-t text-xs space-y-2 ${
            darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
          }`}>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Easy returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Fast delivery</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}