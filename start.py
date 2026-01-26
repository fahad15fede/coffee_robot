#!/usr/bin/env python3
import sys
import os

# Add the OOP barista coffee directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'OOP barista coffee'))

# Import and run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    from app.main import app
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)