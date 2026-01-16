from fastapi import APIRouter, HTTPException
from app.db_model.menu_item_db import MenuItemDB
from app.model.menuItem import MenuItem

router = APIRouter(
    prefix="/menu",
    tags=["Menu Items"]
)

db = MenuItemDB()


# --------------------------------------------------------
# CREATE
# --------------------------------------------------------
@router.post("/add")
def add_menu_item(name: str, category: str, price: float):
    item = MenuItem(None, name, category, price)
    new_id = db.add_item(item)
    return {"message": "Menu item added", "item_id": new_id}


# --------------------------------------------------------
# READ SINGLE
# --------------------------------------------------------
@router.get("/{item_id}")
def get_menu_item(item_id: int):
    item = db.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return {
        "item_id": item.item_id,
        "item_name": item.item_name,
        "category": item.category,
        "price": float(item.price)
    }


# --------------------------------------------------------
# READ ALL
# --------------------------------------------------------
@router.get("/")
def get_all_menu_items():
    items = db.get_all_items()
    return [
        {
            "item_id": i.item_id,
            "item_name": i.item_name,
            "category": i.category,
            "price": float(i.price)
        }
        for i in items
    ]


# --------------------------------------------------------
# UPDATE
# --------------------------------------------------------
@router.put("/update/{item_id}")
def update_menu_item(item_id: int, name: str | None = None, category: str | None = None, price: float | None = None):

    success = db.update_item(item_id, name=name, category=category, price=price)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found or nothing to update")

    return {"message": "Menu item updated"}


# --------------------------------------------------------
# DELETE
# --------------------------------------------------------
@router.delete("/delete/{item_id}")
def delete_menu_item(item_id: int):
    success = db.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")

    return {"message": "Menu item deleted"}
