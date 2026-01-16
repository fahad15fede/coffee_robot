from databaseManager import DatabaseManager
from app.model.customer_model import Customer
import re


class Customer_service():

    def __init__(self, customer_repo: DatabaseManager):
        self.customer_repo = customer_repo

    def add_customer(self, name, phone, email):

        # -------- validation --------
        if not name or name.strip() == "":
            return "Enter a valid name"

        if not re.fullmatch(r'\d{10,15}', phone):
            return 'Invalid phone format'

        existing = self.customer_repo.get_customer_by_phone(phone)
        if existing is not None:
            return 'Customer already exists'

        # Email validation (same as update function for consistency)
        if not re.fullmatch(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            return 'Invalid email format'

        customer = Customer(
            customer_id=None,
            name=name,
            phone=phone,
            email=email
        )

        new_id = self.customer_repo.add_customer(customer)
        return f'Customer created with ID {new_id}'

    def get_customer_by_ID(self, customer_id):
        if not re.fullmatch(r'cus-\d+', customer_id):
            return 'Invalid customer-ID'

        result = self.customer_repo.get_customer(customer_id)

        if result is None:
            return 'Customer not found.'

        return result

    def update_customer(self, customer_id, name, phone, email):

        # Customer ID validation
        if not re.fullmatch(r'cus-\d+', customer_id):
            return 'Invalid customer-ID'

        result = self.customer_repo.get_customer(customer_id)

        if result is None:
            return 'Customer not found.'

        # Name validation
        if not name or name.strip() == "":
            return "Enter a valid name"

        # Phone validation
        if not re.fullmatch(r'\d{10,15}', phone):
            return 'Invalid phone format'

        # Email validation
        if not re.fullmatch(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            return 'Invalid email format'

        updated = self.customer_repo.update_customer(customer_id, name, phone, email)

        return 'Updated details successfully.'

    def delete_customer(self, customer_id):

        existing = self.customer_repo.get_customer(customer_id)

        if existing:
            self.customer_repo.delete_customer(customer_id)
            return "Customer deleted"

        return 'Customer not found.'

    def list_customers(self):

        result = self.customer_repo.get_all_customers()

        if not result:
            return "No customers found"

        return result
