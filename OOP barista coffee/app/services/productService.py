from router.menuItem import MenuItem
import re
from databaseManager import DatabaseManager


class Product_service():

    def __init__(self, product_repo: DatabaseManager):
        self.product_repo = product_repo

    def add_product(self, name, category, price):

        # --- name ---
        if not name or name.strip() == "":
            return 'Invalid name of product.'

        # --- price format ---
        # allow digits, and optional .xx (two decimal places)
        if not re.fullmatch(r'^\d+(\.\d{1,2})?$', str(price)):
            return "Invalid price format. Example: 10, 10.5, 10.50"

        # convert string price to float
        price = float(price)

        # --- duplication check ---
        existing = self.product_repo.get_menu_item_by_name(name)
        if existing:
            return 'Item already in Database.'

        # --- create object ---
        item_new = MenuItem(
            item_id=None,
            name=name,
            category=category,
            price=price
        )

        new_id = self.product_repo.add_menu_item(item_new)

        return f'Item with ID {new_id} added.'

    def get_product(self, item_id):

        # item_id must be an integer
        if not str(item_id).isdigit():
            return "Invalid item ID"

        result = self.product_repo.get_menu_item(int(item_id))

        if not result:
            return "Product not found"

        return result
    

    def update_product(self, item_id, name, category, price):
        if not str(item_id).isdigit():
            return "Invalid item ID.";
        existing = self.product_repo.get_menu_item(item_id);

        if not existing:
            return'Product not found.'
        
        if name is not None:
            if name.strip() == "":
                return "Invalid product name."
        if price is not None:
                # price must be: digits OR digits.decimal(2)
                if not re.fullmatch(r'^\d+(\.\d{1,2})?$', str(price)):
                    return "Invalid price format (must be like 10 or 10.50)."

        if float(price) <= 0:
            return "Price must be greater than 0."

        self.product_repo.update_menu_item(
            int(item_id),
            name=name,
            category=category,
            price=price
        )   

        return 'Item updated succesfully.'
    

    def delete_product(self, item_id):

        # --- Validate item_id ---
        if not str(item_id).isdigit():
            return "Invalid product ID."

        item_id = int(item_id)

        existing = self.product_repo.get_menu_item(item_id)
        if not existing:
            return "Product not found."

        self.product_repo.delete_menu_item(item_id)
        return "Product deleted successfully."


    def list_products(self):

        result = self.product_repo.get_all_menu_items()

        # Return empty list instead of string message
        if not result:
            return []

        return result




