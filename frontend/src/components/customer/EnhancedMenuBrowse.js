import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

// Import images and videos
import bg2 from '../../assets/bg2.avif';
import americano from '../../assets/americano.png';
import cappuccino from '../../assets/Cappuccino.jpg';
import espresso from '../../assets/espresso.png';
import mocha from '../../assets/Mocha_hot.png';
import greenTea from '../../assets/green tea.png';
import teaHot from '../../assets/tea_hot.png';
import brownie from '../../assets/brownie.jpg';
import doughnut from '../../assets/doughnut.png';
import lemonade from '../../assets/lemonade.png';

// New items
import blackTeaVideo from '../../assets/black_tea.mp4';
import brownBiscuits from '../../assets/brwon_biscuits.jpg';
import chocolateSyrup from '../../assets/chocolate syrup.jpg';
import chilledLatte from '../../assets/chilled_latte.webp';
import chilledMocha from '../../assets/chilled mocha.jpg';
import whiteBread from '../../assets/white bread plain.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-12d6e.up.railway.app';

// Image mapping for menu items
const itemImages = {
  'americano': americano,
  'cappuccino': cappuccino,
  'espresso': espresso,
  'mocha': mocha,
  'green tea': greenTea,
  'tea': teaHot,
  'brownie': brownie,
  'doughnut': doughnut,
  'lemonade': lemonade,
  // New items
  'black tea': blackTeaVideo,
  'brown biscuit': brownBiscuits,
  'biscuit': brownBiscuits,
  'chocolate syrup': chocolateSyrup,
  'syrup': chocolateSyrup,
  'chilled latte': chilledLatte,
  'iced latte': chilledLatte,
  'cold latte': chilledLatte,
  'chilled mocha': chilledMocha,
  'iced mocha': chilledMocha,
  'cold mocha': chilledMocha,
  'white bread': whiteBread,
  'plain bread': whiteBread,
  'bread': whiteBread,
};

const getItemImage = (itemName) => {
  const name = itemName.toLowerCase();
  // Check for exact matches first
  if (itemImages[name]) return itemImages[name];
  
  // Then check for partial matches
  for (const [key, image] of Object.entries(itemImages)) {
    if (name.includes(key)) return image;
  }
  return cappuccino; // Default image
};

// Check if item should be displayed as video
const isVideoItem = (itemName) => {
  const name = itemName.toLowerCase();
  return name.includes('black tea');
};

