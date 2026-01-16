from fastapi import APIRouter, HTTPException
from app.services.paymentService import Payment_service

router = APIRouter(
    prefix="/payments",
    tags=["payments"]
)

payment_service = Payment_service()

# -----------------------
# INITIATE PAYMENT
# -----------------------
@router.post("/initiate")
def initiate_payment(order_id: int, method: str):
    success, message, payment = payment_service.initiate_payment(order_id, method)

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return {
        "message": message,
        "payment": {
            "payment_id": payment.payment_id,
            "order_id": payment.order_id,
            "amount": float(payment.amount),
            "method": payment.method,
            "status": payment.status,
            "transaction_ref": payment.transaction_ref,
            "created_at": payment.created_at
        }
    }


# -----------------------
# CONFIRM PAYMENT
# -----------------------
@router.post("/confirm")
def confirm_payment(payment_id: int, success: bool):
    ok, message = payment_service.confirm_payment(payment_id, success)

    if not ok:
        raise HTTPException(status_code=400, detail=message)

    return {"message": message}
