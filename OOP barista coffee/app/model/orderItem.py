class OrderItem:
    def __init__(self, order_item_id, order_id, item_id, quantity, item_price, sub_total):
        self.order_item_id = order_item_id
        self.order_id = order_id
        self.item_id = item_id
        self.quantity = quantity
        self.item_price = item_price
        self.sub_total = sub_total
