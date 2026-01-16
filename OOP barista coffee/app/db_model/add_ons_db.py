import psycopg2
from psycopg2.extras import RealDictCursor
from app.model.add_ons import AddOn

class AddOnDb:
    def __init__(self, host='localhost', database='coffee_robot', user='postgres', password='fahad15fede'):
        self.conn = psycopg2.connect(
            host=host,
            user=user,
            database=database,
            password=password
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS add_ons(
                addon_id SERIAL PRIMARY KEY,
                addon_name VARCHAR(100),
                category VARCHAR(50),
                available BOOLEAN DEFAULT TRUE,
                price NUMERIC,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        self.conn.commit()


    # --------------------------------------------------------
    # CREATE
    # --------------------------------------------------------
    def add_addon(self, add_on: AddOn):
        self.cursor.execute("""
            INSERT INTO add_ons (addon_name, category, price, available)
            VALUES (%s, %s, %s, %s)
            RETURNING addon_id;
        """, (add_on.addon_name, add_on.addon_category, add_on.addon_price, add_on.addon_available))

        new_id = self.cursor.fetchone()["addon_id"]
        self.conn.commit()
        return new_id


    # --------------------------------------------------------
    # READ SINGLE
    # --------------------------------------------------------
    def get_addon(self, addon_id):
        self.cursor.execute("""
            SELECT * FROM add_ons WHERE addon_id = %s;
        """, (addon_id,))

        row = self.cursor.fetchone()
        if row:
            return AddOn(
                row["addon_id"],
                row["addon_name"],
                row["category"],
                row["price"],
                row["available"]
            )
        return None


    # --------------------------------------------------------
    # READ ALL
    # --------------------------------------------------------
    def get_all_addons(self):
        self.cursor.execute("SELECT * FROM add_ons;")
        rows = self.cursor.fetchall()
        return [
            AddOn(r["addon_id"], r["addon_name"], r["category"], r["price"], r["available"])
            for r in rows
        ]


    # --------------------------------------------------------
    # UPDATE
    # --------------------------------------------------------
    def update_addon(self, addon_id, name=None, category=None, price=None, available=None):
        self.cursor.execute("""
            UPDATE add_ons
            SET 
                addon_name = COALESCE(%s, addon_name),
                category = COALESCE(%s, category),
                price = COALESCE(%s, price),
                available = COALESCE(%s, available)
            WHERE addon_id = %s
            RETURNING addon_id;
        """, (name, category, price, available, addon_id))

        updated = self.cursor.fetchone()
        self.conn.commit()
        return updated is not None


    # --------------------------------------------------------
    # DELETE
    # --------------------------------------------------------
    def delete_addon(self, addon_id):
        self.cursor.execute("""
            DELETE FROM add_ons WHERE addon_id = %s RETURNING addon_id;
        """, (addon_id,))

        deleted = self.cursor.fetchone()
        self.conn.commit()
        return deleted is not None
