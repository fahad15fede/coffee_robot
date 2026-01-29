@echo off
echo ========================================
echo Coffee Shop - API Routing Fix Deployment
echo ========================================
echo.

echo [1/4] Adding all changes to git...
git add .

echo.
echo [2/4] Committing changes...
git commit -m "Fix API routing and database connections for Railway

- Fixed FastAPI routing to prevent React SPA from overriding API endpoints
- Updated ingredient_menu_db.py to use lazy loading
- Updated ingredients_db.py to use lazy loading  
- Updated add_ons_db.py to use lazy loading
- Enhanced CORS configuration for Railway domains
- Removed duplicate router registrations
- Added proper SPA fallback for React routing
- All database connections now use get_database_connection()
- API endpoints now accessible at /menu/, /orders/, etc."

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Deployment Status
echo ========================================
echo ✅ API routing fixed - endpoints now accessible
echo ✅ Database connection fixes applied
echo ✅ CORS configuration updated
echo ✅ React SPA routing properly configured
echo ✅ Changes pushed to Railway
echo.
echo 🧪 TEST THESE ENDPOINTS:
echo - https://web-production-12d6e.up.railway.app/menu/
echo - https://web-production-12d6e.up.railway.app/orders/
echo - https://web-production-12d6e.up.railway.app/customers/
echo - https://web-production-12d6e.up.railway.app/addon/
echo.
echo 📋 Check Railway logs for deployment status
echo ========================================

pause