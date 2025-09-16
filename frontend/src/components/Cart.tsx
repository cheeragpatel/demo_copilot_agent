import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/config';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalAmount = getTotalAmount();
  const shippingFee = totalAmount >= 150 ? 0 : 25;
  const finalTotal = totalAmount + shippingFee;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutError('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Step 1: Create order
      const orderData = {
        branchId: 1, // Default branch ID
        orderDate: new Date().toISOString(),
        name: 'Web order',
        description: 'Checkout from web',
        status: 'pending',
      };

      const orderResponse = await axios.post(`${api.baseURL}${api.endpoints.orders}`, orderData);
      const orderId = orderResponse.data.orderId;

      // Step 2: Create order details for each cart item
      const orderDetailPromises = items.map((item) =>
        axios.post(`${api.baseURL}${api.endpoints.orderDetails}`, {
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: '',
        })
      );

      await Promise.all(orderDetailPromises);

      // Step 3: Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation', { state: { orderId, totalAmount: finalTotal } });
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutError('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 transition-colors duration-300`}
          >
            <h1
              className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}
            >
              Your Cart
            </h1>
            <div className="text-center py-12">
              <svg
                className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M7 19h9"
                />
              </svg>
              <h3
                className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-900'} mb-2`}
              >
                Your cart is empty
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                Start adding some products to see them here.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
              >
                Browse Products
              </button>
            </div>
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
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 transition-colors duration-300`}
        >
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}
          >
            Your Cart
          </h1>

          {checkoutError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-3 mb-6">
              {checkoutError}
            </div>
          )}

          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`flex items-center space-x-4 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}
              >
                <img
                  src={`/images/${item.imgName}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.png';
                  }}
                />
                <div className="flex-grow">
                  <h3
                    className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}
                  >
                    ${item.unitPrice.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light bg-gray-600 hover:bg-gray-500' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} rounded transition-colors duration-300`}
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
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light bg-gray-600 hover:bg-gray-500' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} rounded transition-colors duration-300`}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
                  >
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-6 transition-colors duration-300`}
          >
            <div className="space-y-2 mb-4">
              <div
                className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div
                className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                <span>Shipping:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {totalAmount > 0 && totalAmount < 150 && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add ${(150 - totalAmount).toFixed(2)} more for free shipping!
                </p>
              )}
              <div
                className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-2 transition-colors duration-300`}
              >
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary hover:bg-accent text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}