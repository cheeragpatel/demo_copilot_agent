import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/useCart';
import { CartItem } from '../../types/cart';
import QuantityInput from './QuantityInput';
import RemoveItemButton from './RemoveItemButton';

export default function CartTable() {
  const { darkMode } = useTheme();
  const { state, updateQuantity, removeItem } = useCart();

  if (state.items.length === 0) {
    return (
      <div className={`rounded-lg overflow-hidden shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Product
              </th>
              <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Unit Price
              </th>
              <th scope="col" className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Quantity
              </th>
              <th scope="col" className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Line Total
              </th>
              <th scope="col" className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className={`px-6 py-12 text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m0 0L1.5 1.5M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                      Your cart is empty
                    </h3>
                    <p className="mt-1">
                      Add some products to get started.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const calculateItemPrice = (item: CartItem) => {
    return item.product.discount 
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <table className="w-full">
        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <tr>
            <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Product
            </th>
            <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Unit Price
            </th>
            <th scope="col" className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Quantity
            </th>
            <th scope="col" className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Line Total
            </th>
            <th scope="col" className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Remove
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {state.items.map((item, index) => {
            const itemPrice = calculateItemPrice(item);
            const lineTotal = itemPrice * item.quantity;
            const isEven = index % 2 === 0;
            
            return (
              <tr 
                key={item.product.productId}
                className={`transition-colors ${
                  isEven 
                    ? (darkMode ? 'bg-gray-800' : 'bg-white')
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-50')
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={`/api/images/${item.product.imgName}`}
                        alt={item.product.name}
                        onError={(e) => {
                          e.currentTarget.src = '/copilot.png';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-light' : 'text-gray-900'
                      }`}>
                        {item.product.name}
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        SKU: {item.product.sku}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className={`px-6 py-4 text-sm ${
                  darkMode ? 'text-light' : 'text-gray-900'
                }`}>
                  <div>
                    ${itemPrice.toFixed(2)}
                    {item.product.discount && (
                      <div className={`text-xs line-through ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ${item.product.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-center">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(quantity) => updateQuantity(item.product.productId, quantity)}
                    productName={item.product.name}
                  />
                </td>
                
                <td className={`px-6 py-4 text-sm text-right font-medium ${
                  darkMode ? 'text-light' : 'text-gray-900'
                }`}>
                  ${lineTotal.toFixed(2)}
                </td>
                
                <td className="px-6 py-4 text-center">
                  <RemoveItemButton
                    onRemove={() => removeItem(item.product.productId)}
                    productName={item.product.name}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}