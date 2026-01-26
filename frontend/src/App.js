import React, { useState } from 'react';
import CustomerApp from './components/customer/CustomerApp';
import AdminApp from './components/admin/AdminApp';

export default function App() {
  const [role, setRole] = useState(null); // null, 'customer', 'admin'

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
              onClick={() => setRole('admin')}
              className="rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
              style={{ backgroundColor: '#F5F2ED', border: '2px solid #E8E0D0' }}
            >
              <div className="px-8 py-12 text-center" style={{ backgroundColor: '#8B7355' }}>
                <div className="text-6xl mb-4">👨‍💼</div>
                <h2 className="text-3xl font-bold" style={{ color: '#FAF8F3' }}>Admin</h2>
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
                  Continue as Admin
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: '#6B5B47' }}>
              This is a demo application. In production, authentication would be required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'customer') {
    return (
      <div>
        <button
          onClick={() => setRole(null)}
          className="fixed top-4 right-4 z-[100] px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm shadow-sm"
          style={{ 
            backgroundColor: '#CCB26C', 
            color: '#3D2F1F',
            border: '1px solid rgba(61, 47, 31, 0.2)'
          }}
        >
          ← Change Role
        </button>
        <CustomerApp />
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div>
        <button
          onClick={() => setRole(null)}
          className="fixed top-4 right-4 z-[100] px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm shadow-sm"
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