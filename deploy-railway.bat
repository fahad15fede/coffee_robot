@echo off
echo ================================
echo   Coffee Shop Railway Deployment
echo ================================
echo.

echo Step 1: Installing Railway CLI...
npm install -g @railway/cli

echo.
echo Step 2: Login to Railway...
railway login

echo.
echo Step 3: Initialize Railway project...
railway init

echo.
echo Step 4: Add PostgreSQL database...
echo Please add PostgreSQL database manually in Railway dashboard

echo.
echo Step 5: Deploy application...
railway up

echo.
echo ================================
echo   Deployment Complete!
echo ================================
echo.
echo Next steps:
echo 1. Go to Railway dashboard
echo 2. Add PostgreSQL database service
echo 3. Update frontend/.env.production with your Railway URL
echo 4. Redeploy if needed: railway up
echo.
pause