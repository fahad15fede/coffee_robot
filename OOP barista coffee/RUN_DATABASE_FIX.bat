@echo off
echo ========================================
echo   Coffee Shop Database Fix
echo ========================================
echo.
echo This will remove unique constraints from
echo phone and email columns to allow duplicates.
echo.
pause
echo.
echo Running fix script...
echo.
python fix_database_constraints.py
echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo You can now:
echo 1. Start the backend server
echo 2. Register customers with duplicate phone/email
echo.
pause

I also have a whole pgsql project named coffee_robot in pgadmin4 so is  DEPLOY_NOW.md also able to help eith thatelse update it, like 
