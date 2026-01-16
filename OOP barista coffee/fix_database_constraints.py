"""
Database Fix Script - Remove Unique Constraints
This script removes unique constraints from phone and email columns
to allow multiple customers with the same contact information.
"""

import psycopg2

def fix_database():
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            database="coffee_robot",
            user="postgres",
            password="fahad15fede"
        )
        cursor = conn.cursor()
        
        print("🔧 Fixing database constraints...")
        
        # Drop unique constraint on phone if it exists
        try:
            cursor.execute("""
                ALTER TABLE customers 
                DROP CONSTRAINT IF EXISTS customers_phone_key;
            """)
            print("✅ Removed unique constraint from phone column")
        except Exception as e:
            print(f"⚠️  Phone constraint: {e}")
        
        # Drop unique constraint on email if it exists
        try:
            cursor.execute("""
                ALTER TABLE customers 
                DROP CONSTRAINT IF EXISTS customers_email_key;
            """)
            print("✅ Removed unique constraint from email column")
        except Exception as e:
            print(f"⚠️  Email constraint: {e}")
        
        # Commit changes
        conn.commit()
        print("\n✨ Database fixed! Customers can now have duplicate phone/email.")
        
        # Close connection
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPlease make sure:")
        print("1. PostgreSQL is running")
        print("2. Database 'coffee_robot' exists")
        print("3. Credentials are correct")

if __name__ == "__main__":
    fix_database()
