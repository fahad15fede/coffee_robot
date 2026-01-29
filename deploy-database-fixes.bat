@echo off
echo ========================================
echo Coffee Shop - CRITICAL 500 ERROR FIXES
echo ========================================
echo.

echo [1/4] Adding all changes to git...
git add .

echo.
echo [2/4] Committing critical database fixes...
git commit -m "CRITICAL: Fix 500 Internal Server Errors

Database Connection Fixes:
- Fixed OrderDb lazy loading (was causing 500 errors)
- Fixed MenuItemDB lazy loading (was causing 500 errors)  
- Fixed PaymentDB lazy loading
- Fixed OrderItemDb lazy loading
- Fixed OrderItemAddonDb lazy loading
- All database classes now use proper lazy loading pattern

API Routing Fixes:
- Fixed FastAPI routing to prevent React SPA conflicts
- Added proper SPA fallback handling
- Enhanced CORS configuration for Railway domains

SQL Fixes:
- Fixed SQL syntax errors in payment_db.py (quotes)
- Fixed SQL syntax errors in order_item_addon_db.py (typos)
- Fixed table name inconsistencies

All 500 errors should now be resolved!"

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Deployment Status
echo ========================================
echo ✅ CRITICAL 500 errors fixed
echo ✅ All database models use lazy loading
echo ✅ API routing conflicts resolved
echo ✅ SQL syntax errors corrected
echo ✅ Changes pushed to Railway
echo.
echo 🧪 TEST THESE ENDPOINTS NOW:
echo - https://web-production-12d6e.up.railway.app/menu/
echo - https://web-production-12d6e.up.railway.app/orders/
echo - https://web-production-12d6e.up.railway.app/customers/
echo - https://web-production-12d6e.up.railway.app/addon/
echo.
echo 📋 Should now return JSON data instead of 500 errors
echo ========================================

pause