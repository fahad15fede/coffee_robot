import psycopg2
from psycopg2.extras import RealDictCursor
from app.model.menuItem import MenuItem

class MenuItemDB:
    def __init__(self, host="localhost", database="coffee_robot", user="postgres", password="fahad15fede"):
            self.conn = psycopg2.connect(
                host=host,
                database=database,
                user=user,
                password=password 
            )
            self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

            #create table if it does not exist

            self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS menu_items(
                item_id SERIAL PRIMARY KEY,
                item_name VARCHAR(100),                           
                category VARCHAR(50),
                price NUMERIC
                );                
                """)
            self.conn.commit()

    def add_item(self, item: MenuItem):
            self.cursor.execute("""
                INSERT INTO menu_items (item_name, category, price)
                VALUES (%s, %s, %s)
                RETURNING item_id;
            """, (item.item_name,item.category, item.price))

            new_id = self.cursor.fetchone()["item_id"]
            self.conn.commit()
            return new_id
    
    def update_item(self, item_id, name = None, category = None, price = None):
            self.cursor.execute("""
                UPDATE menu_items 
                SET
                    item_name = COALESCE(%s, item_name),
                    category = COALESCE(%s, category),
                    price = COALESCE(%s, price)
                WHERE item_id = %s
                RETURNING item_id;
            """, (name,category, price, item_id))
            updated = self.cursor.fetchone()
            self.conn.commit()
            return updated is not None

    def get_item(self, item_id):
            self.cursor.execute("""
                SELECT * FROM menu_items WHERE item_id = %s;
            """, (item_id,))

            row = self.cursor.fetchone()
            if row:
                return MenuItem(row["item_id"], row["item_name"], row["category"], row["price"])
            return None

    def get_all_items(self):
            self.cursor.execute("SELECT * FROM menu_items;")
            rows = self.cursor.fetchall()
            return [MenuItem(r["item_id"], r["item_name"],r["category"], r["price"]) for r in rows]
    
    def delete_item(self, item_id):
        self.cursor.execute("""
            DELETE FROM menu_items WHERE item_id = %s RETURNING item_id;
        """, (item_id,))

        deleted = self.cursor.fetchone()
        self.conn.commit()
        return deleted is not None
