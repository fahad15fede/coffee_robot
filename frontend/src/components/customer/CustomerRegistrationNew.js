import React, { useState } from 'react';
import coffeeVideo from '../../assets/cream_poured_coffee.mp4';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function CustomerRegistrationNew({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState(null); // 'login' or 'register'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        // Login: Find existing customer by phone or email
        const response = await fetch(`${API_BASE_URL}/customers/`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        
        const customers = await response.json();
        const existingCustomer = customers.find(
          c => c.phone === formData.phone || c.email === formData.email
        );

        if (existingCustomer) {
          // Found existing customer - login without creating new record
          onRegister({
            name: existingCustomer.customer_name,
            phone: existingCustomer.phone,
            email: existingCustomer.email,
            customer_id: existingCustomer.customer_id
          });
        } else {
          throw new Error('No account found with this phone or email. Please register first.');
        }
      } else {
        // Register: Create new customer
        const response = await fetch(
          `${API_BASE_URL}/customers/add?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}`,
          { method: 'POST' }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to register. Please try again.');
        }

        const data = await response.json();
        onRegister({ 
          ...formData, 
          customer_id: data.customer_id 
        });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 0 && formData.name && mode === 'register') setStep(1);
    else if (step === 0 && (formData.phone || formData.email) && mode === 'login') {
      // For login, we can proceed with just phone or email
      handleSubmit({ preventDefault: () => {} });
    }
    else if (step === 1 && formData.phone) setStep(2);
  };

  // If no mode selected, show mode selection
  if (!mode) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background - More Visible */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={coffeeVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-orange-800/60 to-amber-950/70"></div>
        </div>

        {/* Animated Overlay Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl w-full text-center">
            {/* Logo and Title */}
            <div className="mb-8 sm:mb-12 animate-slide-up">
              <div className="coffee-steam inline-block mb-4 sm:mb-6">
                <div className="text-6xl sm:text-8xl lg:text-9xl animate-float">☕</div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl px-4">
                Coffee Haven
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-white font-light drop-shadow-lg px-4">
                Where every cup tells a story
              </p>
            </div>

            {/* Mode Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4">
              {/* Login Button */}
              <button
                onClick={() => setMode('login')}
                className="group bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-3 sm:border-4 border-amber-300 hover:border-amber-500 transition-all duration-300 transform hover:scale-105 animate-scale-in"
              >
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 sm:p-8 text-white">
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">
                    🔑
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Login</h2>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                  <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4">
                    Already have an account?
                  </p>
                  <ul className="text-left space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span>Quick access with phone/email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span>No duplicate accounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span>View your order history</span>
                    </li>
                  </ul>
                </div>
              </button>

              {/* Register Button */}
              <button
                onClick={() => setMode('register')}
                className="group bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-3 sm:border-4 border-amber-300 hover:border-amber-500 transition-all duration-300 transform hover:scale-105 animate-scale-in"
                style={{animationDelay: '0.1s'}}
              >
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 sm:p-8 text-white">
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Register</h2>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                  <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4">
                    New to Coffee Haven?
                  </p>
                  <ul className="text-left space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-amber-600 flex-shrink-0">✓</span>
                      <span>Create your account</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-600 flex-shrink-0">✓</span>
                      <span>Start ordering coffee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-amber-600 flex-shrink-0">✓</span>
                      <span>Earn loyalty points</span>
                    </li>
                  </ul>
                </div>
              </button>
            </div>

            {/* Info Text */}
            <p className="mt-6 sm:mt-8 text-white/80 text-base sm:text-lg animate-fade-in px-4">
              Choose how you'd like to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background - More Visible */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src={coffeeVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-800/75 to-amber-950/80"></div>
      </div>

      {/* Animated Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Coffee Beans Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 text-9xl animate-float">☕</div>
        <div className="absolute top-20 right-20 text-7xl animate-float" style={{animationDelay: '0.5s'}}>☕</div>
        <div className="absolute bottom-20 left-20 text-8xl animate-float" style={{animationDelay: '1s'}}>☕</div>
        <div className="absolute bottom-40 right-40 text-6xl animate-float" style={{animationDelay: '1.5s'}}>☕</div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="text-white space-y-6 animate-slide-up">
            <div className="relative inline-block">
              <div className="coffee-steam">
                <div className="text-8xl mb-4 animate-float">☕</div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
              Coffee Haven
            </h1>
            <p className="text-3xl text-amber-100 font-light drop-shadow-md">
              Where every cup tells a story
            </p>
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4 text-amber-100 transform hover:translate-x-2 transition-transform">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-amber-400">
                  ✓
                </div>
                <span className="text-xl font-medium">Premium Coffee Blends</span>
              </div>
              <div className="flex items-center gap-4 text-amber-100 transform hover:translate-x-2 transition-transform">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-amber-400">
                  ✓
                </div>
                <span className="text-xl font-medium">Custom Add-ons Available</span>
              </div>
              <div className="flex items-center gap-4 text-amber-100 transform hover:translate-x-2 transition-transform">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-amber-400">
                  ✓
                </div>
                <span className="text-xl font-medium">Fast & Easy Ordering</span>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="animate-scale-in">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-200">
              {/* Progress Bar */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-2">
                <div 
                  className="bg-gradient-to-r from-amber-300 to-yellow-300 h-full transition-all duration-500"
                  style={{ width: `${(step + 1) * 33.33}%` }}
                ></div>
              </div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <button
                    onClick={() => setMode(null)}
                    className="mb-4 text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-2 mx-auto"
                  >
                    ← Back to selection
                  </button>
                  <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-3 sm:mb-4">
                    <span className="text-4xl sm:text-5xl">{mode === 'login' ? '🔑' : '🎉'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                    {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    {mode === 'login' 
                      ? 'Enter your phone or email to login' 
                      : "Let's get you started with your order"}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-slide-up">
                    <p className="font-bold">⚠️ Oops!</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Login Mode - Phone or Email Only */}
                  {mode === 'login' && (
                    <>
                      <div className="transition-all duration-500 animate-slide-up">
                        <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <span className="text-lg sm:text-xl">📱</span>
                          <span className="text-sm sm:text-base">Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 sm:border-3 border-amber-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition text-base sm:text-lg"
                          placeholder="0328-0334013"
                        />
                      </div>

                      <div className="text-center text-gray-500 text-sm sm:text-base">OR</div>

                      <div className="transition-all duration-500 animate-slide-up">
                        <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <span className="text-lg sm:text-xl">📧</span>
                          <span className="text-sm sm:text-base">Email Address</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 sm:border-3 border-amber-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition text-base sm:text-lg"
                          placeholder="john@example.com"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || (!formData.phone && !formData.email)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg animate-slide-up"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            Logging in...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Login 🔑
                          </span>
                        )}
                      </button>
                    </>
                  )}

                  {/* Register Mode - Full Form */}
                  {mode === 'register' && (
                    <>
                      {/* Step 0: Name */}
                      <div className={`transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}>
                        <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <span className="text-xl">👤</span>
                          What's your name?
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                          required
                          disabled={step > 0}
                          className="w-full px-6 py-4 border-3 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition text-lg disabled:bg-gray-100"
                          placeholder="John Doe"
                        />
                        {step === 0 && formData.name && (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="mt-3 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105"
                          >
                            Continue →
                          </button>
                        )}
                      </div>

                      {/* Step 1: Phone */}
                      {step >= 1 && (
                        <div className={`transition-all duration-500 animate-slide-up ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                          <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <span className="text-xl">📱</span>
                            Your phone number?
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                            required
                            disabled={step > 1}
                            className="w-full px-6 py-4 border-3 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition text-lg disabled:bg-gray-100"
                            placeholder="+1 234 567 8900"
                          />
                          {step === 1 && formData.phone && (
                            <button
                              type="button"
                              onClick={nextStep}
                              className="mt-3 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105"
                            >
                              Continue →
                            </button>
                          )}
                        </div>
                      )}

                      {/* Step 2: Email */}
                      {step >= 2 && (
                        <div className="transition-all duration-500 animate-slide-up">
                          <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <span className="text-xl">📧</span>
                            And your email?
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-6 py-4 border-3 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-200 transition text-lg"
                            placeholder="john@example.com"
                          />
                        </div>
                      )}

                      {step >= 2 && (
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg animate-slide-up"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating your account...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Create Account 🚀
                            </span>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    {mode === 'login' 
                      ? "✨ Don't have an account? Go back and choose Register"
                      : "✨ Already registered? Go back and choose Login"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
