from fastapi import APIRouter, HTTPException
from app.db_model.order_item_addon_db import OrderItemAddonDb

router = APIRouter(
    prefix="/order-item-addon",
    tags=["order-item-addons"]
)

db = OrderItemAddonDb()


# -----------------------------------
# ADD ADDON TO ORDER ITEM
# -----------------------------------
@router.post("/add")
def add_addon(order_item_id: int, addon_id: int):
    new_id = db.add_addon_to_order_item(order_item_id, addon_id)

    if not new_id:
        raise HTTPException(
            status_code=404,
            detail="Order item or Add-on not found"
        )

    return {
        "message": "Add-on added to order item",
        "addon_link_id": new_id
    }


# -----------------------------------
# GET ADDONS OF ORDER ITEM
# -----------------------------------
@router.get("/{order_item_id}")
def get_addons(order_item_id: int):
    addons = db.get_addons_of_order_item(order_item_id)

    if not addons:
        raise HTTPException(
            status_code=404,
            detail="No add-ons found for this order item"
        )

    return [
        {
            "id": a["id"],
            "order_item_id": a["order_item_id"],
            "addon_id": a["addon_id"],
            "addon_name": a["addon_name"],
            "price": float(a["price"])
        }
        for a in addons
    ]


# -----------------------------------
# REMOVE ADDON FROM ORDER ITEM
# -----------------------------------
@router.delete("/delete/{id}")
def remove_addon(id: int):
    success = db.remove_addon(id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Add-on link not found"
        )

    return {"message": "Add-on removed from order item"}
