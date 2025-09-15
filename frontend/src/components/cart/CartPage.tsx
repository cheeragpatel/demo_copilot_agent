import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import CartLineItem from './CartLineItem';
import SummaryCard from './SummaryCard';

export default function CartPage() {
  const { darkMode } = useTheme();
  const { items, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleProceedToCheckout = () => {
    // Placeholder for checkout functionality
    alert('Checkout functionality is not implemented yet');
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
          >
            Shopping Cart
          </h1>

          {totalItems === 0 ? (
            /* Empty State */
            <div
              className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              role="status"
              aria-live="polite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h12.5"
                />
              </svg>
              <h2 className={`${darkMode ? 'text-light' : 'text-gray-800'} text-xl font-medium mb-2`}>
                Your cart is empty
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/products"
                className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
                  Cart Items ({totalItems})
                </h2>
                {items.map((item) => (
                  <CartLineItem key={item.product.productId} item={item} />
                ))}
                <div className="pt-4">
                  <Link
                    to="/products"
                    className={`inline-flex items-center ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} font-medium transition-colors`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-1">
                <SummaryCard 
                  showProceedButton={true} 
                  onProceedClick={handleProceedToCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}