import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export default function CustomerRegistration({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGuestOption, setShowGuestOption] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Always create a new customer record (allows duplicates)
      const response = await fetch(
        `${API_BASE_URL}/customers/add?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to register. Please try again.');
      }

      const data = await response.json();
      
      // Always proceed to ordering, even if customer exists
      onRegister({ 
        ...formData, 
        customer_id: data.customer_id 
      });
    } catch (err) {
      // Show error but don't block the user
      console.error('Registration error:', err);
      setError(err.message);
      
      // Show guest option if registration fails
      setShowGuestOption(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestOrder = () => {
    // Allow ordering as guest with temporary ID
    onRegister({ 
      ...formData, 
      customer_id: Date.now(), // Temporary ID for guest
      isGuest: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200">
          <div className="bg-gradient-to-r from-amber-700 to-amber-800 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">☕ Welcome!</h1>
            <p className="text-amber-100">Enter your details to start ordering</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                {showGuestOption && (
                  <button
                    type="button"
                    onClick={handleGuestOrder}
                    className="mt-2 text-sm underline hover:text-red-900"
                  >
                    Continue as guest instead
                  </button>
                )}
              </div>
            )}

            <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-3 rounded text-sm">
              <p>💡 <strong>Note:</strong> You can register each time you visit. We'll save your info for this order.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Start Ordering'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already registered? No problem! Just enter your details again.
          </p>
        </div>
      </div>
    </div>
  );
}
