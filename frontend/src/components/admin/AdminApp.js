import React, { useState } from 'react';
import MenuManagement from '../MenuManagement';
import OrderManagement from './OrderManagement';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold">☕ Admin Dashboard</h1>
          <p className="mt-2 text-amber-100">Manage your coffee shop</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 font-semibold transition border-b-4 ${
                activeTab === 'orders'
                  ? 'border-amber-700 text-amber-900'
                  : 'border-transparent text-gray-600 hover:text-amber-900'
              }`}
            >
              📋 Order Management
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-6 font-semibold transition border-b-4 ${
                activeTab === 'menu'
                  ? 'border-amber-700 text-amber-900'
                  : 'border-transparent text-gray-600 hover:text-amber-900'
              }`}
            >
              📖 Menu Management
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'menu' && <MenuManagement />}
      </div>
    </div>
  );
}
