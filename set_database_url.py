#!/usr/bin/env python3
"""
Manually set DATABASE_URL environment variable for Railway deployment
"""
import os

# Your Railway PostgreSQL connection string
DATABASE_URL = "postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway"

# Set the environment variable
os.environ['DATABASE_URL'] = DATABASE_URL

print(f"✅ DATABASE_URL set to: {DATABASE_URL[:50]}...")

# Test the connection
try:
    from app.database.postgres_config import test_connection
    success, message = test_connection()
    print(f"Connection test: {'✅ SUCCESS' if success else '❌ FAILED'}")
    print(f"Message: {message}")
except Exception as e:
    print(f"❌ Error testing connection: {e}")