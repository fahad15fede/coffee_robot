#!/usr/bin/env python3
import sys
import os

# Add the OOP barista coffee directory to Python path
coffee_dir = os.path.join(os.path.dirname(__file__), 'OOP barista coffee')
sys.path.insert(0, coffee_dir)

# Change working directory to the coffee app directory
os.chdir(coffee_dir)

# Import and run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    from app.main import app
    
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Coffee Shop API on port {port}")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path includes: {coffee_dir}")
    
    uvicorn.run(app, host="0.0.0.0", port=port)