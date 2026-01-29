import psycopg2
from psycopg2.extras import RealDictCursor
from app.model.order import Order
from app.database.postgres_config import get_database_connection


class OrderDb:
    def __init__(self):
        self.conn = None
        self.cursor = None

    def _get_connection(self):
        """Lazy loading of database connection"""
        if self.conn is None:
            self.conn = get_database_connection()
            if self.conn:
                self.cursor = self.conn.cursor()
                self.cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS orders (
                        order_id SERIAL PRIMARY KEY,
                        customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
                        status VARCHAR(50) NOT NULL,
                        total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    );
                    """
                )
                self.conn.commit()
        return self.conn

    # -----------------------
    # CREATE ORDER
    # -----------------------
    def create_order(self, customer_id):
        if not self._get_connection():
            return None
            
        try:
            self.cursor.execute(
                """
                INSERT INTO orders (customer_id, status, total_amount)
                VALUES (%s, %s, %s)
                RETURNING order_id;
                """,
                (customer_id, "pending", 0),
            )
            order_id = self.cursor.fetchone()["order_id"]
            self.conn.commit()
            return order_id
        except Exception:
            self.conn.rollback()
            raise

    # -----------------------
    # GET BASIC ORDER
    # -----------------------
    def get_order(self, order_id):
        if not self._get_connection():
            return None
            
        self.cursor.execute(
            "SELECT * FROM orders WHERE order_id = %s;",
            (order_id,),
        )
        return self.cursor.fetchone()

    # -----------------------
    # GET ALL ORDERS
    # -----------------------
    def get_all_orders(self):
        if not self._get_connection():
            return []
            
        self.cursor.execute("SELECT * FROM orders;")
        rows = self.cursor.fetchall()

        return [
            Order(
                r["order_id"],
                r["customer_id"],
                r["status"],
                r["total_amount"],
                r["created_at"],
                r["updated_at"],
            )
            for r in rows
        ]

    # -----------------------
    # ORDER STATUS FLOW
    # -----------------------
    VALID_TRANSITIONS = {
        "pending": ["preparing", "ready", "paid", "completed", "cancelled"],
        "preparing": ["pending", "ready", "paid", "completed", "cancelled"],
        "ready": ["pending", "preparing", "paid", "completed", "cancelled"],
        "paid": ["ready", "completed", "cancelled"],
        "completed": ["ready", "paid"],  # Allow reverting completed orders
        "cancelled": ["pending", "preparing", "ready"],  # Allow reactivating cancelled orders
    }

    # -----------------------
    # UPDATE ORDER STATUS
    # -----------------------
    def update_order_status(self, order_id, new_status):
        if not self._get_connection():
            return False, "Database connection failed"
            
        self.cursor.execute(
            "SELECT status FROM orders WHERE order_id = %s;",
            (order_id,),
        )
        row = self.cursor.fetchone()

        if not row:
            return False, "Order not found"

        current_status = row["status"]

        # Allow same status (no-op)
        if new_status == current_status:
            return True, None

        # Check if transition is allowed
        allowed = self.VALID_TRANSITIONS.get(current_status, [])
        if new_status not in allowed:
            return False, f"Cannot change from {current_status} → {new_status}. Allowed: {', '.join(allowed)}"

        self.cursor.execute(
            """
            UPDATE orders
            SET status = %s,
                updated_at = NOW()
            WHERE order_id = %s;
            """,
            (new_status, order_id),
        )

        self.conn.commit()
        return True, None

    # -----------------------
    # MARK ORDER AS PAID
    # -----------------------
    def mark_order_paid(self, order_id):
        if not self._get_connection():
            return False, "Database connection failed"
            
        self.cursor.execute(
            "SELECT status FROM orders WHERE order_id = %s;",
            (order_id,),
        )
        row = self.cursor.fetchone()

        if not row:
            return False, "Order not found"

        # Allow payment from pending or ready status
        if row["status"] not in ["pending", "ready"]:
            return False, f"Order cannot be paid. Current status: {row['status']}"

        self.cursor.execute(
            """
            UPDATE orders
            SET status = 'paid',
                updated_at = NOW()
            WHERE order_id = %s;
            """,
            (order_id,),
        )

        self.conn.commit()
        return True, None

    # -----------------------
    # DELETE ORDER
    # -----------------------
    def delete_order(self, order_id):
        if not self._get_connection():
            return False
            
        try:
            self.cursor.execute(
                "DELETE FROM orders WHERE order_id = %s RETURNING order_id;",
                (order_id,),
            )
            deleted = self.cursor.fetchone()
            self.conn.commit()
            return deleted is not None
        except Exception:
            self.conn.rollback()
            raise

    # -----------------------
    # ORDER SUMMARY (WITH ITEMS)
    # -----------------------
    def get_order_summary(self, order_id):
        if not self._get_connection():
            return None
            
        self.cursor.execute(
            "SELECT * FROM orders WHERE order_id = %s;",
            (order_id,),
        )
        order = self.cursor.fetchone()

        if not order:
            return None

        self.cursor.execute(
            """
            SELECT 
                oi.order_item_id,
                mi.item_name,
                oi.quantity,
                oi.item_price,
                oi.sub_total
            FROM order_items oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = %s;
            """,
            (order_id,),
        )
        items = self.cursor.fetchall()

        return {
            "order_id": order["order_id"],
            "customer_id": order["customer_id"],
            "status": order["status"],
            "total_amount": float(order["total_amount"]),
            "created_at": order["created_at"],
            "items": items,
        }
