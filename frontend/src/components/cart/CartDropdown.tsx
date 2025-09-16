import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartDropdown() {
  const { items, itemCount, totalPrice, isLoading } = useCart();
  const { darkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Show max 3 recent items in dropdown
  const recentItems = items
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cart Icon with Badge */}
      <Link 
        to="/cart"
        className={`
          relative flex items-center p-2 rounded-lg transition-all duration-300 ease-out
          ${darkMode 
            ? 'text-light hover:text-primary hover:bg-gray-800/50' 
            : 'text-gray-700 hover:text-primary hover:bg-gray-100/50'
          }
          ${isHovered ? 'transform scale-105' : ''}
        `}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        {/* Modern Shopping Bag Icon */}
        <svg 
          className="w-6 h-6 transition-transform duration-300 ease-out"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" 
          />
        </svg>
        
        {/* Subtle Badge */}
        {itemCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 min-w-[1.25rem] h-5 
            flex items-center justify-center text-xs font-semibold rounded-full
            transform transition-all duration-300 ease-out
            ${isHovered ? 'scale-110' : ''}
            ${darkMode 
              ? 'bg-primary text-white' 
              : 'bg-primary text-white'
            }
          `}>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </Link>

      {/* Elegant Dropdown Preview */}
      {isHovered && (
        <div className={`
          absolute right-0 top-full mt-2 w-80 z-50
          transform transition-all duration-300 ease-out origin-top-right
          ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
        `}>
          <div className={`
            rounded-xl shadow-2xl backdrop-blur-sm border
            ${darkMode 
              ? 'bg-gray-800/95 border-gray-700/50' 
              : 'bg-white/95 border-gray-200/50'
            }
          `}>
            {/* Dropdown Arrow */}
            <div className={`
              absolute -top-2 right-4 w-4 h-4 rotate-45 border-l border-t
              ${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'}
            `}></div>
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Shopping Cart
                </h3>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
              </div>

              {items.length === 0 ? (
                /* Empty State */
                <div className="text-center py-6">
                  <svg 
                    className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
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
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your cart is empty
                  </p>
                  <Link 
                    to="/products" 
                    className="inline-block mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <>
                  {/* Recent Items */}
                  <div className="space-y-3 mb-4">
                    {recentItems.map((item) => (
                      <div 
                        key={item.productId} 
                        className={`
                          flex items-center space-x-3 p-2 rounded-lg transition-colors
                          ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
                        `}
                      >
                        {/* Product Image */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img 
                            src={`/images/${item.imgName}`} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            {item.name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {items.length > 3 && (
                      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        and {items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className={`
                    border-t pt-3 space-y-2
                    ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                  `}>
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Subtotal:
                      </span>
                      <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Estimated Shipping:
                      </span>
                      <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {totalPrice > 50 ? 'FREE' : '$4.99'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <Link 
                      to="/cart"
                      className={`
                        w-full py-2 px-3 rounded-lg text-sm font-medium text-center 
                        transition-all duration-200 transform hover:scale-[1.02]
                        ${darkMode 
                          ? 'bg-gray-700 text-light hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }
                        flex items-center justify-center
                      `}
                    >
                      View Cart
                    </Link>
                    <button className={`
                      w-full py-2 px-3 rounded-lg text-sm font-medium text-center 
                      transition-all duration-200 transform hover:scale-[1.02]
                      bg-primary text-white hover:bg-primary/90
                      flex items-center justify-center
                    `}>
                      Quick Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}