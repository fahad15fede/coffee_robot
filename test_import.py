#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""
import sys
import os

# Add the OOP barista coffee directory to Python path
coffee_dir = os.path.join(os.path.dirname(__file__), 'OOP barista coffee')
sys.path.insert(0, coffee_dir)

print(f"Testing imports from: {coffee_dir}")
print(f"Python path: {sys.path[:3]}")

try:
    # Test basic imports
    print("Testing FastAPI import...")
    import fastapi
    print("✅ FastAPI imported successfully")
    
    print("Testing uvicorn import...")
    import uvicorn
    print("✅ Uvicorn imported successfully")
    
    print("Testing psycopg2 import...")
    import psycopg2
    print("✅ psycopg2 imported successfully")
    
    # Change to coffee directory
    os.chdir(coffee_dir)
    print(f"Changed directory to: {os.getcwd()}")
    
    # Test app import
    print("Testing app.main import...")
    from app.main import app
    print("✅ App imported successfully")
    
    print("✅ All imports successful! Ready to start server.")
    
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)