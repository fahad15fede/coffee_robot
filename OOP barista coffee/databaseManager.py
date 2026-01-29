import psycopg2
from datetime import datetime

class DatabaseManager:

    def __init__(self, db_name, user, password, host="postgresql://postgres:asRanvYsGkSfSXDKNSBJtkaqGvyDbAiy@postgres.railway.internal:5432/railway", port="18650"):
        self.conn = psycopg2.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.cur = self.conn.cursor()

    ###################################
    # CUSTOMER CRUD
    ###################################

    def add_customer(self, customer):
        q = """
        INSERT INTO customers (customer_name, phone, email)
        VALUES (%s, %s, %s)
        RETURNING customer_id;
        """
        self.cur.execute(q, (customer.name, customer.phone, customer.email))
        id = self.cur.fetchone()[0]
        self.conn.commit()
        return id

    def get_customer(self, customer_id):
        self.cur.execute("SELECT * FROM customers WHERE customer_id=%s", (customer_id,))
        return self.cur.fetchone()

    def get_customer_by_phone(self, phone):
        self.cur.execute("SELECT * FROM customers WHERE phone=%s", (phone,))
        return self.cur.fetchone()

    def get_all_customers(self):
        self.cur.execute("SELECT * FROM customers")
        return self.cur.fetchall()

    def update_customer(self, customer_id, name=None, phone=None, email=None):
        updates = []
        values = []

        if name:
            updates.append("customer_name=%s")
            values.append(name)
        if phone:
            updates.append("phone=%s")
            values.append(phone)
        if email:
            updates.append("email=%s")
            values.append(email)

        if not updates:
            return False

        query = f"""
        UPDATE customers
        SET {', '.join(updates)}
        WHERE customer_id=%s
        """

        values.append(customer_id)
        self.cur.execute(query, values)
        self.conn.commit()
        return True

    def delete_customer(self, customer_id):
        self.cur.execute("DELETE FROM customers WHERE customer_id=%s", (customer_id,))
        self.conn.commit()
        return True

    ###################################
    # MENU ITEM CRUD
    ###################################

    def add_menu_item(self, item):
        q = """
        INSERT INTO menu_items (item_name, category, price)
        VALUES (%s, %s, %s)
        RETURNING item_id;
        """
        self.cur.execute(q, (item.name, item.category, item.get_price()))
        id = self.cur.fetchone()[0]
        self.conn.commit()
        return id

    def get_menu_item(self, item_id):
        self.cur.execute("SELECT * FROM menu_items WHERE item_id=%s", (item_id,))
        return self.cur.fetchone()

    def get_menu_item_by_name(self, name):
        self.cur.execute("SELECT * FROM menu_items WHERE item_name=%s", (name,))
        return self.cur.fetchone()

    def get_all_menu_items(self):
        self.cur.execute("SELECT * FROM menu_items")
        return self.cur.fetchall()

    def update_menu_item(self, item_id, name=None, category=None, price=None):
        updates = []
        values = []

        if name:
            updates.append("item_name=%s")
            values.append(name)
        if category:
            updates.append("category=%s")
            values.append(category)
        if price is not None:
            updates.append("price=%s")
            values.append(price)

        if not updates:
            return False

        q = f"""
        UPDATE menu_items
        SET {', '.join(updates)}
        WHERE item_id=%s
        """

        values.append(item_id)
        self.cur.execute(q, values)
        self.conn.commit()
        return True

    def delete_menu_item(self, item_id):
        self.cur.execute("DELETE FROM menu_items WHERE item_id=%s", (item_id,))
        self.conn.commit()
        return True

    ###################################
    # ADDON CRUD
    ###################################

    def add_addon(self, addon):
        q = """
        INSERT INTO add_ons (addon_name, category, price, available)
        VALUES (%s, %s, %s, %s)
        RETURNING addon_id
        """
        self.cur.execute(q, (addon.name, addon.category, addon.price, True))
        id = self.cur.fetchone()[0]
        self.conn.commit()
        return id

    def get_addon(self, addon_id):
        self.cur.execute("SELECT * FROM add_ons WHERE addon_id=%s", (addon_id,))
        return self.cur.fetchone()

    def get_all_addons(self):
        self.cur.execute("SELECT * FROM add_ons")
        return self.cur.fetchall()

    def delete_addon(self, addon_id):
        self.cur.execute("DELETE FROM add_ons WHERE addon_id=%s", (addon_id,))
        self.conn.commit()
        return True

    ###################################
    # ORDERS CRUD (FIXED!)
    ###################################

    def create_order(self, order):
        q = """
        INSERT INTO orders (customer_id, status, total_price, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING order_id;
        """
        self.cur.execute(q, (
            order.customer_id,      # FIXED ✔
            order.status,
            order.get_total_price(),
            order.created_at,
            order.updated_at
        ))
        id = self.cur.fetchone()[0]
        self.conn.commit()
        return id

    def update_order_status(self, order_id, status):
        self.cur.execute("""
            UPDATE orders
            SET status=%s, updated_at=NOW()
            WHERE order_id=%s
        """, (status, order_id))
        self.conn.commit()
        return True

    def get_order(self, order_id):
        self.cur.execute("SELECT * FROM orders WHERE order_id=%s", (order_id,))
        return self.cur.fetchone()

    def get_all_orders(self):
        self.cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        return self.cur.fetchall()

    ###################################
    # ORDER ITEMS CRUD (FIXED!)
    ###################################

    def add_order_item(self, order_item):
        q = """
        INSERT INTO order_items (order_id, item_id, quantity, price)
        VALUES (%s, %s, %s, %s)
        RETURNING order_item_id;
        """
        self.cur.execute(q, (
            order_item.order_id,
            order_item.item_id,        # FIXED ✔
            order_item.qty,
            order_item.get_price()
        ))
        id = self.cur.fetchone()[0]
        self.conn.commit()
        return id

    def get_order_items(self, order_id):
        self.cur.execute("""
            SELECT * FROM order_items
            WHERE order_id=%s
        """, (order_id,))
        return self.cur.fetchall()

    def delete_order_item(self, order_item_id):
        self.cur.execute("""
            DELETE FROM order_items WHERE order_item_id=%s
        """, (order_item_id,))
        self.conn.commit()
        return True

    ###################################
    # ORDER ITEM ADDONS
    ###################################

    def add_order_item_addon(self, order_item_id, addon, price):
        q = """
        INSERT INTO order_item_addons (order_item_id, addon_id, price)
        VALUES (%s, %s, %s);
        """
        self.cur.execute(q, (order_item_id, addon.addon_id, price))
        self.conn.commit()
        return True

