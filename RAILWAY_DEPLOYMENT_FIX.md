# Railway Deployment Fix Guide

## Issues Fixed

### 1. Database Connection Issues ✅
- Updated `ingredient_menu_db.py`, `ingredients_db.py`, and `add_ons_db.py` to use lazy loading
- All database connections now use `get_database_connection()` from `postgres_config.py`
- No more hardcoded localhost connections

### 2. CORS Configuration ✅
- Updated CORS settings in `main.py` to allow Railway domains
- Added debug logging to see which origins are allowed

## Remaining Issues to Fix

### 3. Frontend API URL Configuration
The error shows your frontend is trying to fetch from `https://your-railway-app.railway.app` which is a placeholder URL.

**To fix this:**

1. **Find your actual Railway backend URL:**
   - Go to your Railway dashboard
   - Click on your coffee shop project
   - Look for the backend service URL (should be something like `https://web-production-xxxx.up.railway.app`)

2. **Update the frontend environment:**
   ```bash
   # Edit frontend/.env.production
   REACT_APP_API_URL=https://your-actual-backend-url.up.railway.app
   ```

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Fix API URL configuration"
   git push
   ```

### 4. Currency Display
All currency should now display as "Rs" (Pakistani Rupees). The search didn't find any remaining dollar signs in the code.

## Deployment Commands

```bash
# 1. Commit all changes
git add .
git commit -m "Fix database connections and CORS for Railway deployment"

# 2. Push to trigger Railway deployment
git push

# 3. Check Railway logs for any errors
# Go to Railway dashboard → Your project → View logs
```

## Testing After Deployment

1. **Check if the app loads:** Visit your Railway frontend URL
2. **Test API endpoints:** Try browsing the menu
3. **Check database:** Try registering a new customer
4. **Test orders:** Place a test order

## Common Railway Issues

### If you see "Service Unavailable":
- Check Railway logs for Python/database errors
- Verify DATABASE_URL environment variable is set

### If you see CORS errors:
- Make sure frontend and backend URLs match in CORS configuration
- Check that REACT_APP_API_URL points to the correct backend

### If database queries fail:
- Verify your PostgreSQL database is running on Railway
- Check that DATABASE_URL environment variable is properly set

## Environment Variables Needed

Make sure these are set in Railway:

```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=8000
RAILWAY_ENVIRONMENT=production
```

## Next Steps

1. Update `REACT_APP_API_URL` with your actual Railway backend URL
2. Redeploy the application
3. Test all functionality (registration, menu, orders, payments)
4. Check that all currency displays as "Rs" not "$"

The database connection issues have been resolved. The main remaining issue is ensuring the frontend API URL points to the correct Railway backend service.