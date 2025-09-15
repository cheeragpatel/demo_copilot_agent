import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/useCart';
import CartTable from './CartTable';
import CartSummaryPanel from './CartSummaryPanel';

export default function Cart() {
  const { darkMode } = useTheme();
  const { state } = useCart();

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-dark' : 'bg-gray-100'
    } pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${
            darkMode ? 'text-light' : 'text-gray-800'
          } transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <p className={`mt-2 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {state.itemCount === 0 
              ? 'Your cart is empty' 
              : `${state.itemCount} item${state.itemCount !== 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Table - Takes 2/3 on desktop */}
          <div className="lg:col-span-2">
            <CartTable />
          </div>

          {/* Summary Panel - Takes 1/3 on desktop, stacked on mobile */}
          <div className="mt-8 lg:mt-0">
            <CartSummaryPanel />
          </div>
        </div>

        {/* Mobile-specific summary at bottom (only show on small screens if needed) */}
        <div className="lg:hidden mt-8">
          {/* Summary panel already renders above, this is just for spacing */}
        </div>
      </div>
    </div>
  );
}