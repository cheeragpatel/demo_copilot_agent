import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItemCard from './CartItemCard';

export default function Cart() {
  const { items, itemCount, totalPrice, clearCart, canUndo, undo } = useCart();
  const { darkMode } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const estimatedShipping = totalPrice > 50 ? 0 : 4.99;
  const totalWithShipping = totalPrice + estimatedShipping;

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className={`
      min-h-screen pt-20 px-4 transition-colors duration-300
      ${darkMode ? 'bg-dark' : 'bg-gray-100'}
    `}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Shopping Cart
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {itemCount === 0 
                  ? 'Your cart is empty' 
                  : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>

            {/* Undo Button */}
            {canUndo && (
              <button
                onClick={undo}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                  transition-all duration-200 transform hover:scale-105
                  ${darkMode 
                    ? 'bg-gray-700 text-light hover:bg-gray-600' 
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                  }
                  shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className={`
            text-center py-20 rounded-2xl shadow-sm border
            ${darkMode 
              ? 'bg-gray-800/30 border-gray-700/30' 
              : 'bg-white border-gray-200/30'
            }
          `}>
            <div className="max-w-md mx-auto">
              <svg 
                className={`w-24 h-24 mx-auto mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" 
                />
              </svg>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Your cart is empty
              </h2>
              <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Looks like you haven't added any smart cat tech to your cart yet.
              </p>
              <Link 
                to="/products"
                className={`
                  inline-flex items-center px-8 py-3 rounded-lg font-semibold
                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  bg-primary text-white hover:bg-primary/90
                `}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="flex justify-end mb-6">
                    {!showClearConfirm ? (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                          transition-all duration-200 hover:scale-105
                          ${darkMode 
                            ? 'text-red-400 hover:bg-red-400/10 border border-red-400/30' 
                            : 'text-red-500 hover:bg-red-50 border border-red-200'
                          }
                        `}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Clear Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Are you sure?
                        </span>
                        <button
                          onClick={handleClearCart}
                          className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className={`
                            px-3 py-1 text-sm rounded transition-colors
                            ${darkMode 
                              ? 'bg-gray-700 text-light hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }
                          `}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cart Items List */}
                {items.map((item) => (
                  <CartItemCard key={item.productId} item={item} />
                ))}
              </div>
            </div>

            {/* Cart Summary - Floating Action Section */}
            <div className="lg:col-span-1">
              <div className={`
                sticky top-24 rounded-2xl shadow-lg border p-6
                ${darkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
                  : 'bg-white border-gray-200/50 backdrop-blur-sm'
                }
              `}>
                <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Shipping:
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {estimatedShipping === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        formatPrice(estimatedShipping)
                      )}
                    </span>
                  </div>

                  {totalPrice < 50 && (
                    <div className={`
                      text-sm p-3 rounded-lg
                      ${darkMode ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-50 text-blue-600'}
                    `}>
                      Add {formatPrice(50 - totalPrice)} more for FREE shipping!
                    </div>
                  )}

                  <div className={`
                    border-t pt-4 flex justify-between text-lg font-bold
                    ${darkMode ? 'border-gray-700 text-light' : 'border-gray-200 text-gray-800'}
                  `}>
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className={`
                    w-full py-3 px-4 rounded-lg font-semibold text-white
                    transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                    bg-primary hover:bg-primary/90
                    flex items-center justify-center
                  `}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Proceed to Checkout
                  </button>
                  
                  <Link 
                    to="/products"
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium text-center
                      transition-all duration-200 transform hover:scale-[1.02]
                      ${darkMode 
                        ? 'bg-gray-700 text-light hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                      flex items-center justify-center
                    `}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className={`
                  mt-6 pt-6 border-t text-center text-sm
                  ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}
                `}>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Fast Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}