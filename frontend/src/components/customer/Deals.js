import React from 'react';

export default function Deals({ onBack, onNavigate }) {
  const deals = [
    {
      title: 'Happy Hour Special',
      discount: '30% OFF',
      description: 'Get 30% off on all beverages between 2 PM - 4 PM',
      icon: '🎉',
      color: 'from-pink-500 to-rose-600',
      validUntil: 'Daily',
      code: 'HAPPY30'
    },
    {
      title: 'Buy 2 Get 1 Free',
      discount: 'BOGO',
      description: 'Purchase any 2 drinks and get the 3rd one absolutely free!',
      icon: '🎁',
      color: 'from-purple-500 to-indigo-600',
      validUntil: 'This Week',
      code: 'BOGO3'
    },
    {
      title: 'First Order Bonus',
      discount: '50% OFF',
      description: 'New customers get 50% off on their first order',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-600',
      validUntil: 'One Time',
      code: 'FIRST50'
    },
    {
      title: 'Weekend Warrior',
      discount: '25% OFF',
      description: 'Enjoy 25% discount on all orders during weekends',
      icon: '🌟',
      color: 'from-blue-500 to-cyan-600',
      validUntil: 'Sat & Sun',
      code: 'WEEKEND25'
    },
    {
      title: 'Loyalty Rewards',
      discount: 'FREE DRINK',
      description: 'Earn 1 point per dollar. Get a free drink at 100 points!',
      icon: '💎',
      color: 'from-emerald-500 to-teal-600',
      validUntil: 'Always',
      code: 'LOYALTY'
    },
    {
      title: 'Student Special',
      discount: '20% OFF',
      description: 'Students get 20% off with valid student ID',
      icon: '🎓',
      color: 'from-amber-500 to-orange-600',
      validUntil: 'Always',
      code: 'STUDENT20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-9xl animate-float">🎁</div>
          <div className="absolute bottom-10 right-10 text-8xl animate-float" style={{animationDelay: '1s'}}>⭐</div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={onBack}
            className="mb-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
            🎁 Special Deals & Offers
          </h1>
          <p className="text-xl text-amber-200 animate-slide-up" style={{animationDelay: '0.1s'}}>
            Save more on your favorite coffee!
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="group animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                {/* Deal Header */}
                <div className={`bg-gradient-to-br ${deal.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">
                    {deal.icon}
                  </div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-3">{deal.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                    <div className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                      <p className="text-2xl font-bold">{deal.discount}</p>
                    </div>
                  </div>
                </div>

                {/* Deal Body */}
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                  <p className="text-gray-700 mb-4 min-h-[60px]">{deal.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-amber-600">⏰</span>
                      <span className="text-gray-600">Valid: <strong>{deal.validUntil}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">🏷️</span>
                      <code className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg font-bold text-sm">
                        {deal.code}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('menu')}
                    className={`w-full bg-gradient-to-r ${deal.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition transform group-hover:scale-105`}
                  >
                    Use This Deal →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-amber-800 to-orange-800 rounded-2xl p-12 text-center text-white shadow-2xl animate-scale-in">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-3xl font-bold mb-4">Ready to Save?</h2>
          <p className="text-xl text-amber-200 mb-6">
            Browse our menu and apply these amazing deals at checkout!
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="bg-white text-amber-900 hover:bg-amber-100 font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            Browse Menu Now
          </button>
        </div>
      </div>
    </div>
  );
}
