import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-12d6e.up.railway.app';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/summary`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setSelectedOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setError(null);
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status?status=${newStatus}`,
        { method: 'PUT' }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update order status');
      }
      
      fetchOrders();
      if (selectedOrder?.order_id === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (err) {
      setError(`Status Update Error: ${err.message}`);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/delete/${orderId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete order');
      
      fetchOrders();
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      preparing: 'bg-blue-100 text-blue-800 border-blue-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="h-full">
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-amber-900">All Orders</h2>
            <button
              onClick={fetchOrders}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              Refresh
            </button>
          </div>

          {loading && orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => fetchOrderDetails(order.order_id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedOrder?.order_id === order.order_id
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-amber-900">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">Customer ID: {order.customer_id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                    <span className="font-bold text-amber-900">
                      Rs {order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-200 overflow-y-auto">
          {!selectedOrder ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select an order to view details</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                Order #{selectedOrder.order_id}
              </h2>

              {/* Order Info */}
              <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Customer ID</p>
                    <p className="font-semibold">{selectedOrder.customer_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Created At</p>
                    <p className="font-semibold">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-amber-900">Rs {selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-amber-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="border border-amber-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-amber-900">{item.item_name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-amber-900">Rs {item.sub_total.toFixed(2)}</p>
                      </div>
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-amber-300">
                          <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
                          {item.addons.map((addon, addonIndex) => (
                            <p key={addonIndex} className="text-xs text-gray-600">
                              • {addon.addon_name} (+Rs {addon.price.toFixed(2)})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-amber-900 mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'preparing', 'ready', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.order_id, status)}
                      disabled={selectedOrder.status === status}
                      className={`py-2 px-4 rounded-lg font-semibold transition ${
                        selectedOrder.status === status
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Order */}
              <button
                onClick={() => deleteOrder(selectedOrder.order_id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
