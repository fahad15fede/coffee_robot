#!/usr/bin/env python3
"""
Coffee Shop API Server - Railway Deployment
"""
import sys
import os
import uvicorn

def main():
    """Main application entry point"""
    try:
        # CRITICAL: Set DATABASE_URL for Railway PostgreSQL
        if not os.getenv('DATABASE_URL') or 'localhost' in os.getenv('DATABASE_URL', ''):
            print("⚠️  DATABASE_URL not found or pointing to localhost, setting Railway URL...")
            os.environ['DATABASE_URL'] = "postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway"
            print("✅ DATABASE_URL set to Railway PostgreSQL")
        else:
            print(f"✅ DATABASE_URL found: {os.getenv('DATABASE_URL')[:50]}...")
        
        # Setup paths - try symlink first, then original
        app_root = "/app"
        
        # Try symlink first (no spaces)
        coffee_path = os.path.join(app_root, "coffee_app")
        if not os.path.exists(coffee_path):
            # Fallback to original path
            coffee_path = os.path.join(app_root, "OOP barista coffee")
        
        # Add to Python path
        sys.path.insert(0, coffee_path)
        
        # Change to coffee directory
        os.chdir(coffee_path)
        
        # Get port
        port = int(os.environ.get("PORT", 8000))
        
        print("=" * 50)
        print("🚀 COFFEE SHOP API")
        print("=" * 50)
        print(f"📁 Coffee path: {coffee_path}")
        print(f"📁 Working dir: {os.getcwd()}")
        print(f"🌐 Port: {port}")
        print(f"📁 Directory exists: {os.path.exists(coffee_path)}")
        print(f"🗄️  DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")
        
        # List contents for debugging
        print("📁 Contents:")
        for item in os.listdir("."):
            print(f"  - {item}")
        
        # Import and start
        from app.main import app
        print("✅ App imported successfully")
        
        uvicorn.run(app, host="0.0.0.0", port=port)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()