export default function EnhancedMenuBrowse({ customer, onPlaceOrder }) {
  const [menuItems, setMenuItems] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-low', 'price-high'
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  useEffect(() => {
    fetchMenuItems();
    fetchAddOns();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAddOns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/addon/`);
      if (!response.ok) throw new Error('Failed to fetch add-ons');
      const data = await response.json();
      setAddOns(data.filter(a => a.available));
    } catch (err) {
      console.error('Add-ons error:', err);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = menuItems
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .filter(item => item.item_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.item_name.localeCompare(b.item_name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const addToCart = (item) => {
    const existingItem = cart.find(c => c.item_id === item.item_id && c.selectedAddOns.length === 0);
    
    if (existingItem) {
      setCart(cart.map(c => 
        c.item_id === item.item_id && c.selectedAddOns.length === 0
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, selectedAddOns: [], cartId: Date.now() }]);
    }
  };

  const addToCartWithAddOns = (item, selectedAddOnIds) => {
    const selectedAddOnsList = addOns.filter(a => selectedAddOnIds.includes(a.addon_id));
    setCart([...cart, { 
      ...item, 
      quantity: 1, 
      selectedAddOns: selectedAddOnsList,
      cartId: Date.now()
    }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(c => c.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }
    setCart(cart.map(c => c.cartId === cartId ? { ...c, quantity: newQuantity } : c));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const addOnsTotal = item.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0) * item.quantity;
      return total + itemTotal + addOnsTotal;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let customerId = customer.customer_id;
      
      if (customer.isGuest) {
        const customerResponse = await fetch(
          `${API_BASE_URL}/customers/add?name=${encodeURIComponent(customer.name)}&phone=${encodeURIComponent(customer.phone)}&email=${encodeURIComponent(customer.email)}`,
          { method: 'POST' }
        );
        
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          customerId = customerData.customer_id;
        } else {
          throw new Error('Failed to register customer. Please try again.');
        }
      }

      const orderResponse = await fetch(
        `${API_BASE_URL}/orders/add?customer_id=${customerId}`,
        { method: 'POST' }
      );
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const orderData = await orderResponse.json();
      const orderId = orderData.order_id;

      for (const item of cart) {
        const itemResponse = await fetch(
          `${API_BASE_URL}/order-item/add?order_id=${orderId}&item_id=${item.item_id}&quantity=${item.quantity}`,
          { method: 'POST' }
        );
        if (!itemResponse.ok) throw new Error('Failed to add item to order');
        
        const itemData = await itemResponse.json();
        const orderItemId = itemData.order_item_id;

        for (const addon of item.selectedAddOns) {
          await fetch(
            `${API_BASE_URL}/order-item-addon/add?order_item_id=${orderItemId}&addon_id=${addon.addon_id}`,
            { method: 'POST' }
          );
        }
      }

      onPlaceOrder(orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceAndPay = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let customerId = customer.customer_id;
      
      if (customer.isGuest) {
        const customerResponse = await fetch(
          `${API_BASE_URL}/customers/add?name=${encodeURIComponent(customer.name)}&phone=${encodeURIComponent(customer.phone)}&email=${encodeURIComponent(customer.email)}`,
          { method: 'POST' }
        );
        
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          customerId = customerData.customer_id;
        } else {
          throw new Error('Failed to register customer. Please try again.');
        }
      }

      const orderResponse = await fetch(
        `${API_BASE_URL}/orders/add?customer_id=${customerId}`,
        { method: 'POST' }
      );
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const orderData = await orderResponse.json();
      const orderId = orderData.order_id;

      for (const item of cart) {
        const itemResponse = await fetch(
          `${API_BASE_URL}/order-item/add?order_id=${orderId}&item_id=${item.item_id}&quantity=${item.quantity}`,
          { method: 'POST' }
        );
        if (!itemResponse.ok) throw new Error('Failed to add item to order');
        
        const itemData = await itemResponse.json();
        const orderItemId = itemData.order_item_id;

        for (const addon of item.selectedAddOns) {
          await fetch(
            `${API_BASE_URL}/order-item-addon/add?order_item_id=${orderItemId}&addon_id=${addon.addon_id}`,
            { method: 'POST' }
          );
        }
      }

      setCurrentOrderId(orderId);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setCart([]);
    onPlaceOrder(currentOrderId);
  };

  return (
    <div className="min-h-screen relative bg-amber-50">
      {/* Background Image - More Subtle */}
      <div className="fixed inset-0 z-0">
        <img src={bg2} alt="background" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 py-2">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg sm:text-xl font-bold flex items-center gap-1">
                  <span>☕</span>
                  Our Menu
                </h1>
                <p className="text-amber-200 text-xs">Welcome, {customer.name}!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-lg px-2 py-1 rounded-lg border border-white/30">
                  <p className="text-amber-200 text-xs">Cart</p>
                  <p className="text-lg font-bold text-center">{cart.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-3 py-3">
          {error && (
            <div className="mb-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded text-xs">
              <p className="font-bold">⚠️ Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Compact Sidebar - Filters */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-3 border border-amber-200 sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <h2 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-1">
                  <span>🔍</span>
                  Filters
                </h2>

                {/* Compact Search */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-2 py-1.5 text-xs border border-amber-300 rounded focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Compact Categories */}
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-amber-900 mb-1.5 uppercase">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-2 py-1 text-xs rounded transition ${
                          selectedCategory === category
                            ? 'bg-amber-700 text-white'
                            : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Sort */}
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-amber-900 mb-1.5 uppercase">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-amber-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low-High</option>
                    <option value="price-high">Price: High-Low</option>
                  </select>
                </div>

                {/* Compact View Toggle */}
                <div>
                  <h3 className="text-xs font-bold text-amber-900 mb-1.5 uppercase">View</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 py-1.5 text-xs rounded transition ${
                        viewMode === 'grid'
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-50 text-amber-900'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 py-1.5 text-xs rounded transition ${
                        viewMode === 'list'
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-50 text-amber-900'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Menu Items */}
            <div className="lg:col-span-6">
              <div className="mb-2">
                <p className="text-gray-600 text-xs">
                  <strong>{filteredItems.length}</strong> items
                </p>
              </div>

              {loading && menuItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-amber-900">Loading...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">No items found</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' 
                  : 'space-y-2'
                }>
                  {filteredItems.map((item, index) => (
                    <MenuItem 
                      key={item.item_id} 
                      item={item} 
                      addOns={addOns}
                      onAddToCart={addToCart}
                      onAddToCartWithAddOns={addToCartWithAddOns}
                      viewMode={viewMode}
                      index={index}
                      imageLoadingStates={imageLoadingStates}
                      setImageLoadingStates={setImageLoadingStates}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Compact Cart */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-3 border border-amber-200 sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <h2 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-1">
                  <span>🛒</span>
                  Cart
                </h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-1 opacity-50">🛒</div>
                    <p className="text-gray-500 text-xs">Empty cart</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.cartId} className="border border-amber-200 rounded p-1.5 bg-amber-50">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1 pr-1">
                              <h3 className="font-semibold text-amber-900 text-xs leading-tight">{item.item_name}</h3>
                              {item.selectedAddOns.length > 0 && (
                                <p className="text-xs text-gray-600 truncate">
                                  + {item.selectedAddOns.map(a => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-red-600 hover:text-red-800 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                className="bg-amber-300 hover:bg-amber-400 w-5 h-5 rounded text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="font-semibold w-5 text-center text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                className="bg-amber-300 hover:bg-amber-400 w-5 h-5 rounded text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-bold text-amber-900 text-xs">
                              Rs {((item.price + item.selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-amber-300 pt-2 mb-2">
                      <div className="flex justify-between items-center text-base font-bold text-amber-900">
                        <span>Total:</span>
                        <span>Rs {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold py-2 px-3 rounded-lg shadow-md transition text-xs disabled:opacity-50 mb-1.5"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>

                    <button
                      onClick={handlePlaceAndPay}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-3 rounded-lg shadow-md transition text-xs disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {loading ? 'Processing...' : (
                        <>
                          <span>💳</span>
                          Pay Now
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && currentOrderId && (
          <PaymentModal
            orderId={currentOrderId}
            totalAmount={calculateTotal()}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}

function MenuItem({ item, addOns, onAddToCart, onAddToCartWithAddOns, viewMode, index, imageLoadingStates, setImageLoadingStates }) {
  const [showAddOns, setShowAddOns] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (addonId) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleAddWithAddOns = () => {
    if (selectedAddOns.length > 0) {
      onAddToCartWithAddOns(item, selectedAddOns);
      setSelectedAddOns([]);
      setShowAddOns(false);
    }
  };

  const itemImage = getItemImage(item.item_name);
  const isVideo = isVideoItem(item.item_name);
  const isImageLoading = imageLoadingStates[item.item_id] !== false;

  const handleImageLoad = () => {
    setImageLoadingStates(prev => ({ ...prev, [item.item_id]: false }));
  };

  const handleImageError = () => {
    setImageLoadingStates(prev => ({ ...prev, [item.item_id]: false }));
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-all duration-300 flex"
        style={{animationDelay: `${index * 0.05}s`}}>
        <div className="relative w-24 h-24">
          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 animate-pulse" />
          )}
          {isVideo ? (
            <video 
              src={itemImage} 
              alt={item.item_name} 
              className={`w-full h-full object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <img 
              src={itemImage} 
              alt={item.item_name} 
              className={`w-full h-full object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
        <div className="flex-1 p-2 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-amber-900">{item.item_name}</h3>
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5">
              {item.category}
            </span>
            <p className="text-base font-bold text-amber-900 mt-1">Rs {item.price.toFixed(2)}</p>
          </div>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-semibold py-2 px-3 rounded-lg transition text-xs"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg hover:border-amber-400 transition-all duration-300"
      style={{animationDelay: `${index * 0.1}s`}}>
      {/* Image or Video */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
        {/* Loading skeleton with coffee animation */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated coffee cup */}
              <div className="text-4xl animate-bounce">☕</div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        )}
        {isVideo ? (
          <video 
            src={itemImage} 
            alt={item.item_name} 
            className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <img 
            src={itemImage} 
            alt={item.item_name} 
            className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <span className="text-amber-900 font-bold text-xs">{item.category}</span>
        </div>
        {isVideo && !isImageLoading && (
          <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="text-white text-xs">🎥</span>
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-sm font-bold text-amber-900 mb-1">{item.item_name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
            Rs {item.price.toFixed(2)}
          </span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xs">★</span>
            ))}
          </div>
        </div>

        {!showAddOns ? (
          <div className="flex gap-1">
            <button
              onClick={() => onAddToCart(item)}
              className="flex-1 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-semibold py-1.5 px-2 rounded-lg transition shadow-sm text-xs"
            >
              Add to Cart
            </button>
            {addOns.length > 0 && (
              <button
                onClick={() => setShowAddOns(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold py-1.5 px-2 rounded-lg transition border border-amber-300 text-xs"
              >
                +
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-1">Add-ons:</p>
            <div className="space-y-1 mb-2 max-h-24 overflow-y-auto">
              {addOns.map(addon => (
                <label key={addon.addon_id} className="flex items-center gap-1 cursor-pointer hover:bg-amber-100 p-1 rounded transition">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addon.addon_id)}
                    onChange={() => toggleAddOn(addon.addon_id)}
                    className="w-3 h-3"
                  />
                  <span className="text-xs">{addon.name} (+Rs {addon.price.toFixed(2)})</span>
                </label>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleAddWithAddOns}
                disabled={selectedAddOns.length === 0}
                className="flex-1 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-semibold py-1.5 px-2 rounded-lg transition disabled:opacity-50 text-xs"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddOns(false);
                  setSelectedAddOns([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1.5 px-2 rounded-lg transition text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
