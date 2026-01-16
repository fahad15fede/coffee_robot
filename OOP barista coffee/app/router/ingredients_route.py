from fastapi import HTTPException, APIRouter
from app.db_model.ingredients_db import IngredientDB
from app.model.ingredients import Ingredient

router = APIRouter(
    prefix='/ingredients',
    tags=['Ingredient Items']
)

db = IngredientDB()

# -----------------------------
# CREATE
# -----------------------------
@router.post('/add')
def add_ingredient(ingred_name: str, unit: str, price_per_unit: float, quantity: float, low_stock_limit: float):
    ingred = Ingredient(None, ingred_name, unit, price_per_unit, quantity, low_stock_limit)
    new_id = db.add_ingredient(ingred)
    return {"message": "Ingredient added", "ingred_id": new_id}

# -----------------------------
# READ ONE
# -----------------------------
@router.get("/{ingred_id}")
def get_ingredient(ingred_id: int):
    ingred = db.get_ingredient(ingred_id)
    if not ingred:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return {
        "ingred_id": ingred.ingred_id,
        "name": ingred.name,
        "unit": ingred.unit,
        "price_per_unit": float(ingred.price_per_unit),
        "quantity": float(ingred.quantity),
        "low_stock_limit": float(ingred.low_stock_limit)
    }

# -----------------------------
# READ ALL
# -----------------------------
@router.get("/")
def get_all_ingredients():
    ingreds = db.get_all_ingredients()
    return [
        {
            "ingred_id": i.ingred_id,
            "name": i.name,
            "unit": i.unit,
            "price_per_unit": float(i.price_per_unit),
            "quantity": float(i.quantity),
            "low_stock_limit": float(i.low_stock_limit)
        }
        for i in ingreds
    ]

# -----------------------------
# UPDATE
# -----------------------------
@router.put("/update/{ingred_id}")
def update_ingredient(
    ingred_id: int,
    name: str | None = None,
    unit: str | None = None,
    price_per_unit: float | None = None,
    quantity: float | None = None,
    low_stock_limit: float | None = None
):
    success = db.update_ingredient(ingred_id, name, unit, price_per_unit, quantity, low_stock_limit)
    if not success:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return {"message": "Ingredient updated"}

# -----------------------------
# DELETE
# -----------------------------
@router.delete("/delete/{ingred_id}")
def delete_ingredient(ingred_id: int):
    success = db.delete_ingredient(ingred_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return {"message": "Ingredient deleted"}
