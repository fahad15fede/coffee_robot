@echo off
echo ========================================
echo Coffee Shop - DATABASE_URL FIX
echo ========================================
echo.

echo [1/4] Adding all changes to git...
git add .

echo.
echo [2/4] Committing DATABASE_URL fixes...
git commit -m "CRITICAL: Fix DATABASE_URL environment variable issue

Railway Environment Variable Fix:
- Added manual DATABASE_URL setting in start.py
- Enhanced postgres_config.py with comprehensive debugging
- Added support for Railway individual PG environment variables
- Added detailed logging to identify connection issues

Database Connection String:
- Using: postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway
- Added fallback methods for different Railway env var patterns
- Enhanced error handling and connection debugging

Debug Features:
- Added comprehensive environment variable logging
- Added multiple connection attempt methods
- Better error messages for troubleshooting

This should resolve the localhost connection errors!"

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Deployment Status
echo ========================================
echo ✅ DATABASE_URL manually set in start.py
echo ✅ Enhanced connection debugging added
echo ✅ Multiple Railway env var patterns supported
echo ✅ Changes pushed to Railway
echo.
echo 📋 Check Railway logs for:
echo - "DATABASE_URL: SET" message
echo - Database connection debug output
echo - Should see Railway PostgreSQL connection success
echo.
echo 🧪 After deployment, test:
echo - https://web-production-12d6e.up.railway.app/api/debug/db
echo - https://web-production-12d6e.up.railway.app/orders/
echo ========================================

pause