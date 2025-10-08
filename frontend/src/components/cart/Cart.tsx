import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItemComponent from './CartItem';
import OrderSummary from './OrderSummary';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, clearCart } = useCart();
  const { darkMode } = useTheme();

  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className={`rounded-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-20 w-20 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h2.5m-2.5 0h15"
                />
              </svg>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                Your cart is empty
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              darkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' 
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
            }`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        S.No
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Product Image
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Product Name
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Unit Price
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Quantity
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Total
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-300`}>
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
                    {cart.items.map((item, index) => (
                      <CartItemComponent key={item.productId} item={item} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Continue shopping link */}
            <div className="mt-6">
              <Link
                to="/products"
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  darkMode 
                    ? 'text-primary hover:text-accent hover:bg-gray-800' 
                    : 'text-primary hover:text-accent hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}