import psycopg2
from psycopg2.extras import RealDictCursor
from app.database.postgres_config import get_database_connection

class OrderItemAddonDb:
    def __init__(self):
        self.conn = None
        self.cursor = None

    def _get_connection(self):
        """Lazy loading of database connection"""
        if self.conn is None:
            self.conn = get_database_connection()
            if self.conn:
                self.cursor = self.conn.cursor()
                self.cursor.execute("""
                    CREATE TABLE IF NOT EXISTS order_item_addons (
                        id SERIAL PRIMARY KEY,
                        order_item_id INT REFERENCES order_items(order_item_id) ON DELETE CASCADE,
                        addon_id INT REFERENCES add_ons(addon_id) ON DELETE CASCADE,
                        price NUMERIC(8,2) NOT NULL
                    );
                """)
                self.conn.commit()
        return self.conn

    def add_addon_to_order_item(self, order_item_id, addon_id):
        if not self._get_connection():
            return None
            
        try:
            self.cursor.execute(
                "SELECT price FROM add_ons WHERE addon_id = %s",
                (addon_id,)
            )
            row = self.cursor.fetchone()
            if not row:
                return None
            price = row['price']

            self.cursor.execute(
                """
                INSERT INTO order_item_addons(order_item_id, addon_id, price)
                VALUES (%s,%s,%s)
                RETURNING id    
                """,
                (order_item_id, addon_id, price)
            )

            new_id = self.cursor.fetchone()['id']
            # get order_id
            self.cursor.execute(
                "SELECT order_id FROM order_items WHERE order_item_id = %s",
                (order_item_id,)
            )
            order_id = self.cursor.fetchone()["order_id"]

            self.conn.commit()
            self.recalc_order_amount(order_id)
            return new_id
        
        except Exception:
            self.conn.rollback()
            raise

    def get_addons_of_order_item(self, order_item_id):
        if not self._get_connection():
            return []
            
        self.cursor.execute(
            """
            SELECT oia.id,
                oia.order_item_id,
                oia.addon_id,
                a.addon_name,
                oia.price
            FROM order_item_addons oia
            JOIN add_ons a ON oia.addon_id = a.addon_id
            WHERE oia.order_item_id = %s;
            """,
            (order_item_id,)
        )
        return self.cursor.fetchall()
    
    def remove_addon(self, addon_row_id):
        if not self._get_connection():
            return False
            
        try:
            self.cursor.execute(
                """
                DELETE FROM order_item_addons
                WHERE id = %s
                RETURNING order_item_id;
                """,
                (addon_row_id,)
            )

            row = self.cursor.fetchone()
            if not row:
                return False
            
            order_item_id = row["order_item_id"]
            self.cursor.execute(
                "SELECT order_id FROM order_items WHERE order_item_id = %s",
                (order_item_id,)
            )
            order_id = self.cursor.fetchone()["order_id"]

            self.conn.commit()
            self.recalc_order_amount(order_id)
            return True
        except Exception:
            self.conn.rollback()
            raise
    
    def recalc_order_amount(self, order_id):
        if not self._get_connection():
            return
            
        self.cursor.execute(
            """UPDATE orders
            SET total_amount = (
            SELECT
                COALESCE(SUM(oi.sub_total),0)+
                COALESCE(SUM(oia.price),0)
                FROM order_items oi
                LEFT JOIN order_item_addons oia
                    ON oi.order_item_id = oia.order_item_id
                    WHERE oi.order_id = %s
                    )
                    WHERE order_id = %s
                    """, (order_id, order_id)
        )
        self.conn.commit()
    

