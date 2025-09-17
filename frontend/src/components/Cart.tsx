import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, shippingCost, finalTotal } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}
          >
            Shopping Cart
          </h1>
          
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center shadow-sm transition-colors duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13h10m0 0l-1.5 6M16 19a2 2 0 100-4 2 2 0 000 4zM8 19a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <h2
              className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}
            >
              Your cart is empty
            </h2>
            <p
              className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}
            >
              Add some products to get started
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
          >
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} text-sm transition-colors duration-300`}
          >
            Clear Cart
          </button>
        </div>

        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden transition-colors duration-300`}
        >
          {/* Table Header */}
          <div
            className={`grid grid-cols-12 gap-4 p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} transition-colors duration-300`}
          >
            <div className="col-span-6">
              <span
                className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}
              >
                Product
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span
                className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}
              >
                Price
              </span>
            </div>
            <div className="col-span-3 text-center">
              <span
                className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}
              >
                Quantity
              </span>
            </div>
            <div className="col-span-1 text-center">
              <span
                className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}
              >
                Total
              </span>
            </div>
          </div>

          {/* Cart Items */}
          {items.map((item) => (
            <div
              key={item.productId}
              className={`grid grid-cols-12 gap-4 p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}
            >
              {/* Product Info */}
              <div className="col-span-6 flex items-center space-x-4">
                <img
                  src={`/${item.imgName}`}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h3
                    className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                  >
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 flex items-center justify-center">
                <span
                  className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                >
                  ${item.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-3 flex items-center justify-center">
                <div
                  className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 transition-colors duration-300`}
                >
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span
                    className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Item Total & Remove */}
              <div className="col-span-1 flex flex-col items-center justify-center space-y-2">
                <span
                  className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors duration-300`}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg mt-6 p-6 shadow-sm transition-colors duration-300`}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}
              >
                Subtotal
              </span>
              <span
                className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}
              >
                Shipping {totalPrice >= 100 && '(Free shipping over $100)'}
              </span>
              <span
                className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                ${shippingCost.toFixed(2)}
              </span>
            </div>
            <div
              className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 transition-colors duration-300`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                >
                  Total
                </span>
                <span
                  className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                >
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}