import psycopg2
from psycopg2.extras import RealDictCursor
from app.model.ingredients import Ingredient
from app.database.postgres_config import get_database_connection

class IngredientDB:
    def __init__(self):
        self.conn = None
        self.cursor = None

    def _get_connection(self):
        """Lazy loading of database connection"""
        if self.conn is None:
            self.conn = get_database_connection()
            if self.conn:
                self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS ingredients(
                        ingred_id SERIAL PRIMARY KEY,
                        ingred_name VARCHAR(100),
                        unit VARCHAR(50),
                        price_per_unit NUMERIC(10,2),
                        quantity NUMERIC,
                        low_stock_limit NUMERIC,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    );
                """)
                self.conn.commit()
        return self.conn

    # -----------------------------
    # CREATE
    # -----------------------------
    def add_ingredient(self, ingredient: Ingredient):
        if not self._get_connection():
            return None
            
        self.cursor.execute("""
            INSERT INTO ingredients (ingred_name, unit, price_per_unit, quantity, low_stock_limit)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING ingred_id;
        """, (
            ingredient.name,
            ingredient.unit,
            ingredient.price_per_unit,
            ingredient.quantity,
            ingredient.low_stock_limit
        ))
        new_id = self.cursor.fetchone()["ingred_id"]
        self.conn.commit()
        return new_id

    # -----------------------------
    # READ ONE
    # -----------------------------
    def get_ingredient(self, ingred_id):
        if not self._get_connection():
            return None
            
        self.cursor.execute("SELECT * FROM ingredients WHERE ingred_id = %s;", (ingred_id,))
        row = self.cursor.fetchone()
        if row:
            return Ingredient(
                row["ingred_id"],
                row["ingred_name"],
                row["unit"],
                row["price_per_unit"],
                row["quantity"],
                row["low_stock_limit"]
            )
        return None

    # -----------------------------
    # READ ALL
    # -----------------------------
    def get_all_ingredients(self):
        if not self._get_connection():
            return []
            
        self.cursor.execute("SELECT * FROM ingredients;")
        rows = self.cursor.fetchall()

        return [
            Ingredient(
                r["ingred_id"],
                r["ingred_name"],
                r["unit"],
                r["price_per_unit"],
                r["quantity"],
                r["low_stock_limit"]
            )
            for r in rows
        ]

    # -----------------------------
    # UPDATE
    # -----------------------------
    def update_ingredient(self, ingred_id, name=None, unit=None, price_per_unit=None, quantity=None, low_stock_limit=None):
        if not self._get_connection():
            return False
            
        self.cursor.execute("""
            UPDATE ingredients
            SET 
                ingred_name = COALESCE(%s, ingred_name),
                unit = COALESCE(%s, unit),
                price_per_unit = COALESCE(%s, price_per_unit),
                quantity = COALESCE(%s, quantity),
                low_stock_limit = COALESCE(%s, low_stock_limit),
                updated_at = NOW()
            WHERE ingred_id = %s
            RETURNING ingred_id;
        """, (name, unit, price_per_unit, quantity, low_stock_limit, ingred_id))

        updated = self.cursor.fetchone()
        self.conn.commit()
        return updated is not None

    # -----------------------------
    # DELETE
    # -----------------------------
    def delete_ingredient(self, ingred_id):
        if not self._get_connection():
            return False
            
        self.cursor.execute("DELETE FROM ingredients WHERE ingred_id = %s RETURNING ingred_id;", (ingred_id,))
        deleted = self.cursor.fetchone()
        self.conn.commit()
        return deleted is not None
