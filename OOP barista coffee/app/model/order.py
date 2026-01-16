from datetime import datetime

class Order:
    def __init__(self, order_id, customer_id, status, total_amount, created_at, updated_at):
        self.order_id = order_id
        self.customer_id = customer_id
        self.total_amount = total_amount
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at
