import { useTheme } from '../../context/ThemeContext';

interface RemoveItemButtonProps {
  onRemove: () => void;
  productName: string;
}

export default function RemoveItemButton({ onRemove, productName }: RemoveItemButtonProps) {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={onRemove}
      className={`p-2 rounded-md transition-colors hover:scale-105 ${
        darkMode 
          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
      }`}
      aria-label={`Remove ${productName} from cart`}
      title={`Remove ${productName} from cart`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}