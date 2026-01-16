from fastapi import APIRouter, HTTPException
from app.db_model.ingredient_menu_db import MenuIngredientDB

router = APIRouter(
    prefix="/menu",
    tags=["Menu Item Ingredients"]
)

db = MenuIngredientDB()

# Add ingredient to menu item
@router.post("/{menu_item_id}/ingredient/add")
def add_ingredient_to_item(menu_item_id: int, ingred_id: int, quantity_used: float):
    link_id = db.add_ingredient_to_menu(menu_item_id, ingred_id, quantity_used)
    return {"message": "Ingredient linked to menu item", "link_id": link_id}


# Get all ingredients for a menu item
@router.get("/{menu_item_id}/ingredients")
def get_ingredients_from_item(menu_item_id: int):
    items = db.get_ingredients_for_menu(menu_item_id)
    return items


# Delete ingredient from menu item
@router.delete("/{menu_item_id}/ingredient/{ingred_id}")
def delete_ingredient_from_item(menu_item_id: int, ingred_id: int):
    success = db.remove_ingredient_from_menu(menu_item_id, ingred_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ingredient link not found")
    return {"message": "Ingredient removed from menu item"}
