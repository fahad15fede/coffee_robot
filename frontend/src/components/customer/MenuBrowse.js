import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

const API_BASE_URL = 'http://localhost:8000';

export default function MenuBrowse({ customer, onPlaceOrder }) {
  const [menuItems, setMenuItems] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

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
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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
      // If guest user, create customer first
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

      // Create order
      const orderResponse = await fetch(
        `${API_BASE_URL}/orders/add?customer_id=${customerId}`,
        { method: 'POST' }
      );
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const orderData = await orderResponse.json();
      const orderId = orderData.order_id;

      // Add items to order
      for (const item of cart) {
        const itemResponse = await fetch(
          `${API_BASE_URL}/order-item/add?order_id=${orderId}&item_id=${item.item_id}&quantity=${item.quantity}`,
          { method: 'POST' }
        );
        if (!itemResponse.ok) throw new Error('Failed to add item to order');
        
        const itemData = await itemResponse.json();
        const orderItemId = itemData.order_item_id;

        // Add add-ons to order item
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
      // If guest user, create customer first
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

      // Create order
      const orderResponse = await fetch(
        `${API_BASE_URL}/orders/add?customer_id=${customerId}`,
        { method: 'POST' }
      );
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const orderData = await orderResponse.json();
      const orderId = orderData.order_id;

      // Add items to order
      for (const item of cart) {
        const itemResponse = await fetch(
          `${API_BASE_URL}/order-item/add?order_id=${orderId}&item_id=${item.item_id}&quantity=${item.quantity}`,
          { method: 'POST' }
        );
        if (!itemResponse.ok) throw new Error('Failed to add item to order');
        
        const itemData = await itemResponse.json();
        const orderItemId = itemData.order_item_id;

        // Add add-ons to order item
        for (const addon of item.selectedAddOns) {
          await fetch(
            `${API_BASE_URL}/order-item-addon/add?order_item_id=${orderItemId}&addon_id=${addon.addon_id}`,
            { method: 'POST' }
          );
        }
      }

      // Open payment modal
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 text-9xl animate-float">☕</div>
          <div className="absolute bottom-0 right-0 text-8xl animate-float" style={{animationDelay: '1s'}}>☕</div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 animate-slide-up">☕ Coffee Menu</h1>
              <p className="text-amber-200 animate-slide-up" style={{animationDelay: '0.1s'}}>
                Welcome, <span className="font-semibold">{customer.name}</span>!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border-2 border-white/30 animate-scale-in">
              <p className="text-amber-200 text-sm">Cart Items</p>
              <p className="text-4xl font-bold">{cart.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 animate-scale-in ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-amber-700 to-orange-700 text-white shadow-lg'
                      : 'bg-white text-amber-900 hover:bg-amber-100 shadow-md border-2 border-amber-200'
                  }`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <MenuItem 
                  key={item.item_id} 
                  item={item} 
                  addOns={addOns}
                  onAddToCart={addToCart}
                  onAddToCartWithAddOns={addToCartWithAddOns}
                />
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24 border-2 border-amber-200 animate-scale-in">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <span>🛒</span>
                Your Cart
              </h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.cartId} className="border-b border-amber-200 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-amber-900">{item.item_name}</h3>
                            {item.selectedAddOns.length > 0 && (
                              <p className="text-xs text-gray-600">
                                + {item.selectedAddOns.map(a => a.name).join(', ')}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="bg-amber-200 hover:bg-amber-300 w-6 h-6 rounded"
                            >
                              -
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="bg-amber-200 hover:bg-amber-300 w-6 h-6 rounded"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-amber-900">
                            Rs {((item.price + item.selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-amber-300 pt-4 mb-4">
                    <div className="flex justify-between items-center text-xl font-bold text-amber-900">
                      <span>Total:</span>
                      <span>Rs {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 disabled:opacity-50 mb-3"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <button
                    onClick={handlePlaceAndPay}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <span>💳</span>
                        Place & Pay Now
                      </>
                    )}
                  </button>
                </>
              )}
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

function MenuItem({ item, addOns, onAddToCart, onAddToCartWithAddOns }) {
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-200 hover:shadow-xl transition">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3">
        <h3 className="text-xl font-bold text-white">{item.item_name}</h3>
        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
          {item.category}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <span className="text-3xl font-bold text-amber-900">Rs {item.price.toFixed(2)}</span>
        </div>

        {!showAddOns ? (
          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(item)}
              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Add to Cart
            </button>
            {addOns.length > 0 && (
              <button
                onClick={() => setShowAddOns(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold py-2 px-4 rounded-lg transition"
              >
                + Add-ons
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-2">Select Add-ons:</p>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {addOns.map(addon => (
                <label key={addon.addon_id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addon.addon_id)}
                    onChange={() => toggleAddOn(addon.addon_id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{addon.name} (+Rs {addon.price.toFixed(2)})</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddWithAddOns}
                disabled={selectedAddOns.length === 0}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  setShowAddOns(false);
                  setSelectedAddOns([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
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
