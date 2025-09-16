import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const {
    state,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    clearCart,
    clearSaved,
    getCartSummary,
  } = useCart();
  const { darkMode } = useTheme();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  
  const { subtotal, discount, tax, shipping, total, itemCount } = getCartSummary();

  const handleSelectItem = (productId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
    setIsSelectAll(newSelected.size === state.items.length && state.items.length > 0);
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedItems(new Set());
      setIsSelectAll(false);
    } else {
      setSelectedItems(new Set(state.items.map(item => item.productId)));
      setIsSelectAll(true);
    }
  };

  const handleBulkRemove = () => {
    selectedItems.forEach(productId => {
      removeItem(productId);
    });
    setSelectedItems(new Set());
    setIsSelectAll(false);
  };

  const handleQuantityInputChange = (productId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    updateQuantity(productId, quantity);
  };

  if (state.items.length === 0 && state.savedForLater.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center shadow-lg`}>
            <svg
              className={`w-24 h-24 mx-auto mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z"
              />
            </svg>
            <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Your cart is empty
            </h1>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Content */}
          <div className="flex-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              {/* Cart Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Shopping Cart ({itemCount} items)
                  </h1>
                  {state.items.length > 0 && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleSelectAll}
                        className={`text-sm font-medium transition-colors ${
                          darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
                        }`}
                      >
                        {isSelectAll ? 'Deselect All' : 'Select All'}
                      </button>
                      {selectedItems.size > 0 && (
                        <button
                          onClick={handleBulkRemove}
                          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove Selected ({selectedItems.size})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Items Table */}
              {state.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <tr>
                        <th className="w-12 p-4">
                          <input
                            type="checkbox"
                            checked={isSelectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                        </th>
                        <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                          Product
                        </th>
                        <th className={`text-center p-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                          Price
                        </th>
                        <th className={`text-center p-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                          Quantity
                        </th>
                        <th className={`text-center p-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                          Total
                        </th>
                        <th className={`text-center p-4 text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {state.items.map((item) => {
                        const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                        const itemTotal = itemPrice * item.quantity;

                        return (
                          <tr key={item.productId} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedItems.has(item.productId)}
                                onChange={() => handleSelectItem(item.productId)}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={`/${item.imgName}`}
                                  alt={item.name}
                                  className="w-20 h-20 object-contain rounded-lg bg-white flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                    {item.name}
                                  </h3>
                                  {item.sku && (
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      SKU: {item.sku}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {item.discount ? (
                                <div>
                                  <span className="text-sm text-gray-500 line-through block">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <span className="text-primary font-bold">
                                    ${itemPrice.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-primary font-bold">
                                  ${itemPrice.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                                    darkMode
                                      ? 'border-gray-600 text-light hover:bg-gray-700'
                                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                                  className={`w-16 h-8 text-center border rounded ${
                                    darkMode
                                      ? 'bg-gray-700 border-gray-600 text-light'
                                      : 'bg-white border-gray-300 text-gray-800'
                                  } focus:border-primary focus:ring-1 focus:ring-primary`}
                                />
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                                    darkMode
                                      ? 'border-gray-600 text-light hover:bg-gray-700'
                                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-primary font-bold text-lg">
                                ${itemTotal.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => saveForLater(item.productId)}
                                  className={`p-2 rounded-full transition-colors ${
                                    darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'
                                  }`}
                                  title="Save for later"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeItem(item.productId)}
                                  className={`p-2 rounded-full transition-colors ${
                                    darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
                                  }`}
                                  title="Remove item"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Saved for Later Section */}
              {state.savedForLater.length > 0 && (
                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Saved for Later ({state.savedForLater.length} items)
                    </h2>
                    <button
                      onClick={clearSaved}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.savedForLater.map((item) => (
                      <div key={item.productId} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center space-x-3">
                          <img
                            src={`/${item.imgName}`}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded-lg bg-white flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium text-sm truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              {item.name}
                            </h3>
                            <p className="text-primary font-bold text-sm">${item.price.toFixed(2)}</p>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => moveToCart(item.productId)}
                                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-accent transition-colors"
                              >
                                Move to Cart
                              </button>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="text-xs text-red-600 hover:text-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cart Actions */}
              {state.items.length > 0 && (
                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-wrap gap-4`}>
                  <Link
                    to="/products"
                    className={`px-6 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-light hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="px-6 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          {state.items.length > 0 && (
            <div className="lg:w-96">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Subtotal ({itemCount} items)
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Estimated Tax
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Shipping
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-sm text-center text-green-600 mt-2">
                      Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => alert('Checkout functionality coming soon!')}
                  className="w-full mt-6 bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Secure checkout • 30-day returns • Free support
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}