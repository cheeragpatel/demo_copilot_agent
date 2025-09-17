import { useCart, CartItem } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartItemProps {
  item: CartItem;
  index: number;
}

export default function CartItemComponent({ item, index }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const itemTotal = item.unitPrice * item.quantity;
  const itemDiscount = (item.discount || 0) * item.quantity;
  const finalTotal = itemTotal - itemDiscount;

  return (
    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b transition-colors duration-300`}>
      {/* S.No */}
      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
        {index + 1}
      </td>

      {/* Product Image */}
      <td className="px-4 py-4">
        <div className="flex-shrink-0 h-16 w-16">
          <img
            className="h-16 w-16 rounded-lg object-cover"
            src={item.product.imgName ? `/images/${item.product.imgName}` : '/images/placeholder.jpg'}
            alt={item.product.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
      </td>

      {/* Product Name */}
      <td className={`px-4 py-4 ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
        <div className="text-sm font-medium">{item.product.name}</div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
          SKU: {item.product.sku}
        </div>
      </td>

      {/* Unit Price */}
      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
        <div>${item.unitPrice.toFixed(2)}</div>
        {item.discount && item.discount > 0 && (
          <div className="text-sm text-green-600">
            -${item.discount.toFixed(2)} discount
          </div>
        )}
      </td>

      {/* Quantity Controls */}
      <td className="px-4 py-4">
        <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 w-fit transition-colors duration-300`}>
          <button
            onClick={() => handleQuantityChange(-1)}
            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
            aria-label={`Decrease quantity of ${item.product.name}`}
          >
            <span aria-hidden="true">-</span>
          </button>
          <span
            className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
            aria-label={`Increase quantity of ${item.product.name}`}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </td>

      {/* Total */}
      <td className={`px-4 py-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
        <div>${finalTotal.toFixed(2)}</div>
        {itemDiscount > 0 && (
          <div className="text-sm text-green-600">
            (saved ${itemDiscount.toFixed(2)})
          </div>
        )}
      </td>

      {/* Remove */}
      <td className="px-4 py-4">
        <button
          onClick={handleRemove}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'}`}
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}