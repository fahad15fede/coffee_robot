import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_database_connection():
    """
    Get database connection using environment variables or defaults
    """
    # Try to get DATABASE_URL from environment (Railway provides this)
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        # Production: Use DATABASE_URL from Railway
        conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    else:
        # Development: Use local PostgreSQL or fallback to original settings
        try:
            conn = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                database=os.getenv('DB_NAME', 'coffee_robot'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'fahad15fede'),
                cursor_factory=RealDictCursor
            )
        except psycopg2.OperationalError:
            # If connection fails, return None - will be handled at runtime
            return None
    
    return conn

def test_connection():
    """
    Test database connection
    """
    try:
        conn = get_database_connection()
        if not conn:
            return False, "Database connection not available"
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return True, "Database connection successful"
    except Exception as e:
        return False, f"Database connection failed: {str(e)}"