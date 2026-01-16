# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
cd "OOP barista coffee"
uvicorn app.main:app --reload --port 8000
```

### Step 2: Start Frontend
```bash
cd frontend
npm start
```

### Step 3: Open Browser
Navigate to: http://localhost:3000

## 🎭 Try Both Roles

### As Customer:
1. Click "Customer" on role selection
2. Fill in registration form
3. Browse menu and add items to cart
4. Customize with add-ons
5. Place order and pay

### As Admin:
1. Click "Admin" on role selection
2. Go to "Order Management" tab to see customer orders
3. Update order status (pending → preparing → ready → completed)
4. Go to "Menu Management" tab to add/edit/delete items

## 💡 Quick Tips

- **Switch Roles**: Click "← Change Role" button in top-right corner
- **Refresh Orders**: Click "Refresh" button in admin order list
- **Add-ons**: In customer view, click "+ Add-ons" button on menu items
- **Cart Updates**: Use +/- buttons to adjust quantities
- **Order Status**: Admin can track orders through complete workflow

## 🎨 What You'll See

**Customer Interface**:
- Clean menu browsing with category filters
- Shopping cart with real-time totals
- Order confirmation with payment option

**Admin Dashboard**:
- Two-panel order management (list + details)
- Menu management with CRUD operations
- Status tracking for all orders

## ⚠️ Important Notes

- Both backend (port 8000) and frontend (port 3000) must be running
- CORS is configured to allow localhost:3000 → localhost:8000
- This is a demo - no real authentication implemented
- All data is stored in your backend database

## 🐛 Common Issues

**"Failed to fetch"**: Backend not running or wrong port
**CORS Error**: Check backend CORS middleware configuration
**Empty Menu**: Add menu items via Admin → Menu Management first
**No Orders**: Place an order as Customer first

Enjoy your coffee shop management system! ☕
