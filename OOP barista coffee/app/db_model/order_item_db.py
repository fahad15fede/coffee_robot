import psycopg2
from psycopg2.extras import RealDictCursor

class OrderItemDb:
    def __init__(self, host='localhost', database='coffee_robot', user='postgres', password='fahad15fede'):
        self.conn = psycopg2.connect(
            host=host,
            user=user,
            database=database,
            password=password
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS order_items(
                order_item_id SERIAL PRIMARY KEY,
                order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
                item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
                quantity INT NOT NULL,
                item_price NUMERIC(8,2) NOT NULL,
                sub_total NUMERIC(8,2) NOT NULL
            );
        """)
        self.conn.commit()

    def add_item_to_order(self, order_id, item_id, quantity):
        try:
            self.cursor.execute(
                "SELECT status FROM orders WHERE order_id = %s",
                (order_id,)
            )

            order = self.cursor.fetchone()

            if not order or order["status"] != 'pending':
                return None
            
            self.cursor.execute(
                "SELECT price FROM menu_items WHERE item_id = %s",
                (item_id,)
            )
            row = self.cursor.fetchone()
            if not row:
                return None

            item_price = row["price"]
            sub_total = item_price * quantity

            self.cursor.execute(
                """
                INSERT INTO order_items 
                (order_id, item_id, quantity, item_price, sub_total)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING order_item_id
                """,
                (order_id, item_id, quantity, item_price, sub_total)
            )

            new_id = self.cursor.fetchone()["order_item_id"]
            self.conn.commit()
            
            self.recalc_order_amount(order_id)
            return new_id

        except Exception:
            self.conn.rollback()
            raise

    def get_item_to_order(self, order_id):
        self.cursor.execute(
            """
            SELECT oi.order_item_id,
                   oi.order_id,
                   oi.item_id,
                   mi.item_name,
                   oi.quantity,
                   oi.item_price,
                   oi.sub_total
            FROM order_items oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = %s
            """,
            (order_id,)
        )
        return self.cursor.fetchall()

    def update_item_to_order(self, order_item_id, new_quantity):
        try:
            self.cursor.execute(
                "SELECT item_price FROM order_items WHERE order_item_id = %s",
                (order_item_id,)
            )

            row = self.cursor.fetchone()
            if not row:
                return False

            item_price = row["item_price"]
            order_id = row["order_id"]
            new_sub_total = item_price * new_quantity

            self.cursor.execute(
                """
                UPDATE order_items
                SET quantity = %s,
                    sub_total = %s
                WHERE order_item_id = %s
                """,
                (new_quantity, new_sub_total, order_item_id)
            )

            self.conn.commit()
            self.recalc_order_amount(order_id)
            return True

        except Exception:
            self.conn.rollback()
            raise

    def remove_item_from_order(self, order_item_id):
        try:
            self.cursor.execute(
                """
                DELETE FROM order_items
                WHERE order_item_id = %s
                RETURNING order_item_id
                """,
                (order_item_id,)
            )
            row = self.cursor.fetchone()
            self.conn.commit()

            if row:
                self.recalc_order_amount(row["order_id"])
                return True
            return False

        except Exception:
            self.conn.rollback()
            raise

    def calc_order_amount(self, order_id):
        self.cursor.execute(
            """
            SELECT SUM(sub_total) AS total
            FROM order_items
            WHERE order_id = %s
            """,
            (order_id,)
        )
        row = self.cursor.fetchone()
        return float(row["total"] or 0)
    
    def recalc_order_amount(self, order_id):
        self.cursor.execute(
            """
            UPDATE orders
            SET total_amount = (
            SELECT COALESCE(SUM(sub_total),0)
            FROM order_items
            WHERE order_id = %s
            )
            WHERE order_id = %s
            """,
            (order_id, order_id)
        )
        self.conn.commit()
