# API URL Configuration Guide

## 🎯 Your Current Setup

Your Coffee Shop app is deployed as a **single service** on Railway:
- **URL**: `https://web-production-12d6e.up.railway.app`
- **Frontend**: React app (served as static files)
- **Backend**: FastAPI (serves API endpoints)
- **Database**: Separate PostgreSQL service

## ✅ Correct Configuration

### Production (Railway):
```
REACT_APP_API_URL=
```
**OR**
```
REACT_APP_API_URL=https://web-production-12d6e.up.railway.app
```

Both work because frontend and backend are on the **same domain**.

### Development (Local):
```
REACT_APP_API_URL=http://localhost:8000
```

## 🔧 How It Works

### Option 1: Empty String (Recommended)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
```

**API Calls:**
- `/menu/` → `https://web-production-12d6e.up.railway.app/menu/`
- `/orders/` → `https://web-production-12d6e.up.railway.app/orders/`

**Benefits:**
- ✅ No CORS issues
- ✅ Works if domain changes
- ✅ Cleaner URLs
- ✅ Automatic domain detection

### Option 2: Full URL
```javascript
const API_BASE_URL = 'https://web-production-12d6e.up.railway.app';
```

**API Calls:**
- `https://web-production-12d6e.up.railway.app/menu/`
- `https://web-production-12d6e.up.railway.app/orders/`

**Benefits:**
- ✅ Explicit configuration
- ✅ Easy to understand
- ⚠️ Need to update if domain changes

## 📁 Configuration Files

### `.env.production` (Railway)
```env
REACT_APP_API_URL=
```

### `.env.development` (Local - Optional)
```env
REACT_APP_API_URL=http://localhost:8000
```

### `src/config.js` (Smart Configuration)
```javascript
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return ''; // Relative URLs in production
  }
  
  return 'http://localhost:8000'; // Localhost in development
};

export const API_BASE_URL = getApiBaseUrl();
```

## 🚀 Railway Environment Variables

In Railway Dashboard → Web Service → Variables:

**Current Variables:**
```
DATABASE_URL=postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway
REACT_APP_API_URL=https://web-production-12d6e.up.railway.app
```

**Recommended:**
```
DATABASE_URL=postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway
REACT_APP_API_URL=
```

## 🧪 Testing

### Test API Calls:
1. **Open Browser Console** on your Railway app
2. **Check Network Tab**
3. **Look for API calls:**
   - Should go to: `https://web-production-12d6e.up.railway.app/menu/`
   - NOT to: `http://localhost:8000/menu/`

### Test Locally:
1. **Run backend:** `cd "OOP barista coffee" && python -m uvicorn app.main:app --reload`
2. **Run frontend:** `cd frontend && npm start`
3. **API calls should go to:** `http://localhost:3000` → `http://localhost:8000/menu/`

## ❌ Common Mistakes

### ❌ Wrong: Using localhost in production
```env
REACT_APP_API_URL=http://localhost:8000
```
**Result:** API calls fail in production

### ❌ Wrong: Using Railway URL in development
```env
# In local .env
REACT_APP_API_URL=https://web-production-12d6e.up.railway.app
```
**Result:** Local development calls production API

### ✅ Correct: Environment-specific URLs
```env
# .env.production
REACT_APP_API_URL=

# .env.development (or use default in code)
REACT_APP_API_URL=http://localhost:8000
```

## 🎯 Summary

**Your Setup:**
- ✅ Frontend + Backend on same Railway service
- ✅ Same domain for both
- ✅ No CORS issues
- ✅ Use empty string or full Railway URL

**Best Practice:**
```javascript
// In production: Use empty string for relative URLs
// In development: Use localhost:8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');
```

This configuration ensures your app works correctly in both development and production environments!
