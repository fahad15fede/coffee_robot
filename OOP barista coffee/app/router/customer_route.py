from fastapi import APIRouter, HTTPException
from typing import Optional
from app.db_model.customer_db import CustomerDB
from app.model.customer_model import Customer

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

# Database connection - will be created when first accessed
db = None

def get_db():
    global db
    if db is None:
        db = CustomerDB()
    return db


# ---------------------------
# CREATE
# ---------------------------
@router.post("/add")
def add_customer(name: str, phone: str, email: str):
    database = get_db()
    customer = Customer(None, name, phone, email)
    new_id = database.add_customer(customer)
    return {"message": "Customer added", "customer_id": new_id}


# ---------------------------
# READ ONE
# ---------------------------
@router.get("/{customer_id}")
def get_customer(customer_id: int):
    database = get_db()
    customer = database.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {
        "customer_id": customer.customer_id,
        "customer_name": customer.name,
        "phone": customer.phone,
        "email": customer.email
    }


# ---------------------------
# READ ALL
# ---------------------------
@router.get("/")
def get_all_customers():
    database = get_db()
    customers = database.get_all()
    return [
        {
            "customer_id": c.customer_id,
            "customer_name": c.name,
            "phone": c.phone,
            "email": c.email
        }
        for c in customers
    ]


# ---------------------------
# UPDATE
# ---------------------------
@router.put("/{customer_id}")
def update_customer(customer_id: int, name: Optional[str] = None, phone: Optional[str] = None, email: Optional[str] = None):
    database = get_db()
    updated = database.update_customer(customer_id, name, phone, email)
    if not updated:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {"message": "Customer updated successfully"}


# ---------------------------
# DELETE
# ---------------------------
@router.delete("/{customer_id}")
def delete_customer(customer_id: int):
    database = get_db()
    deleted = database.delete_customer(customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {"message": "Customer deleted successfully"}
