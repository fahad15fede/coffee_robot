class OrderQueue:
    def __init__(self):
        self.queue = []

    def add_order(self, order):
        self.queue.append(order)

    def get_next_order(self):
        return self.queue[0] if self.queue else None

    def remove_order(self, order_id):
        for o in self.queue:
            if o.order_id == order_id:
                self.queue.remove(o)
                return o
        return None
