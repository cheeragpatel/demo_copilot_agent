import React from 'react';
import { CartItem, useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import QuantityStepper from './QuantityStepper';

interface CartLineItemProps {
  item: CartItem;
}

const CartLineItem: React.FC<CartLineItemProps> = ({ item }) => {
  const { dispatch } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (newQuantity: number) => {
    dispatch({
      type: 'UPDATE_QTY',
      payload: { productId: item.productId, quantity: newQuantity },
    });
  };

  const handleRemove = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId: item.productId },
    });
  };

  const lineTotal = item.price * item.quantity;

  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={`/${item.imgName}`}
          alt={item.name}
          className={`w-16 h-16 object-contain rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>
          {item.name}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ${item.price.toFixed(2)} per {item.unit}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex-shrink-0">
        <QuantityStepper
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          productName={item.name}
        />
      </div>

      {/* Line Total */}
      <div className="flex-shrink-0 text-right">
        <p className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          ${lineTotal.toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleRemove}
          className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'} transition-colors duration-300`}
          aria-label={`Remove ${item.name} from cart`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export default CartLineItem;