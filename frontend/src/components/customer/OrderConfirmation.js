import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-12d6e.up.railway.app';

export default function OrderConfirmation({ customer, orderId, onNewOrder }) {
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrderSummary();
  }, [orderId]); // orderId is already included, this should be fine

  const fetchOrderSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/summary`);
      if (!response.ok) throw new Error('Failed to fetch order summary');
      const data = await response.json();
      setOrderSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    fetchOrderSummary(); // Refresh to show paid status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-700 border-t-transparent"></div>
          <p className="mt-4 text-xl text-amber-900">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !orderSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg max-w-md">
          <p className="font-bold text-xl mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isPaid = orderSummary?.status === 'paid';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold">Order Confirmation</h1>
          <p className="mt-2 text-amber-100">Thank you for your order, {customer.name}!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✓</span>
            <div>
              <p className="font-bold text-xl">Order Placed Successfully!</p>
              <p className="text-sm">Order #{orderId}</p>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-200 mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
          </div>

          <div className="p-6">
            {/* Order Status */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isPaid ? '✓ Paid' : 'Pending Payment'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="text-lg font-semibold text-amber-900">
                  {new Date(orderSummary?.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderSummary?.items?.map((item, index) => (
                  <div key={index} className="border-b border-amber-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900">{item.item_name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.addons && item.addons.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">Add-ons:</p>
                            {item.addons.map((addon, addonIndex) => (
                              <p key={addonIndex} className="text-xs text-gray-600 ml-2">
                                • {addon.addon_name} (+Rs {addon.price.toFixed(2)})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-900">Rs {item.sub_total.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Rs {item.item_price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-amber-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-amber-900">Total Amount:</span>
                <span className="text-3xl font-bold text-amber-900">
                  Rs {orderSummary?.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!isPaid ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>💳</span>
              Pay Now
            </button>
          ) : (
            <div className="flex-1 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 text-green-700 font-bold py-4 px-6 rounded-xl text-center">
              ✓ Payment Completed
            </div>
          )}
          
          <button
            onClick={onNewOrder}
            className="flex-1 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            Place New Order
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            orderId={orderId}
            totalAmount={orderSummary?.total_amount || 0}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {/* Customer Info */}
        <div className="mt-6 bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h3 className="text-lg font-bold text-amber-900 mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold text-amber-900">{customer.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold text-amber-900">{customer.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold text-amber-900">{customer.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
