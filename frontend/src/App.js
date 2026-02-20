import React, { useState } from 'react';
import CustomerApp from './components/customer/CustomerApp';
import AdminApp from './components/admin/AdminApp';

export default function App() {
  const [role, setRole] = useState(null); // null, 'customer', 'admin'
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminLogin = () => {
    if (adminPassword === 'fahad213') {
      setRole('admin');
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Incorrect password. Please try again.');
      setAdminPassword('');
    }
  };

  const handleAdminCancel = () => {
    setShowAdminLogin(false);
    setAdminPassword('');
    setAdminError('');
  };

  // Admin Login Modal
  if (showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF8F3' }}>
        <div className="max-w-md w-full">
          <div className="rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: '#F5F2ED', border: '2px solid #E8E0D0' }}>
            <div className="px-8 py-6 text-center" style={{ backgroundColor: '#8B7355' }}>
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-2xl font-bold" style={{ color: '#FAF8F3' }}>Admin Login</h2>
              <p className="text-sm opacity-90" style={{ color: '#FAF8F3' }}>Enter admin password to continue</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#3D2F1F' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    backgroundColor: '#FAF8F3',
                    borderColor: '#E8E0D0',
                    color: '#3D2F1F'
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              {adminError && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span className="text-sm">{adminError}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAdminCancel}
                  className="flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-md border-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: '#E8E0D0',
                    color: '#6B5B47'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: '#8B7355',
                    color: '#FAF8F3'
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF8F3' }}>
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#3D2F1F' }}>☕ Coffee Shop</h1>
            <p className="text-xl" style={{ color: '#6B5B47' }}>Welcome! Please select your role</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Card */}
            <div
              onClick={() => setRole('customer')}
              className="rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
              style={{ backgroundColor: '#F5F2ED', border: '2px solid #E8E0D0' }}
            >
              <div className="px-8 py-12 text-center" style={{ backgroundColor: '#CCB26C' }}>
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold" style={{ color: '#3D2F1F' }}>Customer</h2>
              </div>
              <div className="p-8">
                <ul className="space-y-3" style={{ color: '#6B5B47' }}>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Browse menu items</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Add items to cart</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Customize with add-ons</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Place and pay for orders</span>
                  </li>
                </ul>
                <button 
                  className="w-full mt-6 py-3 px-6 rounded-lg font-bold transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#CCB26C', color: '#3D2F1F' }}
                >
                  Continue as Customer
                </button>
              </div>
            </div>

            {/* Admin Card */}
            <div
              onClick={() => setShowAdminLogin(true)}
              className="rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
              style={{ backgroundColor: '#F5F2ED', border: '2px solid #E8E0D0' }}
            >
              <div className="px-8 py-12 text-center" style={{ backgroundColor: '#8B7355' }}>
                <div className="text-6xl mb-4">👨‍💼</div>
                <h2 className="text-3xl font-bold" style={{ color: '#FAF8F3' }}>Admin</h2>
                <p className="text-sm opacity-80 mt-2" style={{ color: '#FAF8F3' }}>🔐 Password Required</p>
              </div>
              <div className="p-8">
                <ul className="space-y-3" style={{ color: '#6B5B47' }}>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Manage menu items</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>View all orders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Update order status</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Track sales and payments</span>
                  </li>
                </ul>
                <button 
                  className="w-full mt-6 py-3 px-6 rounded-lg font-bold transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#8B7355', color: '#FAF8F3' }}
                >
                  Login as Admin
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: '#6B5B47' }}>
              Admin access requires password authentication for security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'customer') {
    return <CustomerApp onChangeRole={() => setRole(null)} />;
  }

  if (role === 'admin') {
    return (
      <div>
        <button
          onClick={() => setRole(null)}
          className="fixed top-4 right-4 z-[100] px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm shadow-sm"
          style={{ 
            backgroundColor: '#CCB26C', 
            color: '#3D2F1F',
            border: '1px solid rgba(61, 47, 31, 0.2)'
          }}
        >
          ← Change Role
        </button>
        <AdminApp />
      </div>
    );
  }

  return null;
}