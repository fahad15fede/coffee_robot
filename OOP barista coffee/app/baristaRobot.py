class BaristaRobot:
    def __init__(self, robot_id):
        self.robot_id = robot_id

    def process_order(self, order):
        order.status = "IN_PROGRESS"

    def mark_ready(self, order):
        order.status = "READY"
