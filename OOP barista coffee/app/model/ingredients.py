class Ingredient:
    def __init__(self, ingred_id, name, unit,price_per_unit, quantity, low_stock_limit):
        self.ingred_id = ingred_id
        self.name = name
        self.unit = unit
        self.price_per_unit = price_per_unit
        self.quantity = quantity
        self.low_stock_limit = low_stock_limit
    
        