import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const { orderId, totalAmount } = location.state || {};

  if (!orderId) {
    // Redirect to home if no order data
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}
          >
            <h1
              className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}
            >
              No Order Found
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              We couldn't find your order information.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center transition-colors duration-300`}
        >
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1
              className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}
            >
              Order Confirmed!
            </h1>
            <p
              className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg transition-colors duration-300`}
            >
              Thank you for your purchase
            </p>
          </div>

          <div
            className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6 transition-colors duration-300`}
          >
            <div className="space-y-2">
              <div
                className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                <span className="font-medium">Order ID:</span>
                <span className="font-mono">#{orderId}</span>
              </div>
              <div
                className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                <span className="font-medium">Total Amount:</span>
                <span className="font-semibold">${totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div
                className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
              >
                <span className="font-medium">Status:</span>
                <span className="text-yellow-600">Pending</span>
              </div>
            </div>
          </div>

          <div
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors duration-300`}
          >
            <p className="mb-2">
              We've received your order and will process it shortly.
            </p>
            <p>
              You'll receive an email confirmation with tracking information once your order ships.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-primary hover:bg-accent text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} py-3 px-6 rounded-lg font-semibold transition-colors`}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}