from fastapi import HTTPException, APIRouter
from app.db_model.order_db import OrderDb

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

# Database connection will be created when needed
def get_db():
    return OrderDb()

# -----------------------
# CREATE ORDER
# -----------------------
@router.post("/add")
def add_order(customer_id: int):
    db = get_db()
    new_id = db.create_order(customer_id)
    return {"message": "Order created", "order_id": new_id}

# -----------------------
# GET ALL ORDERS
# -----------------------
@router.get("/")
def get_all_orders():
    db = get_db()
    orders = db.get_all_orders()
    return [
        {
            "order_id": o.order_id,
            "customer_id": o.customer_id,
            "status": o.status,
            "total_amount": float(o.total_amount),
            "created_at": o.created_at
        }
        for o in orders
    ]

# -----------------------
# ORDER SUMMARY (WITH ITEMS)
# -----------------------
@router.get("/{order_id}/summary")
def get_order_summary(order_id: int):
    db = get_db()
    summary = db.get_order_summary(order_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Order not found")
    return summary

# -----------------------
# GET SINGLE ORDER
# -----------------------
@router.get("/{order_id}")
def get_order(order_id: int):
    db = get_db()
    order = db.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_id": order["order_id"],
        "customer_id": order["customer_id"],
        "status": order["status"],
        "total_amount": float(order["total_amount"]),
        "created_at": order["created_at"]
    }

# -----------------------
# UPDATE ORDER STATUS
# -----------------------
@router.put("/{order_id}/status")
def update_status(order_id: int, status: str):
    db = get_db()
    success, error = db.update_order_status(order_id, status)

    if not success:
        raise HTTPException(status_code=400, detail=error)

    return {"message": f"Order status updated to {status}"}

# -----------------------
# ORDER PAYMENT
# -----------------------
@router.post("/{order_id}/pay")
def pay_order(order_id: int):
    db = get_db()
    success, error = db.mark_order_paid(order_id)

    if not success:
        raise HTTPException(status_code=400, detail=error)

    return {
        "message": "Payment successful",
        "order_id": order_id,
        "status": "paid"
    }

# -----------------------
# DELETE ORDER
# -----------------------
@router.delete("/delete/{order_id}")
def delete_order(order_id: int):
    db = get_db()
    success = db.delete_order(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"message": "Order cancelled"}
