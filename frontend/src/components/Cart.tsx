import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem, clearCart } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className={`${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>
              <svg className="mx-auto h-24 w-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8.5M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-lg opacity-75 mb-8">Start shopping to add items to your cart</p>
              <Link
                to="/products"
                className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
            Shopping Cart
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm transition-colors duration-300`}
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`/products/${item.imgName}`}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/copilot.png';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                      {item.name}
                    </h3>
                    <p className={`text-lg font-bold ${darkMode ? 'text-primary' : 'text-primary'} mb-4`}>
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-light hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span 
                          className={`w-12 text-center font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-light hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900/20' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm transition-colors duration-300 sticky top-24`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Free shipping on orders over $100
                  </p>
                )}
                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Checkout
                </button>
                <Link
                  to="/products"
                  className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'text-light border border-gray-600 hover:bg-gray-700' 
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className={`block w-full text-center py-2 px-4 rounded text-sm transition-colors ${
                    darkMode 
                      ? 'text-red-400 hover:bg-red-900/20' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}