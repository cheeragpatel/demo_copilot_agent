import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import CartLineItem from './CartLineItem';

const CartPage: React.FC = () => {
  const { state, dispatch, itemCount, subtotal, shipping, total } = useCart();
  const { darkMode } = useTheme();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch({ type: 'CLEAR' });
    }
  };

  if (itemCount === 0) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}
          >
            Shopping Cart
          </h1>

          {/* Empty State */}
          <div
            className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
          >
            <svg
              className={`h-16 w-16 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 3H3m4 10v6a1 1 0 001 1h9a1 1 0 001-1v-6m-5 3h0" />
            </svg>
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Add some products to get started with your order.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h1
              className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}
            >
              Shopping Cart ({itemCount} item{itemCount === 1 ? '' : 's'})
            </h1>

            <div className="space-y-4">
              {state.items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={handleClearCart}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-red-400 border-gray-600 hover:border-red-400' : 'text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300'} border transition-colors duration-300`}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div
              className={`sticky top-24 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}
            >
              <h2
                className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}
              >
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {subtotal < 100 && subtotal > 0 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}

                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />

                <div className="flex justify-between text-lg font-semibold">
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors duration-300"
                onClick={() => alert('Checkout functionality not implemented yet')}
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center mt-4 ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} transition-colors duration-300`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;