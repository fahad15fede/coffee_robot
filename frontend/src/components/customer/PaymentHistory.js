import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export default function PaymentHistory({ customer, onBack }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    paidOrders: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (response.ok) {
        const allOrders = await response.json();
        const myOrders = allOrders.filter(o => o.customer_id === customer.customer_id);
        
        const paidOrders = myOrders.filter(o => o.status === 'paid' || o.status === 'completed');
        const pendingOrders = myOrders.filter(o => o.status === 'pending');
        
        const totalPaid = paidOrders.reduce((sum, order) => sum + order.total_amount, 0);
        const pendingAmount = pendingOrders.reduce((sum, order) => sum + order.total_amount, 0);
        
        setPayments(myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setStats({
          totalPaid,
          paidOrders: paidOrders.length,
          pendingAmount
        });
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (status) => {
    if (status === 'paid' || status === 'completed') return '✅';
    if (status === 'pending') return '⏳';
    return '📋';
  };

  const getPaymentColor = (status) => {
    if (status === 'paid' || status === 'completed') return 'from-green-500 to-emerald-600';
    if (status === 'pending') return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
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
            <span>💳</span>
            Payment History
          </h1>
          <p className="text-amber-200 mt-2">Track all your transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                ✅
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats.totalPaid.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{stats.paidOrders} orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-200 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                ⏳
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${stats.pendingAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Awaiting payment</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-200 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                📊
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-amber-600">
                  {payments.length}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl text-amber-900">Loading payment history...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-scale-in">
            <div className="text-8xl mb-6">💳</div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">No Payments Yet</h2>
            <p className="text-gray-600 mb-8">Your payment history will appear here</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📋</span>
                Transaction History
              </h2>
            </div>

            <div className="divide-y divide-amber-100">
              {payments.map((payment, index) => (
                <div
                  key={payment.order_id}
                  className="p-6 hover:bg-amber-50 transition animate-slide-up"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getPaymentColor(payment.status)} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                        {getPaymentIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-bold text-amber-900 text-lg">
                          Order #{payment.order_id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleString()}
                        </p>
                        <div className="mt-1">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'paid' || payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status === 'paid' || payment.status === 'completed' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-900">
                        ${payment.total_amount.toFixed(2)}
                      </p>
                      {payment.status === 'paid' || payment.status === 'completed' ? (
                        <p className="text-sm text-green-600 font-semibold">✓ Completed</p>
                      ) : (
                        <p className="text-sm text-yellow-600 font-semibold">⏳ Pending</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Info */}
        <div className="mt-8 bg-gradient-to-r from-amber-800 to-orange-800 rounded-2xl p-8 text-white shadow-2xl animate-scale-in">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span>
            Payment Methods Accepted
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm">Credit Card</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm">Cash</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-sm">Mobile Pay</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🏦</div>
              <p className="text-sm">Bank Transfer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
