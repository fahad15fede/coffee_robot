#!/usr/bin/env python3
import sys
import os
import uvicorn

# Set up paths and environment
app_root = "/app"
coffee_dir = os.path.join(app_root, "OOP barista coffee")

# Add to Python path
sys.path.insert(0, app_root)
sys.path.insert(0, coffee_dir)

# Set working directory
os.chdir(app_root)

def main():
    port = int(os.environ.get("PORT", 8000))
    
    print("🚀 Coffee Shop API Starting...")
    print(f"📁 App root: {app_root}")
    print(f"� Coffee dir: {coffee_dir}")
    print(f"📁 Current dir: {os.getcwd()}")
    print(f"🐍 Python path: {sys.path[:3]}")
    print(f"🌐 Port: {port}")
    
    try:
        # Import from the correct path
        sys.path.insert(0, coffee_dir)
        os.chdir(coffee_dir)
        
        from app.main import app
        print("✅ FastAPI app loaded successfully")
        
        # Start server
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True
        )
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Available files in coffee dir:")
        try:
            for item in os.listdir(coffee_dir):
                print(f"  - {item}")
        except:
            print("  Could not list directory")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Startup error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()