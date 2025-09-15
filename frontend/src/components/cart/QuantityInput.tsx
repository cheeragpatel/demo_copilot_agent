import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QuantityInputProps {
  value: number;
  onChange: (quantity: number) => void;
  productName: string;
  min?: number;
  max?: number;
}

const DEBOUNCE_DELAY = 150;

export default function QuantityInput({ 
  value, 
  onChange, 
  productName, 
  min = 0, 
  max = 999 
}: QuantityInputProps) {
  const { darkMode } = useTheme();
  const [localValue, setLocalValue] = useState(value.toString());
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const debouncedOnChange = useCallback((newValue: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      onChange(Math.max(min, Math.min(max, newValue)));
    }, DEBOUNCE_DELAY);
  }, [onChange, min, max]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
    
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      debouncedOnChange(numValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    if (newValue <= max) {
      setLocalValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - 1;
    if (newValue >= min) {
      setLocalValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    // Reset to current value if input is invalid
    setLocalValue(value.toString());
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex items-center border rounded-lg overflow-hidden ${
      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
    }`}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={`px-3 py-2 transition-colors ${
          darkMode 
            ? 'text-light hover:bg-gray-600 disabled:text-gray-500 disabled:hover:bg-gray-700' 
            : 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white'
        }`}
        aria-label={`Decrease quantity of ${productName}`}
      >
        <span aria-hidden="true">−</span>
      </button>
      
      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        className={`w-16 text-center py-2 border-none outline-none ${
          darkMode 
            ? 'bg-gray-700 text-light' 
            : 'bg-white text-gray-900'
        }`}
        aria-label={`Quantity of ${productName}`}
      />
      
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={`px-3 py-2 transition-colors ${
          darkMode 
            ? 'text-light hover:bg-gray-600 disabled:text-gray-500 disabled:hover:bg-gray-700' 
            : 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white'
        }`}
        aria-label={`Increase quantity of ${productName}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}