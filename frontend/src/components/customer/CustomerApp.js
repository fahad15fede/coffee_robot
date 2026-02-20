import React, { useState } from 'react';
import CustomerRegistrationNew from './CustomerRegistrationNew';
import CustomerDashboard from './CustomerDashboard';
import EnhancedMenuBrowse from './EnhancedMenuBrowse';
import OrderConfirmation from './OrderConfirmation';
import MyOrders from './MyOrders';
import Deals from './Deals';
import PaymentHistory from './PaymentHistory';

export default function CustomerApp({ onChangeRole }) {
  const [customer, setCustomer] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [view, setView] = useState('registration'); // registration, dashboard, menu, confirmation, orders, deals, payments

  const handleRegister = (customerData) => {
    setCustomer(customerData);
    setView('dashboard');
  };

  const handlePlaceOrder = (orderId) => {
    setCurrentOrderId(orderId);
    setView('confirmation');
  };

  const handleNavigate = (destination) => {
    setView(destination);
  };

  const handleLogout = () => {
    setCustomer(null);
    setCurrentOrderId(null);
    setView('registration');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  const handleNewOrder = () => {
    setCurrentOrderId(null);
    setView('dashboard');
  };

  if (view === 'registration') {
    return <CustomerRegistrationNew onRegister={handleRegister} onChangeRole={onChangeRole} />;
  }

  if (view === 'dashboard') {
    return (
      <CustomerDashboard 
        customer={customer} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'menu') {
    return (
      <div>
        <button
          onClick={handleBackToDashboard}
          className="fixed top-4 left-4 z-50 bg-white/90 hover:bg-white text-amber-900 font-bold p-3 rounded-lg shadow-lg border-2 border-amber-300 transition-all duration-200 hover:scale-110"
          style={{ width: '48px', height: '48px' }}
        >
          ←
        </button>
        <EnhancedMenuBrowse customer={customer} onPlaceOrder={handlePlaceOrder} />
      </div>
    );
  }

  if (view === 'confirmation') {
    return (
      <OrderConfirmation 
        customer={customer} 
        orderId={currentOrderId} 
        onNewOrder={handleNewOrder}
      />
    );
  }

  if (view === 'orders') {
    return <MyOrders customer={customer} onBack={handleBackToDashboard} />;
  }

  if (view === 'deals') {
    return <Deals onBack={handleBackToDashboard} onNavigate={handleNavigate} />;
  }

  if (view === 'payments') {
    return <PaymentHistory customer={customer} onBack={handleBackToDashboard} />;
  }

  return null;
}
