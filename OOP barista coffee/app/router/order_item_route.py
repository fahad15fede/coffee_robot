from fastapi import APIRouter, HTTPException
from app.db_model.order_item_db import OrderItemDb

router = APIRouter(
    prefix="/order-item",
    tags=["order-items"]
)

def get_db():
    return OrderItemDb()


# -------------------------------------------------
# ADD ITEM TO ORDER
# -------------------------------------------------
@router.post("/add")
def add_item_to_order(order_id: int, item_id: int, quantity: int):
    new_id = db.add_item_to_order(order_id, item_id, quantity)

    if not new_id:
        raise HTTPException(
            status_code=404,
            detail="Order or Menu item not found"
        )

    return {
        "message": "Item added to order",
        "order_item_id": new_id
    }


# -------------------------------------------------
# GET ALL ITEMS OF A SPECIFIC ORDER
# -------------------------------------------------
@router.get("/order/{order_id}")
def get_items_of_order(order_id: int):
    items = db.get_item_to_order(order_id)

    if not items:
        raise HTTPException(
            status_code=404,
            detail="No items found for this order"
        )

    return [
        {
            "order_item_id": item["order_item_id"],
            "order_id": item["order_id"],
            "item_id": item["item_id"],
            "item_name": item["item_name"],
            "quantity": item["quantity"],
            "item_price": float(item["item_price"]),
            "sub_total": float(item["sub_total"])
        }
        for item in items
    ]


# -------------------------------------------------
# UPDATE ITEM QUANTITY IN ORDER
# -------------------------------------------------
@router.put("/update/{order_item_id}")
def update_order_item(order_item_id: int, quantity: int):
    success = db.update_item_to_order(order_item_id, quantity)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Order item not found"
        )

    return {"message": "Order item updated"}


# -------------------------------------------------
# REMOVE ITEM FROM ORDER
# -------------------------------------------------
@router.delete("/delete/{order_item_id}")
def remove_order_item(order_item_id: int):
    success = db.remove_item_from_order(order_item_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Order item not found"
        )

    return {"message": "Order item removed"}


# -------------------------------------------------
# CALCULATE TOTAL AMOUNT OF AN ORDER
# -------------------------------------------------
@router.get("/total/{order_id}")
def calculate_order_total(order_id: int):
    total = db.calc_order_amount(order_id)

    return {
        "order_id": order_id,
        "total_amount": total
    }
