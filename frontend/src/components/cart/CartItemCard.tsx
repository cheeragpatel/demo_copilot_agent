import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { CartItem } from '../../types/cart';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem, isLoading } = useCart();
  const { darkMode } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      await updateQuantity(item.productId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.productId);
    } finally {
      setIsUpdating(false);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className={`
      group relative overflow-hidden rounded-xl shadow-sm border transition-all duration-300 ease-out
      transform hover:scale-[1.01] hover:shadow-lg
      ${darkMode 
        ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50' 
        : 'bg-white border-gray-200/50 hover:border-gray-300/50'
      }
      ${isUpdating ? 'opacity-75' : ''}
    `}>
      {/* Loading Overlay */}
      {(isUpdating || isLoading) && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
              <img 
                src={`/images/${item.imgName}`} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className={`
                  text-lg font-semibold truncate transition-colors
                  ${darkMode ? 'text-light group-hover:text-primary' : 'text-gray-800 group-hover:text-primary'}
                `}>
                  {item.name}
                </h3>
                
                <div className="mt-1 flex items-center space-x-2">
                  <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {formatPrice(item.price)}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    each
                  </span>
                </div>

                {/* Progressive Disclosure Button */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`
                    mt-2 text-sm font-medium transition-colors
                    ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'}
                  `}
                >
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className={`
                  p-2 rounded-lg transition-all duration-200 transform hover:scale-110
                  ${darkMode 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
                aria-label={`Remove ${item.name} from cart`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Progressive Disclosure Details */}
            {showDetails && (
              <div className={`
                mt-4 p-3 rounded-lg border transition-all duration-300 ease-out
                ${darkMode 
                  ? 'bg-gray-700/30 border-gray-600/30' 
                  : 'bg-gray-50 border-gray-200/30'
                }
              `}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Added:</span>
                    <br />
                    <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Last modified:</span>
                    <br />
                    <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                      {new Date(item.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls and Total */}
        <div className="mt-6 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Quantity:
            </span>
            <div className={`
              flex items-center rounded-lg border
              ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-white'}
            `}>
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className={`
                  px-3 py-2 transition-all duration-200 hover:bg-gray-100/10
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${darkMode ? 'text-light hover:text-primary' : 'text-gray-600 hover:text-primary'}
                `}
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className={`
                px-4 py-2 min-w-[3rem] text-center font-semibold
                ${darkMode ? 'text-light' : 'text-gray-800'}
              `}>
                {item.quantity}
              </div>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className={`
                  px-3 py-2 transition-all duration-200 hover:bg-gray-100/10
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${darkMode ? 'text-light hover:text-primary' : 'text-gray-600 hover:text-primary'}
                `}
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              {formatPrice(itemTotal)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.quantity} × {formatPrice(item.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`
        absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300
        ${darkMode 
          ? 'bg-gradient-to-r from-primary/10 via-transparent to-primary/10' 
          : 'bg-gradient-to-r from-primary/5 via-transparent to-primary/5'
        }
        opacity-0 group-hover:opacity-100
      `}></div>
    </div>
  );
}