import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-12d6e.up.railway.app';

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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9e7 0%, #fdf4d9 50%, #fef5dc 100%)' }}>
      {/* Header - Golden Mustard Theme */}
      <div className="shadow-md sticky top-0 z-10" style={{ background: 'linear-gradient(90deg, #d4a843 0%, #f5cc5d 50%, #d4a843 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: '#3d2817' }}>
                <span className="text-4xl">☕</span>
                Menu Management
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#5c3d2e' }}>Manage your coffee shop menu items</p>
            </div>
            <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: 'rgba(61, 40, 23, 0.15)', borderColor: 'rgba(61, 40, 23, 0.3)' }}>
              <p className="text-xs font-semibold" style={{ color: '#5c3d2e' }}>Total Items</p>
              <p className="text-2xl font-bold text-center" style={{ color: '#3d2817' }}>{menuItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 border-l-4 p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#fee', borderColor: '#c33', color: '#811' }}>
            <p className="font-bold text-sm">⚠️ Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && !editingItem && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="font-semibold py-3 px-6 rounded-lg shadow-sm transition duration-200 flex items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #d4a843 0%, #f5cc5d 100%)',
                color: '#3d2817'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #c49a3a 0%, #e5bc4d 100%)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #d4a843 0%, #f5cc5d 100%)'}
            >
              <span className="text-xl">+</span>
              Add New Menu Item
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <div className="mb-6 rounded-lg shadow-md p-5 border" style={{ 
            background: 'linear-gradient(135deg, #fffef8 0%, #fef9e7 100%)',
            borderColor: '#f5cc5d'
          }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#3d2817' }}>
              <span>{editingItem ? '✏️' : '➕'}</span>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3d2817' }}>
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none text-sm"
                  style={{ border: '1px solid #f5cc5d' }}
                  onFocus={(e) => e.target.style.borderColor = '#d4a843'}
                  onBlur={(e) => e.target.style.borderColor = '#f5cc5d'}
                  placeholder="e.g., Cappuccino"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3d2817' }}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none text-sm"
                  style={{ border: '1px solid #f5cc5d' }}
                  onFocus={(e) => e.target.style.borderColor = '#d4a843'}
                  onBlur={(e) => e.target.style.borderColor = '#f5cc5d'}
                  placeholder="e.g., Hot Drinks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3d2817' }}>
                  Price (Rs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required={!editingItem}
                  className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none text-sm"
                  style={{ border: '1px solid #f5cc5d' }}
                  onFocus={(e) => e.target.style.borderColor = '#d4a843'}
                  onBlur={(e) => e.target.style.borderColor = '#f5cc5d'}
                  placeholder="e.g., 4.50"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="font-semibold py-2 px-5 rounded-lg shadow-sm transition duration-200 disabled:opacity-50 text-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #d4a843 0%, #f5cc5d 100%)',
                    color: '#3d2817'
                  }}
                >
                  {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="font-semibold py-2 px-5 rounded-lg shadow-sm transition duration-200 text-sm"
                  style={{ backgroundColor: '#6b5d52', color: 'white' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4d42'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b5d52'}
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-t-transparent" style={{ borderColor: '#f5cc5d', borderTopColor: 'transparent' }}></div>
            <p className="mt-3 text-sm" style={{ color: '#3d2817' }}>Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12 rounded-lg shadow-sm border" style={{ 
            background: 'linear-gradient(135deg, #fffef8 0%, #fef9e7 100%)',
            borderColor: '#f5cc5d'
          }}>
            <div className="text-6xl mb-3 opacity-30">☕</div>
            <p className="text-lg" style={{ color: '#6b5d52' }}>No menu items yet. Add your first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.item_id}
                className="rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition duration-200"
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fefbf0 100%)',
                  borderColor: '#f5cc5d'
                }}
              >
                {/* Card Header */}
                <div className="px-4 py-3 border-b-2" style={{ 
                  background: 'linear-gradient(90deg, #d4a843 0%, #f5cc5d 50%, #d4a843 100%)',
                  borderBottomColor: 'rgba(61, 40, 23, 0.2)'
                }}>
                  <h3 className="text-lg font-bold truncate" style={{ color: '#3d2817' }}>{item.item_name}</h3>
                </div>
                
                {/* Card Body */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border" style={{ 
                      backgroundColor: '#fef9e7',
                      color: '#5c3d2e',
                      borderColor: '#f5cc5d'
                    }}>
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="mb-4 p-3 rounded-lg border" style={{ 
                    background: 'linear-gradient(135deg, #fef9e7 0%, #fef5dc 100%)',
                    borderColor: '#f5cc5d'
                  }}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#5c3d2e' }}>Price</p>
                    <span className="text-2xl font-bold" style={{ color: '#3d2817' }}>
                      Rs {item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex-1 font-semibold py-2 px-3 rounded-lg transition duration-200 text-sm shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #d4a843 0%, #f5cc5d 100%)',
                        color: '#3d2817'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #c49a3a 0%, #e5bc4d 100%)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #d4a843 0%, #f5cc5d 100%)'}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.item_id)}
                      className="flex-1 font-semibold py-2 px-3 rounded-lg transition duration-200 text-sm shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #c44 0%, #d55 100%)',
                        color: 'white'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #b33 0%, #c44 100%)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #c44 0%, #d55 100%)'}
                    >
                      🗑️ Delete
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
