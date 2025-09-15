import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  productName: string;
  disabled?: boolean;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 999,
  productName,
  disabled = false,
}) => {
  const { darkMode } = useTheme();

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div
      className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}
    >
      <button
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
        className={`w-8 h-8 flex items-center justify-center ${
          quantity <= min || disabled
            ? `${darkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}`
            : `${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'}`
        } transition-colors duration-300`}
        aria-label={`Remove one ${productName}`}
      >
        <span aria-hidden="true">-</span>
      </button>
      <span
        className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
        aria-label={`Quantity of ${productName}`}
      >
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={quantity >= max || disabled}
        className={`w-8 h-8 flex items-center justify-center ${
          quantity >= max || disabled
            ? `${darkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}`
            : `${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'}`
        } transition-colors duration-300`}
        aria-label={`Add one ${productName}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
};

export default QuantityStepper;