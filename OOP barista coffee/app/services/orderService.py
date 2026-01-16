import re
from router.order import Order
from model.orderItem import OrderItem
from databaseManager import DatabaseManager
from router.menuItem import Menu_Item
from model.add_ons import AddOn  # if you created this class

class OrderService:

    def __init__(self, order_repo: DatabaseManager):
        self.order_repo = order_repo

    # ============================================
    # CREATE ORDER
    # ============================================
    def create_order(self, customer_id):
        if not re.fullmatch(r'cus-\d+', customer_id):
            return "Invalid customer ID format"

        customer = self.order_repo.get_customer(customer_id)
        if not customer:
            return "Customer not found"

        new_order = Order(order_id=None, customer_id=customer_id)

        # DB insert
        order_id = self.order_repo.create_order(new_order)
        new_order.order_id = order_id

        return new_order

    # ============================================
    # ADD PRODUCT TO ORDER
    # ============================================
    def add_item(self, order: Order, item_id, qty):
        item_row = self.order_repo.get_menu_item(item_id)
        if not item_row:
            return "Item not found"

        # Convert DB row → Menu_Item object
        menu_item = Menu_Item(
            item_id=item_row[0],
            name=item_row[1],
            category=item_row[2],
            price=item_row[3]
        )

        order_item = OrderItem(
            order_item_id=None,
            menu_item=menu_item,
            qty=qty
        )

        order_item.calculate_price()
        order.add_item(order_item)

        # Insert into DB
        order_item_id = self.order_repo.add_order_item(order_item)
        order_item.order_item_id = order_item_id

        return order_item_id

    # ============================================
    # ADD ADDONS TO ORDER ITEM
    # ============================================
    def add_addon_to_item(self, order_item_id, addon_id):
        row = self.order_repo.get_addon(addon_id)
        if not row:
            return "Addon not found"

        addon = AddOn(
            addon_id=row[0],
            name=row[1],
            category=row[2],
            price=row[3]
        )

        self.order_repo.add_order_item_addon(order_item_id, addon, addon.price)

        return "Addon added"

    # ============================================
    # CHANGE ORDER STATUS
    # ============================================
    def update_order_status(self, order_id, status):
        valid = ["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"]
        if status not in valid:
            return "Invalid status"

        self.order_repo.update_order_status(order_id, status)
        return "Status updated"

    # ============================================
    # GET ORDER
    # ============================================
    def get_order(self, order_id):
        return self.order_repo.get_order(order_id)
