import React, { useState } from 'react';
import CustomerApp from './components/customer/CustomerApp';
import AdminApp from './components/admin/AdminApp';

export default function App() {
  const [role, setRole] = useState(null); // null, 'customer', 'admin'

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-amber-900 mb-4">☕ Coffee Shop</h1>
            <p className="text-xl text-amber-700">Welcome! Please select your role</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Card */}
            <div
              onClick={() => setRole('customer')}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200 hover:border-amber-500 cursor-pointer transform hover:scale-105 transition duration-300"
            >
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold text-white">Customer</h2>
              </div>
              <div className="p-8">
                <ul className="space-y-3 text-amber-900">
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
                <button className="w-full mt-6 bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-lg transition">
                  Continue as Customer
                </button>
              </div>
            </div>

            {/* Admin Card */}
            <div
              onClick={() => setRole('admin')}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200 hover:border-amber-500 cursor-pointer transform hover:scale-105 transition duration-300"
            >
              <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-8 py-12 text-center">
                <div className="text-6xl mb-4">👨‍💼</div>
                <h2 className="text-3xl font-bold text-white">Admin</h2>
              </div>
              <div className="p-8">
                <ul className="space-y-3 text-amber-900">
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
                <button className="w-full mt-6 bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-6 rounded-lg transition">
                  Continue as Admin
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
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
          className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[100] bg-white hover:bg-gray-100 text-amber-900 font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg shadow-lg border-2 border-amber-300 transition text-xs sm:text-sm"
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
          className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[100] bg-white hover:bg-gray-100 text-amber-900 font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg shadow-lg border-2 border-amber-300 transition text-xs sm:text-sm"
        >
          ← Change Role
        </button>
        <AdminApp />
      </div>
    );
  }

  return null;
}