from fastapi import APIRouter, HTTPException
from app.db_model.customer_db import CustomerDB
from app.model.customer_model import Customer

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

db = CustomerDB()   # Database connection


# ---------------------------
# CREATE
# ---------------------------
@router.post("/add")
def add_customer(name: str, phone: str, email: str):
    customer = Customer(None, name, phone, email)
    new_id = db.add_customer(customer)
    return {"message": "Customer added", "customer_id": new_id}


# ---------------------------
# READ ONE
# ---------------------------
@router.get("/{customer_id}")
def get_customer(customer_id: int):
    customer = db.get_customer(customer_id)
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
    customers = db.get_all()
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
def update_customer(customer_id: int , name: str| None = None, phone: str| None = None, email: str| None = None):
    updated = db.update_customer(customer_id, name, phone, email)
    if not updated:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {"message": "Customer updated successfully"}


# ---------------------------
# DELETE
# ---------------------------
@router.delete("/{customer_id}")
def delete_customer(customer_id: int):
    deleted = db.delete_customer(customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")

    return {"message": "Customer deleted successfully"}
