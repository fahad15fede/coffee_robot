import psycopg2
from psycopg2.extras import RealDictCursor

class MenuIngredientDB:
    def __init__(self, host='localhost', database='coffee_robot', user='postgres', password='fahad15fede'):
        self.conn = psycopg2.connect(
            host=host, database=database, user=user, password=password
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        # Create join table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS menu_item_ingredients (
                id SERIAL PRIMARY KEY,
                item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
                ingred_id INT REFERENCES ingredients(ingred_id) ON DELETE CASCADE,
                quantity_used NUMERIC NOT NULL
            );
        """)
        self.conn.commit()

    # Add ingredient to menu item
    def add_ingredient_to_menu(self, menu_item_id, ingred_id, quantity_used):
        self.cursor.execute("""
            INSERT INTO menu_item_ingredients (item_id, ingred_id, quantity_used)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, (menu_item_id, ingred_id, quantity_used))

        link_id = self.cursor.fetchone()["id"]
        self.conn.commit()
        return link_id

    # Get ingredients for a menu item
    def get_ingredients_for_menu(self, menu_item_id):
        self.cursor.execute("""
            SELECT mi.id, mi.ingred_id, i.ingred_name, mi.quantity_used
            FROM menu_item_ingredients mi
            JOIN ingredients i ON mi.ingred_id = i.ingred_id
            WHERE item_id = %s;
        """, (menu_item_id,))
        return self.cursor.fetchall()

    # Remove one ingredient from menu item
    def remove_ingredient_from_menu(self, menu_item_id, ingred_id):
        self.cursor.execute("""
            DELETE FROM menu_item_ingredients 
            WHERE item_id = %s AND ingred_id = %s
            RETURNING id;
        """, (menu_item_id, ingred_id))

        row = self.cursor.fetchone()
        self.conn.commit()
        return row is not None
