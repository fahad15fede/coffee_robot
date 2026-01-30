@echo off
echo ========================================
echo Coffee Shop - NEW MENU ITEM IMAGES & VIDEOS
echo ========================================
echo.

echo NEW ITEMS ADDED:
echo - Black Tea (with video animation)
echo - Brown Biscuits
echo - Chocolate Syrup
echo - Chilled Latte
echo - Chilled Mocha
echo - Plain White Bread
echo.
echo FEATURES IMPLEMENTED:
echo - Video support for Black Tea item
echo - Enhanced image mapping with multiple keywords
echo - Video indicator icon for animated items
echo - Auto-play looping videos (muted)
echo - Responsive video/image rendering
echo.

echo [1/4] Adding all changes to git...
git add .

echo.
echo [2/4] Committing new menu items...
git commit -m "Add new menu item images and video support

New Menu Items Added:
- Black Tea (black_tea.mp4) - with video animation
- Brown Biscuits (brwon_biscuits.jpg)
- Chocolate Syrup (chocolate syrup.jpg)
- Chilled Latte (chilled_latte.webp)
- Chilled Mocha (chilled mocha.jpg)
- Plain White Bread (white bread plain.jpg)

Enhanced Features:
- Video support for menu items (Black Tea)
- Auto-play looping videos with mute
- Video indicator icon (🎥) for animated items
- Enhanced image mapping with multiple keywords
- Support for exact and partial name matching
- Responsive video/image rendering in both grid and list views

Image Mapping Keywords:
- 'black tea' → video animation
- 'brown biscuit', 'biscuit' → brown biscuits image
- 'chocolate syrup', 'syrup' → chocolate syrup image
- 'chilled latte', 'iced latte', 'cold latte' → chilled latte image
- 'chilled mocha', 'iced mocha', 'cold mocha' → chilled mocha image
- 'white bread', 'plain bread', 'bread' → white bread image

Menu now supports both static images and animated videos!"

echo.
echo [3/4] Pushing to Railway...
git push

echo.
echo [4/4] Deployment Status
echo ========================================
echo ✅ New menu item images and videos added
echo ✅ Video support implemented for Black Tea
echo ✅ Enhanced image mapping with multiple keywords
echo ✅ Responsive video/image rendering
echo ✅ Changes pushed to Railway
echo.
echo 🎬 NEW MENU FEATURES:
echo - Black Tea displays with animated video
echo - All new items have proper images
echo - Smart keyword matching for item names
echo - Video indicator for animated items
echo - Auto-play videos (muted for better UX)
echo.
echo ✅ Menu now showcases all new items with rich media!
echo ========================================

pause