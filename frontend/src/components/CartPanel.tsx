import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartPanel() {
  const { state, closePanel, removeItem, updateQuantity, getCartSummary } = useCart();
  const { darkMode } = useTheme();
  const { subtotal, total, itemCount } = getCartSummary();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 max-w-[90vw] ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl z-50 transform transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Shopping Cart
              </h2>
              <button
                onClick={closePanel}
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
                aria-label="Close cart panel"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {itemCount > 0 && (
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <svg
                  className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z"
                  />
                </svg>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Your cart is empty
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Add some products to get started!
                </p>
                <Link
                  to="/products"
                  onClick={closePanel}
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {state.items.map((item) => {
                  const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                  const isRecentlyAdded = new Date().getTime() - new Date(item.addedAt).getTime() < 5000;

                  return (
                    <div
                      key={item.productId}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        isRecentlyAdded
                          ? 'bg-primary/10 border border-primary/20'
                          : darkMode
                          ? 'bg-gray-700/50'
                          : 'bg-gray-50'
                      }`}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`/${item.imgName}`}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-lg bg-white"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.name}
                        </h4>
                        
                        {/* Price */}
                        <div className="flex items-center space-x-2 mt-1">
                          {item.discount ? (
                            <>
                              <span className="text-xs text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary font-bold text-sm">
                                ${itemPrice.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-bold text-sm">
                              ${itemPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-1`}>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className={`w-6 h-6 flex items-center justify-center text-xs ${
                                darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
                              } transition-colors`}
                            >
                              -
                            </button>
                            <span className={`text-xs font-medium px-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className={`w-6 h-6 flex items-center justify-center text-xs ${
                                darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
                              } transition-colors`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className={`p-1 rounded-full transition-colors ${
                              darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
                            }`}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Summary and Actions */}
          {state.items.length > 0 && (
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} bg-opacity-50 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {/* Price Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subtotal ({itemCount} items)
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Total
                  </span>
                  <span className={`font-bold text-primary text-lg`}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/cart"
                  onClick={closePanel}
                  className={`w-full block text-center px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-light hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  View Full Cart
                </Link>
                <button
                  onClick={() => {
                    closePanel();
                    // TODO: Implement checkout functionality
                    alert('Checkout functionality coming soon!');
                  }}
                  className="w-full bg-primary hover:bg-accent text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  Quick Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}