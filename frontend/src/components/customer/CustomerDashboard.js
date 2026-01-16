import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export default function CustomerDashboard({ customer, onNavigate, onLogout }) {
  const [myOrders, setMyOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (response.ok) {
        const allOrders = await response.json();
        const customerOrders = allOrders.filter(o => o.customer_id === customer.customer_id);
        setMyOrders(customerOrders);
        
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0);
        setStats({
          totalOrders: customerOrders.length,
          totalSpent: totalSpent
        });
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const dashboardCards = [
    {
      title: 'Browse Menu',
      icon: '📖',
      description: 'Explore our delicious coffee selection',
      color: 'from-amber-600 to-orange-600',
      action: () => onNavigate('menu')
    },
    {
      title: 'My Orders',
      icon: '📦',
      description: `${stats.totalOrders} orders placed`,
      color: 'from-orange-600 to-red-600',
      action: () => onNavigate('orders')
    },
    {
      title: 'Special Deals',
      icon: '🎁',
      description: 'Check out today\'s offers',
      color: 'from-yellow-600 to-amber-600',
      action: () => onNavigate('deals')
    },
    {
      title: 'Payment History',
      icon: '💳',
      description: `$${stats.totalSpent.toFixed(2)} total spent`,
      color: 'from-green-600 to-emerald-600',
      action: () => onNavigate('payments')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header with Profile */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-2xl animate-scale-in border-4 border-white">
                👤
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2 animate-slide-up">
                  Welcome back, {customer.name}! ☕
                </h1>
                <p className="text-amber-200 text-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
                  {customer.email}
                </p>
                <p className="text-amber-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  📱 {customer.phone}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition transform hover:scale-105 border border-white/30"
            >
              🚪 Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-3xl">
                  ☕
                </div>
                <div className="text-white">
                  <p className="text-amber-200 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-3xl">
                  💰
                </div>
                <div className="text-white">
                  <p className="text-amber-200 text-sm">Total Spent</p>
                  <p className="text-3xl font-bold">Rs.{stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl">
                  ⭐
                </div>
                <div className="text-white">
                  <p className="text-amber-200 text-sm">Loyalty Points</p>
                  <p className="text-3xl font-bold">{stats.totalOrders * 10}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 flex items-center gap-3">
          <span>🎯</span>
          Quick Actions
        </h2>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="group cursor-pointer animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className={`bg-gradient-to-br ${card.color} p-6 text-center`}>
                  <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                </div>
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                  <p className="text-amber-900 text-center">{card.description}</p>
                  <div className="mt-4 text-center">
                    <span className="text-amber-700 font-semibold group-hover:underline">
                      Click to explore →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-200 animate-slide-up">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <span>📋</span>
            Recent Orders
          </h2>
          
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl text-gray-600 mb-4">No orders yet!</p>
              <button
                onClick={() => onNavigate('menu')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition transform hover:scale-105"
              >
                Start Your First Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.slice(0, 5).map((order, index) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      #{order.order_id}
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-900 text-xl">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coffee Quote */}
        <div className="mt-12 bg-gradient-to-r from-amber-800 to-orange-800 rounded-2xl p-8 text-center text-white shadow-2xl animate-scale-in">
          <p className="text-2xl font-light italic mb-2">
            "Life happens, coffee helps" ☕
          </p>
          <p className="text-amber-200">- Coffee Lovers Everywhere</p>
        </div>
      </div>
    </div>
  );
}
