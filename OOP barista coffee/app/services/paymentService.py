import uuid
from app.db_model.payment_db import PaymentDB
from app.db_model.order_db import OrderDb

class Payment_service:
    def __init__(self):
        self.payment_db = PaymentDB()
        self.order_db = OrderDb()
    
    # -----------------------
    # INITIATE PAYMENT
    # ----------------------
    def initiate_payment(self, order_id, method):
        order = self.order_db.get_order_summary(order_id)

        if not order:
            return False, 'Order not found', None
        if order['status'] != 'ready':
            return False, "Order is not ready for payment", None
        
        amount = float(order.total_amount)
        transaction_ref =str(uuid.uuid4())

        payment = self.payment_db.create_payment(
            order_id=order_id,
            amount=amount,
            method=method,
            transaction_ref=transaction_ref
        )

        return True, "Payment initiated", payment
    
    # -----------------------
    # CONFIRM PAYMENT
    # -----------------------

    def confirm_payment(self, payment_id, success: bool):
        payment = self.payment_db.get_payment(payment_id)

        if not payment:
            return False, "Payment not found"

        if success:
            self.payment_db.update_payment_status(payment_id, "success")
            self.order_db.mark_order_paid(payment.order_id)
            return True, "Payment successful"

        else:
            self.payment_db.update_payment_status(payment_id, "failed")
            return False, "Payment failed"