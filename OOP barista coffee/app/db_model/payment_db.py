from psycopg2.extras import RealDictCursor
import psycopg2
from app.model.payment import Payment
from app.database.postgres_config import get_database_connection

class PaymentDB:
    def __init__(self):
        try:
            self.conn = get_database_connection()
            if self.conn:
                self.cursor = self.conn.cursor()
                self.cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS payments(
                    payment_id SERIAL PRIMARY KEY,
                    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
                    amount NUMERIC (8,2),
                    method VARCHAR(50),
                    status VARCHAR(100),
                    transaction_ref VARCHAR(255),
                    created_at TIMESTAMP DEFAULT NOW()
                    );
                    """
                )
                self.conn.commit()
        except Exception as e:
            print(f"Payment database initialization failed: {e}")
            self.conn = None
            self.cursor = None
    
    def create_payment(self, order_id, amount, method):
        try:
            self.cursor.execute(
                """INSERT INTO payments (order_id, amount, method, status)
                    VALUES(%s, %s, %s, %s)
                    RETURNING payment_id
                """,(order_id, amount, method, "initiated")
            )
            payment_id = self.cursor.fetchone()["payment_id"]
            self.conn.commit()
            return payment_id
        except Exception:
            self.conn.rollback()
            raise

    def mark_success(self, payment_id, transaction_ref):
        try: 

            self.cursor.execute(
                """
                UPDATE payments
                SET status = "success",
                    transaction_ref = %s
                WHERE payment_id = %s
                RETURNING payment_id
                """,(transaction_ref, payment_id)
            )

            row = self.cursor.fetchone()
            self.conn.commit()
            if not row:
                return False
            return True
        
        except Exception:
            self.conn.rollback()
            raise
    def mark_failed(self, payment_id, reason = None):
        try: 

            self.cursor.execute(
                """
                UPDATE payments
                SET status = "failed",
                    reason = %s
                WHERE payment_id = %s
                RETURNING payment_id
                """,(reason, payment_id)
            )

            row = self.cursor.fetchone()
            self.conn.commit()
            if not row:
                return False
            return True
        
        except Exception:
            self.conn.rollback()
            raise

    def payments_by_order(self, order_id):
        self.cursor.execute(
            """
            SELECT * FROM payments
            WHERE order_id = %s
            ORDER BY created_at DESC"""
        ),(order_id,)

        rows = self.cursor.fetchall()

        return [
            Payment(
                r['payment_id'],
                r["order_id"],
                r["amount"],
                r["method"],
                r["status"],
                r["transaction_ref"],
                r["created_at"]
            )
            for r in rows
        ]
    
        