import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function OrderSummary() {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const validCoupons = ['SAVE10', 'SAVE20', 'FREESHIP'];
    if (validCoupons.includes(couponInput.toUpperCase())) {
      applyCoupon(couponInput);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponError('');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
        Order Summary
      </h2>

      {/* Order details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            Subtotal ({cart.items.length} items)
          </span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            ${cart.subtotal.toFixed(2)}
          </span>
        </div>

        {cart.totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${cart.totalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            Shipping
          </span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            {cart.shippingCost === 0 ? 'Free' : `$${cart.shippingCost.toFixed(2)}`}
          </span>
        </div>

        <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`} />

        <div className="flex justify-between text-lg font-bold">
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Total
          </span>
          <span className={`text-primary transition-colors duration-300`}>
            ${cart.grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Coupon section */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors duration-300`}>
          Coupon Code
        </label>
        
        {cart.couponCode ? (
          <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border transition-colors duration-300`}>
            <div className="flex items-center">
              <span className="text-green-600 font-medium">{cart.couponCode}</span>
              <span className={`ml-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Applied!</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                className={`flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } transition-colors duration-300`}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-r-lg transition-colors duration-300"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm">{couponError}</p>
            )}
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
              Available coupons: SAVE10 (10% off), SAVE20 (20% off), FREESHIP (Free shipping)
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 text-light hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Update Cart
        </button>
        
        <button
          className="w-full py-3 px-4 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors duration-300"
          disabled={cart.items.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}