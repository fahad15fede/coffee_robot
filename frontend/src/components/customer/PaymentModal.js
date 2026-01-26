import React, { useState } from 'react';
import coffeeVideo from '../../assets/cream_poured_coffee.mp4';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PaymentModal({ orderId, totalAmount, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', color: 'from-blue-500 to-blue-700' },
    { id: 'cash', name: 'Cash on Delivery', icon: '💰', color: 'from-green-500 to-green-700' },
    { id: 'mobile', name: 'Mobile Payment', icon: '📱', color: 'from-purple-500 to-purple-700' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: 'from-orange-500 to-orange-700' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark order as paid
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/pay`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Payment failed');
      }

      setSuccess(true);
      
      // Show success animation then close
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      alert('Payment failed: ' + err.message);
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
          {/* Success Animation */}
          <div className="relative">
            <video
              autoPlay
              loop
              muted
              className="w-full h-64 object-cover"
            >
              <source src={coffeeVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4 animate-scale-in">✅</div>
                <h2 className="text-4xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-xl text-green-200">Your order is confirmed</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 text-center">
            <p className="text-gray-700 mb-4">Thank you for your payment!</p>
            <div className="text-3xl font-bold text-green-600">
              Rs {totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        {/* Header with Video Background */}
        <div className="relative h-48 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src={coffeeVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h2 className="text-3xl font-bold text-white mb-2">Complete Payment</h2>
              <p className="text-amber-200">Order #{orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white mb-6 text-center">
            <p className="text-lg mb-2">Total Amount</p>
            <p className="text-5xl font-bold">Rs {totalAmount.toFixed(2)}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === method.id
                      ? `border-amber-600 bg-gradient-to-br ${method.color} text-white shadow-lg`
                      : 'border-amber-200 bg-white hover:border-amber-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{method.icon}</div>
                  <p className={`font-semibold text-sm ${
                    paymentMethod === method.id ? 'text-white' : 'text-amber-900'
                  }`}>
                    {method.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details Form (if card selected) */}
          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4 animate-slide-up">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other Payment Method Info */}
          {paymentMethod && paymentMethod !== 'card' && (
            <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 animate-slide-up">
              <p className="text-amber-900">
                {paymentMethod === 'cash' && '💰 Pay with cash when your order is delivered.'}
                {paymentMethod === 'mobile' && '📱 You will receive a payment link on your mobile.'}
                {paymentMethod === 'bank' && '🏦 Bank transfer details will be sent to your email.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || processing}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Pay Rs {totalAmount.toFixed(2)} 💳
                </span>
              )}
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>🔒</span>
              Secure payment powered by Coffee Shop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
