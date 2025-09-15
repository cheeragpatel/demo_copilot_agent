import { useTheme } from '../../context/ThemeContext';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  productName: string;
  productId: number;
}

export default function QuantityStepper({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  productName, 
  productId 
}: QuantityStepperProps) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}
    >
      <button
        onClick={onDecrease}
        className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
        aria-label={`Decrease quantity of ${productName}`}
        id={`decrease-qty-${productId}`}
      >
        <span aria-hidden="true">-</span>
      </button>
      <span
        className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
        aria-label={`Quantity of ${productName}`}
        id={`qty-${productId}`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
        aria-label={`Increase quantity of ${productName}`}
        id={`increase-qty-${productId}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}