class AddOn:
    def __init__(self, addon_id, name,category, price, available):
        self.addon_id = addon_id
        self.addon_name = name
        self.addon_category = category
        self.addon_price = price
        self.addon_available = available

    def display_addon(self):
        return f"{self.addon_name} (+{self.addon_price})"
    
    
