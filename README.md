# ☕ Coffee Robot - Complete Coffee Shop Management System

<div align="center">

![Coffee Robot Banner](https://img.shields.io/badge/Coffee%20Robot-Management%20System-f5cc5d?style=for-the-badge&logo=coffee&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Now-success?style=for-the-badge)](https://your-vercel-url.vercel.app)
[![API Status](https://img.shields.io/badge/API-Online-brightgreen?style=for-the-badge)](https://your-render-url.onrender.com)

**A modern, full-stack coffee shop management system with role-based access, real-time ordering, and payment processing.**

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

### 👥 **Dual Role System**
- **Customer Interface**: Browse menu, customize orders, make payments
- **Admin Dashboard**: Manage menu items, track orders, view analytics

### 🛒 **Customer Experience**
- ✅ **Smart Registration**: Login or register with duplicate-friendly system
- ✅ **Enhanced Menu**: Visual menu with product images and categories
- ✅ **Interactive Cart**: Add items, customize with add-ons, real-time totals
- ✅ **Multiple Payment Methods**: Card, Cash, Mobile, Bank Transfer
- ✅ **Order Tracking**: View order history and payment status
- ✅ **Responsive Design**: Perfect on mobile, tablet, and desktop

### 🔧 **Admin Management**
- ✅ **Menu Management**: Add, edit, delete menu items with categories
- ✅ **Order Monitoring**: Real-time order tracking and status updates
- ✅ **Payment Processing**: Handle payments and transaction records
- ✅ **Customer Database**: Manage customer information and history

### 🎨 **Modern UI/UX**
- ✅ **Golden Mustard Theme**: Warm, coffee-inspired color palette (#f5cc5d)
- ✅ **Smooth Animations**: Coffee video backgrounds and transitions
- ✅ **Mobile-First**: Fully responsive across all devices
- ✅ **Intuitive Navigation**: Clean, user-friendly interface

---

## 🚀 Live Demo

### 🌐 **Try It Now**
- **Frontend + API**: [https://coffee-robot-demo.vercel.app]([https://your-vercel-url.vercel.app](https://web-production-12d6e.up.railway.app/)) 

### 🧪 **Test Accounts**
```
Customer: Register with any email/phone
Admin: Access admin panel directly
```

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Role Selection
<img src="https://via.placeholder.com/800x400/f5cc5d/3d2817?text=Role+Selection+Screen" alt="Role Selection" width="400"/>

### 🛒 Customer Interface
<img src="https://via.placeholder.com/800x400/f5cc5d/3d2817?text=Enhanced+Menu+Browse" alt="Customer Menu" width="400"/>

### ⚙️ Admin Dashboard
<img src="https://via.placeholder.com/800x400/f5cc5d/3d2817?text=Menu+Management" alt="Admin Dashboard" width="400"/>

### 💳 Payment System
<img src="https://via.placeholder.com/800x400/f5cc5d/3d2817?text=Payment+Modal" alt="Payment System" width="400"/>

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- PostgreSQL (or use SQLite for development)

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fahad15fede/coffee_robot.git
   cd coffee_robot
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

3. **Setup Backend**
   ```bash
   cd "OOP barista coffee"
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   Backend runs on `http://localhost:8000`

4. **Access the Application**
   - Open `http://localhost:3000`
   - Choose Customer or Admin role
   - Start managing your coffee shop!

---

## 🏗️ Project Structure

```
coffee_robot/
├── 📁 frontend/                 # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 customer/     # Customer components
│   │   │   └── 📁 admin/        # Admin components
│   │   ├── 📁 assets/           # Images & videos
│   │   └── 📁 utils/            # Utility functions
│   ├── 📄 package.json
│   └── 📄 vercel.json           # Vercel config
├── 📁 OOP barista coffee/       # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 router/           # API routes
│   │   ├── 📁 model/            # Data models
│   │   ├── 📁 db_model/         # Database operations
│   │   ├── 📁 services/         # Business logic
│   │   └── 📄 main.py           # FastAPI app
│   └── 📄 requirements.txt      # Python dependencies
├── 📄 README.md
└── 📄 DEPLOYMENT_GUIDE.md       # Deployment instructions
```

---

## 🔌 API Documentation

### 🍽️ **Menu Endpoints**
```http
GET    /menu/              # Get all menu items
POST   /menu/add           # Add new menu item
PUT    /menu/update/{id}   # Update menu item
DELETE /menu/delete/{id}   # Delete menu item
```

### 👥 **Customer Endpoints**
```http
GET    /customers/         # Get all customers
POST   /customers/add      # Register new customer
GET    /customers/{id}     # Get customer details
```

### 📦 **Order Endpoints**
```http
GET    /orders/            # Get all orders
POST   /orders/add         # Create new order
POST   /orders/{id}/pay    # Process payment
PUT    /orders/{id}/status # Update order status
```

### 💰 **Payment Endpoints**
```http
POST   /payments/initiate  # Initiate payment
POST   /payments/confirm   # Confirm payment
```

**📚 Full API Documentation**: Visit `/docs` on your backend URL for interactive Swagger documentation.

---

## 🌐 Deployment

### 🚀 **One-Click Deploy**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fahad15fede/coffee_robot&project-name=coffee-robot&repository-name=coffee_robot)

### 📖 **Manual Deployment**
Follow our comprehensive deployment guides:
- [🚀 Quick Deploy (5 minutes)](./QUICK_DEPLOY.md)
- [📋 Complete Deployment Plan](./COMPLETE_DEPLOYMENT_PLAN.md)
- [✅ Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

### 🏗️ **Architecture**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Vercel    │    │    Render    │    │ PostgreSQL  │
│  (Frontend) │◄──►│  (Backend)   │◄──►│ (Database)  │
│   React     │    │   FastAPI    │    │   Render    │
└─────────────┘    └──────────────┘    └─────────────┘
```

---

## 🧪 Testing

### 🔍 **Run Tests**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd "OOP barista coffee"
python -m pytest
```

### ✅ **Test Coverage**
- Customer registration and login
- Menu browsing and cart functionality
- Payment processing
- Admin menu management
- Order tracking and status updates

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
Found a bug? [Open an issue](https://github.com/fahad15fede/coffee_robot/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### ✨ **Feature Requests**
Have an idea? [Create a feature request](https://github.com/fahad15fede/coffee_robot/issues) with:
- Detailed description
- Use case examples
- Mockups or wireframes (if applicable)

### 🔧 **Pull Requests**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Fahad Ahmed**
- GitHub: [@fahad15fede](https://github.com/fahad15fede)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **FastAPI** for the amazing Python web framework
- **React** for the powerful frontend library
- **TailwindCSS** for the utility-first CSS framework
- **Vercel** and **Render** for excellent hosting platforms
- **Coffee lovers** worldwide for the inspiration ☕

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/fahad15fede/coffee_robot?style=social)
![GitHub forks](https://img.shields.io/github/forks/fahad15fede/coffee_robot?style=social)
![GitHub issues](https://img.shields.io/github/issues/fahad15fede/coffee_robot)
![GitHub license](https://img.shields.io/github/license/fahad15fede/coffee_robot)

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!** 🌟

**Made with ❤️ and lots of ☕**

[⬆ Back to Top](#-coffee-robot---complete-coffee-shop-management-system)

</div>
