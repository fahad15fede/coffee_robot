import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: ''
  });

  // Fetch all menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/add?name=${encodeURIComponent(formData.name)}&category=${encodeURIComponent(formData.category)}&price=${formData.price}`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to add menu item');
      
      setFormData({ name: '', category: '', price: '' });
      setShowAddForm(false);
      fetchMenuItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update menu item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (formData.name) params.append('name', formData.name);
      if (formData.category) params.append('category', formData.category);
      if (formData.price) params.append('price', formData.price);
      
      const response = await fetch(
        `${API_BASE_URL}/menu/update/${editingItem.item_id}?${params.toString()}`,
        { method: 'PUT' }
      );
      
      if (!response.ok) throw new Error('Failed to update menu item');
      
      setFormData({ name: '', category: '', price: '' });
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/delete/${itemId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) throw new Error('Failed to delete menu item');
      
      fetchMenuItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.item_name,
      category: item.category,
      price: item.price.toString()
    });
    setShowAddForm(false);
  };

  // Cancel edit/add
  const cancelForm = () => {
    setFormData({ name: '', category: '', price: '' });
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold">☕ Coffee Menu Management</h1>
          <p className="mt-2 text-amber-100">Manage your coffee shop menu items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && !editingItem && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add New Menu Item
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  placeholder="e.g., Cappuccino"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  placeholder="e.g., Hot Drinks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Price (Rs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  placeholder="e.g., 4.50"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items Grid */}
        {loading && menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
            <p className="mt-4 text-amber-900">Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">No menu items yet. Add your first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.item_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-200 hover:shadow-xl transition duration-200"
              >
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3">
                  <h3 className="text-xl font-bold text-white">{item.item_name}</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <span className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-amber-900">
                      Rs {item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.item_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default MenuManagement;
