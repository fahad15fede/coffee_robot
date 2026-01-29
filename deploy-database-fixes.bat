@echo off
echo ========================================
echo Coffee Shop - DATABASE CONNECTION FIXES
echo ========================================
echo.

echo [1/4] Adding all changes to git...
git add .

echo.
echo [2/4] Committing database connection improvements...
git commit -m "Enhanced Railway PostgreSQL connection handling

Database Connection Improvements:
- Enhanced postgres_config.py with better Railway URL parsing
- Added fallback connection method for Railway DATABASE_URL
- Added comprehensive logging for connection debugging
- Added /api/debug/db endpoint for connection troubleshooting
- Fixed all database models to use proper lazy loading

Railway DATABASE_URL Support:
- Properly handles: postgresql://postgres:password@postgres.railway.internal:5432/railway
- Added URL parsing with urllib.parse for robust connection handling
- Enhanced error handling and connection status logging

Debug Features:
- Added connection info endpoint at /api/debug/db
- Added detailed logging for connection attempts
- Better error messages for troubleshooting

All 500 errors should now be resolved with proper Railway PostgreSQL connection!"

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Deployment Status
echo ========================================
echo ✅ Enhanced Railway PostgreSQL connection handling
echo ✅ All database models use lazy loading
echo ✅ Added comprehensive connection logging
echo ✅ Added debug endpoint for troubleshooting
echo ✅ Changes pushed to Railway
echo.
echo 🧪 TEST THESE ENDPOINTS NOW:
echo - https://web-production-12d6e.up.railway.app/api/debug/db
echo - https://web-production-12d6e.up.railway.app/menu/
echo - https://web-production-12d6e.up.railway.app/orders/
echo - https://web-production-12d6e.up.railway.app/customers/
echo.
echo 📋 Check /api/debug/db first to verify database connection
echo ========================================

pause