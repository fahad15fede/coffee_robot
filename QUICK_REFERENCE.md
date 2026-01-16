# Quick Reference Card

## 🚀 Start System (3 Commands)

```bash
# 1. Fix Database (First Time Only)
cd "OOP barista coffee"
python fix_database_constraints.py

# 2. Start Backend
uvicorn app.main:app --reload --port 8000

# 3. Start Frontend (New Terminal)
cd frontend
npm start
```

Open: **http://localhost:3000**

---

## 🎯 Key Features

| Feature | Location | Description |
|---------|----------|-------------|
| 🎬 Video Registration | Entry page | Coffee video background |
| 📱 Dashboard | After login | Stats, quick actions, orders |
| 🛒 Menu & Cart | Browse Menu | Add items, customize, checkout |
| 💳 Payment | Cart or Confirmation | 4 methods, video modal |
| 📦 My Orders | Dashboard → Orders | View all orders, details |
| 🎁 Deals | Dashboard → Deals | 6 offers with promo codes |
| 💰 Payments | Dashboard → Payments | Transaction history |

---

## 💳 Payment Options

| Method | Icon | Details Required |
|--------|------|------------------|
| Credit Card | 💳 | Card number, name, expiry, CVV |
| Cash | 💰 | None - pay on delivery |
| Mobile Pay | 📱 | None - link sent to phone |
| Bank Transfer | 🏦 | None - details sent to email |

---

## 🎨 Color Codes

| Status | Color | Gradient |
|--------|-------|----------|
| Pending | Yellow | `from-yellow-400 to-yellow-600` |
| Preparing | Blue | `from-blue-400 to-blue-600` |
| Ready | Green | `from-green-400 to-green-600` |
| Paid | Emerald | `from-emerald-400 to-emerald-600` |
| Completed | Gray | `from-gray-400 to-gray-600` |

---

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Duplicate phone error | Run `fix_database_constraints.py` |
| Payment 400 error | Check if order already paid |
| Video not playing | Verify file at `frontend/src/assets/cream_poured_coffee.mp4` |
| CORS error | Backend must be on port 8000 |
| Port in use | Kill process and restart |

---

## 📱 User Flow

```
Registration (video) 
    ↓
Dashboard (hub)
    ↓
┌───────┬──────────┬─────────┬──────────┐
│ Menu  │ Orders   │ Deals   │ Payments │
└───────┴──────────┴─────────┴──────────┘
    ↓
Cart → Place Order OR Place & Pay Now
    ↓
Payment Modal (video) → Success → Confirmation
```

---

## 🎬 Video Locations

| Page | Video Usage |
|------|-------------|
| Registration | Full-screen background |
| Payment Modal | Header background |
| Payment Success | Overlay with checkmark |

---

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/customers/add` | Register customer |
| GET | `/menu/` | Get menu items |
| GET | `/addon/` | Get add-ons |
| POST | `/orders/add` | Create order |
| POST | `/order-item/add` | Add item to order |
| POST | `/orders/{id}/pay` | Process payment |
| GET | `/orders/{id}/summary` | Get order details |

---

## 🎯 Testing Checklist

- [ ] Video plays on registration
- [ ] Can register with duplicate phone
- [ ] Dashboard loads with stats
- [ ] Menu items display
- [ ] Cart functions
- [ ] Payment modal opens
- [ ] Payment succeeds
- [ ] Order status updates
- [ ] All animations smooth

---

## 💡 Pro Tips

1. **Clear cache** if issues occur
2. **Check both terminals** for errors
3. **Run database fix first** before testing
4. **Use Chrome/Firefox** for best video support
5. **Test payment with new orders** only

---

## 📞 Quick Help

| Issue | Check |
|-------|-------|
| Registration fails | Database fix applied? |
| Payment fails | Order already paid? |
| Video missing | File in assets folder? |
| API errors | Backend running? |
| Blank pages | Frontend running? |

---

## 🎉 Success Indicators

✅ Coffee video plays on registration
✅ Duplicate phone registration works
✅ Dashboard shows stats
✅ Payment modal has video
✅ Success animation plays
✅ Order status updates
✅ All pages navigate smoothly

---

## 📦 File Structure

```
Coffee_Robot_Website/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── cream_poured_coffee.mp4
│   │   └── components/
│   │       ├── customer/
│   │       │   ├── CustomerRegistrationNew.js
│   │       │   ├── CustomerDashboard.js
│   │       │   ├── PaymentModal.js
│   │       │   ├── MyOrders.js
│   │       │   ├── Deals.js
│   │       │   └── PaymentHistory.js
│   │       └── admin/
│   └── package.json
└── OOP barista coffee/
    ├── app/
    │   ├── main.py
    │   ├── router/
    │   └── db_model/
    ├── fix_database_constraints.py
    └── RUN_DATABASE_FIX.bat
```

---

## 🚀 One-Line Commands

```bash
# Fix database
cd "OOP barista coffee" && python fix_database_constraints.py

# Start backend
cd "OOP barista coffee" && uvicorn app.main:app --reload --port 8000

# Start frontend
cd frontend && npm start

# Check if ports are in use (Windows)
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

---

## 🎨 Animation Classes

```css
animate-float      /* Floating effect */
animate-fade-in    /* Fade in */
animate-slide-up   /* Slide up */
animate-scale-in   /* Scale in */
coffee-steam       /* Steam effect */
```

---

## 📱 Responsive Breakpoints

| Size | Breakpoint | Columns |
|------|------------|---------|
| Mobile | < 768px | 1 |
| Tablet | 768px - 1024px | 2 |
| Desktop | > 1024px | 3-4 |

---

## 🎯 Key Shortcuts

| Action | Shortcut |
|--------|----------|
| Logout | Top-right button |
| Back to Dashboard | Top-left button |
| Change Role | Top-right button |
| Close Modal | X or Cancel |

---

**Need more help?** Check:
- `COMPLETE_SETUP_GUIDE.md` - Full setup instructions
- `DATABASE_FIX_INSTRUCTIONS.md` - Database fix details
- `FIXES_SUMMARY.md` - What was fixed
- `WHATS_NEW.md` - Latest features

☕ Enjoy your coffee shop system! ✨
