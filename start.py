#!/usr/bin/env python3
import sys
import os
import uvicorn

def main():
    # Add the OOP barista coffee directory to Python path
    coffee_dir = os.path.join(os.path.dirname(__file__), 'OOP barista coffee')
    sys.path.insert(0, coffee_dir)
    
    # Change working directory to the coffee app directory
    os.chdir(coffee_dir)
    
    # Get port from environment
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting Coffee Shop API on port {port}")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python path includes: {coffee_dir}")
    
    try:
        # Import the FastAPI app
        from app.main import app
        print("✅ FastAPI app imported successfully")
        
        # Start the server
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=port,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()