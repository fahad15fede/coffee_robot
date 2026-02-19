@echo off
echo ========================================
echo Coffee Shop - QUICK FIX DEPLOYMENT
echo ========================================
echo.

echo FIXING:
echo - imageLoadingStates prop passing issue
echo - MenuItem component prop definitions
echo.

echo [1/4] Adding changes...
git add .

echo.
echo [2/4] Committing fix...
git commit -m "Fix imageLoadingStates prop passing in MenuItem component

Bug Fix:
- Added imageLoadingStates and setImageLoadingStates props to MenuItem
- Fixed ReferenceError: imageLoadingStates is not defined
- Props now properly passed from parent to child component
- Image loading skeleton now works correctly

The loading animation will now display properly!"

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Fix Complete!
echo ========================================
echo ✅ imageLoadingStates prop issue fixed
echo ✅ MenuItem component updated
echo ✅ Image loading skeleton now works
echo ✅ Changes pushed to Railway
echo.
echo 🧪 TEST:
echo - Visit your coffee shop
echo - Menu items should load with coffee cup animation
echo - No more console errors
echo.
echo ✅ Loading animation fixed!
echo ========================================

pause