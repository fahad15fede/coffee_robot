# Coffee Shop Management System - Setup Instructions

## Overview

This is a complete role-based coffee shop management system with:
- **Customer Interface**: Browse menu, add items to cart, customize with add-ons, place and pay for orders
- **Admin Interface**: Manage menu items, view and manage orders, update order status

## Backend Setup (FastAPI)

1. Navigate to the backend directory:
```bash
cd "OOP barista coffee"
```

2. Install dependencies (if not already installed):
```bash
pip install fastapi uvicorn sqlalchemy
```

3. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at: http://localhost:8000

## Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open at: http://localhost:3000

## Using the Application

### Role Selection
When you first open the app, you'll see a role selection screen:
- Click **Customer** to access the customer ordering interface
- Click **Admin** to access the admin management dashboard

### Customer Flow

1. **Registration**: Enter your name, phone, and email
2. **Browse Menu**: 
   - View all menu items organized by category
   - Filter by category using the buttons
   - See prices and item details
3. **Add to Cart**:
   - Click "Add to Cart" for quick add
   - Click "+ Add-ons" to customize with extras (milk, syrup, etc.)
   - Adjust quantities in the cart
4. **Place Order**: Review your cart and click "Place Order"
5. **Payment**: View order summary and click "Pay Now" to complete payment
6. **New Order**: After payment, you can place another order

### Admin Dashboard

#### Order Management Tab
- View all orders in real-time
- Click on any order to see full details
- Update order status (pending → preparing → ready → completed)
- View customer information and order items
- Cancel orders if needed

#### Menu Management Tab
- View all menu items in a card grid
- Add new menu items with name, category, and price
- Edit existing items
- Delete items from the menu
- All changes are immediately reflected in the customer interface

## API Endpoints

### Customer Endpoints
- `POST /customers/add` - Register new customer
- `GET /menu/` - Get all menu items
- `GET /addon/` - Get all add-ons
- `POST /orders/add` - Create new order
- `POST /order-item/add` - Add item to order
- `POST /order-item-addon/add` - Add add-on to order item
- `GET /orders/{order_id}/summary` - Get order details
- `POST /orders/{order_id}/pay` - Process payment

### Admin Endpoints
- `GET /orders/` - Get all orders
- `PUT /orders/{order_id}/status` - Update order status
- `DELETE /orders/delete/{order_id}` - Cancel order
- `POST /menu/add` - Add menu item
- `PUT /menu/update/{item_id}` - Update menu item
- `DELETE /menu/delete/{item_id}` - Delete menu item

## Features

### Customer Features
✓ User registration with contact details
✓ Browse menu by category
✓ Add items to cart with quantity control
✓ Customize orders with add-ons
✓ Real-time cart total calculation
✓ Order confirmation with detailed summary
✓ Secure payment processing
✓ Order history view

### Admin Features
✓ Real-time order monitoring
✓ Order status management workflow
✓ Detailed order information display
✓ Menu item CRUD operations
✓ Category-based organization
✓ Sales tracking
✓ Order cancellation

## Troubleshooting

- If you get CORS errors, make sure the backend is running on port 8000
- If the frontend doesn't connect, verify the API_BASE_URL in component files matches your backend URL
- Make sure both servers are running simultaneously
- Clear browser cache if you see stale data
- Check browser console for detailed error messages
