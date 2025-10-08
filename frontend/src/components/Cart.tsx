import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice, 
    shippingCost, 
    finalTotal, 
    shippingProgress 
  } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}>
            <div className="mb-6">
              <svg
                className={`w-24 h-24 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5-1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Looks like you haven't added any items to your cart yet. Discover amazing products for your feline friends!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-accent text-white font-medium rounded-lg transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
            Shopping Cart
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`/products/${item.imgName}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-grow">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-1`}>
                          {item.name}
                        </h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 line-clamp-2`}>
                          {item.description}
                        </p>
                        <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                          SKU: {item.sku}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.price.toFixed(2)}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          per item
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls and Subtotal */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                          Quantity:
                        </span>
                        <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors duration-300`}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} hover:bg-primary/10 rounded-l-lg transition-colors duration-300`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[3rem] text-center font-medium py-2`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} hover:bg-primary/10 rounded-r-lg transition-colors duration-300`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            subtotal
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className={`p-2 ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'} rounded-lg transition-colors duration-300`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
                Order Summary
              </h2>

              {/* Shipping Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Free shipping progress
                  </span>
                  <span className={`text-sm font-medium ${shippingProgress >= 100 ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {shippingProgress.toFixed(0)}%
                  </span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${shippingProgress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
                {shippingProgress < 100 && (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                    Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}
                {shippingProgress >= 100 && (
                  <p className="text-xs text-green-500 mt-1">
                    🎉 You qualify for free shipping!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subtotal ({totalItems} items)
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Shipping
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-3`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Total
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-accent text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-3 px-4 rounded-lg font-medium transition-colors duration-300`}
                >
                  Clear Cart
                </button>
                <Link
                  to="/products"
                  className={`block w-full text-center ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} py-2 font-medium transition-colors duration-300`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}