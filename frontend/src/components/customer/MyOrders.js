import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export default function MyOrders({ customer, onBack }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [customer.customer_id]); // Add customer.customer_id as dependency

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (response.ok) {
        const allOrders = await response.json();
        const myOrders = allOrders.filter(o => o.customer_id === customer.customer_id);
        setOrders(myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/summary`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-yellow-400 to-yellow-600',
      preparing: 'from-blue-400 to-blue-600',
      ready: 'from-green-400 to-green-600',
      paid: 'from-emerald-400 to-emerald-600',
      completed: 'from-gray-400 to-gray-600'
    };
    return colors[status] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="mb-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span>📦</span>
            My Orders
          </h1>
          <p className="text-amber-200 mt-2">Track all your coffee orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl text-amber-900">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-scale-in">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">Start your coffee journey today!</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.order_id}
                  onClick={() => fetchOrderDetails(order.order_id)}
                  className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 animate-slide-up ${
                    selectedOrder?.order_id === order.order_id
                      ? 'border-amber-600 shadow-2xl'
                      : 'border-amber-200 hover:border-amber-400'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getStatusColor(order.status)} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        #{order.order_id}
                      </div>
                      <div>
                        <p className="font-bold text-amber-900 text-lg">Order #{order.order_id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getStatusColor(order.status)} shadow-md`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-amber-100">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-amber-900">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="lg:sticky lg:top-8 h-fit">
              {!selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-amber-200">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-xl text-gray-600">Select an order to view details</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 animate-scale-in">
                  <div className={`bg-gradient-to-r ${getStatusColor(selectedOrder.status)} p-6 text-white`}>
                    <h2 className="text-2xl font-bold mb-2">Order #{selectedOrder.order_id}</h2>
                    <p className="text-white/80">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>

                  <div className="p-6">
                    {/* Items */}
                    <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                      <span>☕</span>
                      Order Items
                    </h3>
                    <div className="space-y-3 mb-6">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-amber-900">{item.item_name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-amber-900 text-lg">
                              ${item.sub_total.toFixed(2)}
                            </p>
                          </div>
                          {item.addons && item.addons.length > 0 && (
                            <div className="mt-2 pl-3 border-l-4 border-amber-400">
                              <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
                              {item.addons.map((addon, addonIndex) => (
                                <p key={addonIndex} className="text-sm text-gray-700">
                                  • {addon.addon_name} (+${addon.price.toFixed(2)})
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">Total Amount</span>
                        <span className="text-3xl font-bold">
                          ${selectedOrder.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
