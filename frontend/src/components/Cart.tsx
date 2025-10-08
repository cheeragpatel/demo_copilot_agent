import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice, shippingCost, finalTotal, isLoading } = useCart();
  const { darkMode } = useTheme();

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-12 text-center max-w-md transition-all duration-300 hover:shadow-2xl`}>
              <div className="mb-6">
                <svg
                  className={`w-24 h-24 mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-300'} transition-colors duration-300`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5l2.5 5M17 8v13a2 2 0 01-2 2H9a2 2 0 01-2-2V8"
                  />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
                Your Cart is Empty
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
                Looks like you haven't added any smart cat tech to your cart yet.
              </p>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className={`px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105`}
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Responsive Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden`}
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                    <img
                      src={`/products/${item.imgName}`}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
                      {item.name}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2 transition-colors duration-300`}>
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        ${item.price.toFixed(2)}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                        SKU: {item.sku}
                      </span>
                    </div>

                    {/* Modern Stepper Controls */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full p-1 transition-colors duration-300`}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'hover:bg-gray-600 text-light' : 'hover:bg-gray-200 text-gray-700'} transition-all duration-300 transform hover:scale-110`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[3rem] text-center font-semibold transition-colors duration-300`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'hover:bg-gray-600 text-light' : 'hover:bg-gray-200 text-gray-700'} transition-all duration-300 transform hover:scale-110`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                          Subtotal:
                        </span>
                        <span className={`text-lg font-bold text-primary transition-colors duration-300`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Contemporary Card Design */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sticky top-24 transition-all duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    Subtotal ({totalItems} items)
                  </span>
                  <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    Shipping
                  </span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-green-500' : darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {/* Free shipping message */}
                {totalPrice > 0 && totalPrice <= 150 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic transition-colors duration-300`}>
                    Add ${(150 - totalPrice).toFixed(2)} more for free shipping!
                  </div>
                )}

                {/* Divider */}
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`} />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Total
                  </span>
                  <span className="text-primary">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Floating Action Button - Checkout */}
              <button className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Proceed to Checkout</span>
              </button>

              {/* Continue Shopping */}
              <a
                href="/products"
                className={`block w-full mt-4 text-center py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105`}
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}