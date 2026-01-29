import os
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse

def get_database_connection():
    """
    Get database connection using environment variables or defaults
    """
    # Debug: Print all environment variables related to database
    print("=== DATABASE CONNECTION DEBUG ===")
    database_url = os.getenv('DATABASE_URL')
    print(f"DATABASE_URL: {database_url}")
    
    # Check for other possible Railway environment variables
    railway_vars = {
        'PGHOST': os.getenv('PGHOST'),
        'PGPORT': os.getenv('PGPORT'), 
        'PGDATABASE': os.getenv('PGDATABASE'),
        'PGUSER': os.getenv('PGUSER'),
        'PGPASSWORD': os.getenv('PGPASSWORD'),
        'POSTGRES_URL': os.getenv('POSTGRES_URL'),
        'RAILWAY_ENVIRONMENT': os.getenv('RAILWAY_ENVIRONMENT')
    }
    
    for key, value in railway_vars.items():
        if value:
            print(f"{key}: {value}")
    
    print("=== END DEBUG ===")
    
    if database_url:
        print(f"Using DATABASE_URL: {database_url[:50]}...")  # Log partial URL for debugging
        try:
            # Production: Use DATABASE_URL from Railway
            # psycopg2 can parse the full URL automatically
            conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
            print("✅ Connected to Railway PostgreSQL successfully")
            return conn
        except psycopg2.OperationalError as e:
            print(f"❌ Railway PostgreSQL connection failed: {e}")
            
            # Try parsing URL manually as fallback
            try:
                parsed = urlparse(database_url)
                conn = psycopg2.connect(
                    host=parsed.hostname,
                    port=parsed.port or 5432,
                    database=parsed.path[1:],  # Remove leading slash
                    user=parsed.username,
                    password=parsed.password,
                    cursor_factory=RealDictCursor
                )
                print("✅ Connected to Railway PostgreSQL using parsed URL")
                return conn
            except Exception as e2:
                print(f"❌ Manual URL parsing also failed: {e2}")
                return None
    
    # Try Railway individual environment variables
    elif railway_vars['PGHOST']:
        print("Trying Railway individual environment variables...")
        try:
            conn = psycopg2.connect(
                host=railway_vars['PGHOST'],
                port=railway_vars['PGPORT'] or 5432,
                database=railway_vars['PGDATABASE'],
                user=railway_vars['PGUSER'],
                password=railway_vars['PGPASSWORD'],
                cursor_factory=RealDictCursor
            )
            print("✅ Connected to Railway PostgreSQL using individual vars")
            return conn
        except Exception as e:
            print(f"❌ Railway individual vars connection failed: {e}")
    
    else:
        print("No DATABASE_URL found, trying local connection...")
        # Development: Use local PostgreSQL or fallback to original settings
        try:
            conn = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                database=os.getenv('DB_NAME', 'coffee_robot'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'fahad15fede'),
                cursor_factory=RealDictCursor
            )
            print("✅ Connected to local PostgreSQL")
            return conn
        except psycopg2.OperationalError as e:
            print(f"❌ Local PostgreSQL connection failed: {e}")
            return None

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

def get_connection_info():
    """
    Get connection information for debugging
    """
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        try:
            parsed = urlparse(database_url)
            return {
                "host": parsed.hostname,
                "port": parsed.port or 5432,
                "database": parsed.path[1:],
                "user": parsed.username,
                "using_railway": True
            }
        except:
            return {"error": "Could not parse DATABASE_URL"}
    else:
        return {
            "host": os.getenv('DB_HOST', 'localhost'),
            "port": 5432,
            "database": os.getenv('DB_NAME', 'coffee_robot'),
            "user": os.getenv('DB_USER', 'postgres'),
            "using_railway": False
        }