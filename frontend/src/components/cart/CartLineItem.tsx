import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import QuantityStepper from './QuantityStepper';
import type { CartItem } from '../../context/CartContext';

interface CartLineItemProps {
  item: CartItem;
  showRemoveButton?: boolean;
}

export default function CartLineItem({ item, showRemoveButton = true }: CartLineItemProps) {
  const { darkMode } = useTheme();
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityIncrease = () => {
    updateQuantity(item.product.productId, item.quantity + 1);
  };

  const handleQuantityDecrease = () => {
    updateQuantity(item.product.productId, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.product.productId);
  };

  const itemPrice = item.product.discount 
    ? item.product.price * (1 - item.product.discount)
    : item.product.price;

  const totalPrice = itemPrice * item.quantity;

  return (
    <div className={`flex items-center space-x-4 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
      {/* Product Image */}
      <div className={`w-16 h-16 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-md p-2 flex-shrink-0`}>
        <img
          src={`/${item.product.imgName}`}
          alt={item.product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h4 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>
          {item.product.name}
        </h4>
        <div className="flex items-center space-x-2 mt-1">
          {item.product.discount ? (
            <>
              <span className="text-gray-500 line-through text-sm">
                ${item.product.price.toFixed(2)}
              </span>
              <span className="text-primary font-medium">
                ${itemPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-primary font-medium">
              ${itemPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <QuantityStepper
        quantity={item.quantity}
        onIncrease={handleQuantityIncrease}
        onDecrease={handleQuantityDecrease}
        productName={item.product.name}
        productId={item.product.productId}
      />

      {/* Total Price */}
      <div className="text-right min-w-[80px]">
        <div className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          ${totalPrice.toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      {showRemoveButton && (
        <button
          onClick={handleRemove}
          className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors duration-300`}
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}