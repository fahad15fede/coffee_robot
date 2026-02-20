import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-12d6e.up.railway.app';

export default function CustomerDashboard({ customer, onNavigate, onLogout }) {
  const [myOrders, setMyOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  const fetchMyOrders = useCallback(async () => {
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
  }, [customer.customer_id]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

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
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F3' }}>
      {/* Fixed Header with Better Button Positioning */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: '#8B7355' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#CCB26C' }}>
                ☕
              </div>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: '#FAF8F3' }}>
                  Coffee Dashboard
                </h1>
                <p className="text-sm opacity-80" style={{ color: '#FAF8F3' }}>
                  Welcome, {customer.name}
                </p>
              </div>
            </div>
            
            {/* Better positioned action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('menu')}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ 
                  backgroundColor: '#CCB26C', 
                  color: '#3D2F1F',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Browse Menu
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: '#FAF8F3',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 p-6 rounded-2xl shadow-sm" style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-sm" style={{ backgroundColor: '#CCB26C' }}>
              �
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D2F1F' }}>
                Welcome back, {customer.name}
              </h2>
              <p className="mb-1" style={{ color: '#6B5B47' }}>
                📧 {customer.email}
              </p>
              <p style={{ color: '#6B5B47' }}>
                📱 {customer.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#CCB26C' }}>
                📦
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6B5B47' }}>Total Orders</p>
                <p className="text-2xl font-bold" style={{ color: '#3D2F1F' }}>{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#CCB26C' }}>
                💰
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6B5B47' }}>Total Spent</p>
                <p className="text-2xl font-bold" style={{ color: '#3D2F1F' }}>Rs {stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#CCB26C' }}>
                ⭐
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6B5B47' }}>Loyalty Points</p>
                <p className="text-2xl font-bold" style={{ color: '#3D2F1F'

                 }}>{stats.totalOrders * 10}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#3D2F1F' }}>Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardCards.map((card, index) => (
              <button
                key={index}
                onClick={card.action}
                className="p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-left"
                style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h4 className="font-semibold mb-2" style={{ color: '#3D2F1F' }}>{card.title}</h4>
                <p className="text-sm" style={{ color: '#6B5B47' }}>{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E0D0' }}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#3D2F1F' }}>
            <span>📋</span>
            Recent Orders
          </h3>
          
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg mb-6" style={{ color: '#6B5B47' }}>No orders yet!</p>
              <button
                onClick={() => onNavigate('menu')}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#CCB26C', color: '#3D2F1F' }}
              >
                Start Your First Order
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.slice(0, 5).map((order, index) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:shadow-sm"
                  style={{ backgroundColor: '#FAF8F3', border: '1px solid #E8E0D0' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: '#8B7355' }}>
                      #{order.order_id}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#3D2F1F' }}>Order #{order.order_id}</p>
                      <p className="text-sm" style={{ color: '#6B5B47' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      {order.status === 'ready' && (
                        <p className="text-xs font-semibold text-green-600 mt-1">
                          ✅ Ready for pickup - Payment required
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: '#3D2F1F' }}>
                      Rs {order.total_amount.toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'ready' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                    {order.status === 'ready' && (
                      <button
                        onClick={() => onNavigate('orders')}
                        className="block mt-1 text-xs px-2 py-1 rounded font-medium transition-all duration-200"
                        style={{ backgroundColor: '#CCB26C', color: '#3D2F1F' }}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coffee Quote */}
        <div className="mt-8 p-6 rounded-2xl text-center shadow-sm" style={{ backgroundColor: '#8B7355' }}>
          <p className="text-lg font-medium italic mb-2" style={{ color: '#FAF8F3' }}>
            "Life happens, coffee helps" ☕
          </p>
          <p className="text-sm opacity-80" style={{ color: '#FAF8F3' }}>- Coffee Lovers Everywhere</p>
        </div>
      </div>
    </div>
  );
}
