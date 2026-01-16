class Payment:
    def __init__(self, payment_id, order_id, amount, method, status, transaction_ref, created_at):
        self.payment_id = payment_id
        self.order_id = order_id
        self.amount = amount
        self.status = status
        self.transaction_ref = transaction_ref
        
        