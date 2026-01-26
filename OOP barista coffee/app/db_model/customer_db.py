import psycopg2
from psycopg2.extras import RealDictCursor
from app.model.customer_model import Customer
from app.database.postgres_config import get_database_connection

class CustomerDB:
    def __init__(self):
        try:
            self.conn = get_database_connection()
            if self.conn:
                self.cursor = self.conn.cursor()
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS customers (
                        customer_id SERIAL PRIMARY KEY,
                        customer_name VARCHAR(50),
                        phone VARCHAR(20),
                        email VARCHAR(100)
                    );
                """)
                self.conn.commit()
        except Exception as e:
            print(f"Database initialization failed: {e}")
            self.conn = None
            self.cursor = None

    # ---------------------- ADD ----------------------
    def add_customer(self, customer: Customer):
        self.cursor.execute("""
            INSERT INTO customers (customer_name, phone, email)
            VALUES (%s, %s, %s)
            RETURNING customer_id;
        """, (customer.name, customer.phone, customer.email))

        new_id = self.cursor.fetchone()["customer_id"]
        self.conn.commit()
        return new_id

    # ---------------------- GET ONE ----------------------
    def get_customer(self, customer_id):
        self.cursor.execute("""
            SELECT * FROM customers WHERE customer_id = %s;
        """, (customer_id,))

        row = self.cursor.fetchone()
        if row:
            return Customer(row["customer_id"], row["customer_name"], row["phone"], row["email"])
        return None

    # ---------------------- GET ALL ----------------------
    def get_all(self):
        self.cursor.execute("SELECT * FROM customers ORDER BY customer_id;")
        rows = self.cursor.fetchall()
        return [Customer(r["customer_id"], r["customer_name"], r["phone"], r["email"]) for r in rows]

    # ---------------------- UPDATE ----------------------
    def update_customer(self, customer_id, name=None, phone=None, email=None):
        # only update fields passed by user
        self.cursor.execute("""
            UPDATE customers
            SET 
                customer_name = COALESCE(%s, customer_name),
                phone = COALESCE(%s, phone),
                email = COALESCE(%s, email)
            WHERE customer_id = %s
            RETURNING customer_id;
        """, (name, phone, email, customer_id))

        updated = self.cursor.fetchone()
        self.conn.commit()

        return updated is not None  # True if updated

    # ---------------------- DELETE ----------------------
    def delete_customer(self, customer_id):
        self.cursor.execute("""
            DELETE FROM customers
            WHERE customer_id = %s
            RETURNING customer_id;
        """, (customer_id,))

        deleted = self.cursor.fetchone()
        self.conn.commit()

        return deleted is not None  # True if deleted

    # ---------------------- SEARCH BY NAME (Optional) ----------------------
    def search_by_name(self, keyword):
        self.cursor.execute("""
            SELECT * FROM customers
            WHERE customer_name ILIKE %s;
        """, (f"%{keyword}%",))

        rows = self.cursor.fetchall()
        return [Customer(r["customer_id"], r["customer_name"], r["phone"], r["email"]) for r in rows]



