from fastapi import APIRouter, HTTPException
from typing import Optional
from app.db_model.add_ons_db import AddOnDb
from app.model.add_ons import AddOn

router = APIRouter(
    prefix="/addon",
    tags=["Add Ons"]
)

def get_db():
    return AddOnDb()


# --------------------------------------------------------
# CREATE
# --------------------------------------------------------
@router.post("/add")
def add_addon(addon_name: str, addon_category: str, addon_price: float, addon_available: bool = True):
    add_on = AddOn(None, addon_name, addon_category, addon_price, addon_available)
    new_id = db.add_addon(add_on)
    return {"message": "Add-on added", "addon_id": new_id}


# --------------------------------------------------------
# READ SINGLE
# --------------------------------------------------------
@router.get("/{addon_id}")
def get_addon(addon_id: int):
    add_on = db.get_addon(addon_id)
    if not add_on:
        raise HTTPException(status_code=404, detail="Add-on not found")

    return {
        "addon_id": add_on.addon_id,
        "addon_name": add_on.addon_name,
        "addon_category": add_on.addon_category,
        "addon_price": float(add_on.addon_price),
        "addon_available": add_on.addon_available
    }


# --------------------------------------------------------
# READ ALL
# --------------------------------------------------------
@router.get("/")
def get_all_addons():
    add_ons = db.get_all_addons()
    return [
        {
            "addon_id": a.addon_id,
            "name": a.addon_name,
            "category": a.addon_category,
            "price": float(a.addon_price),
            "available": a.addon_available
        }
        for a in add_ons
    ]


# --------------------------------------------------------
# UPDATE
# --------------------------------------------------------
@router.put("/update/{addon_id}")
def update_addon(addon_id: int, name: Optional[str] = None, category: Optional[str] = None,
                 price: Optional[float] = None, available: Optional[bool] = None):

    success = db.update_addon(addon_id, name, category, price, available)
    if not success:
        raise HTTPException(status_code=404, detail="Add-on not found or not updated")

    return {"message": "Add-on updated"}


# --------------------------------------------------------
# DELETE
# --------------------------------------------------------
@router.delete("/delete/{addon_id}")
def delete_addon(addon_id: int):
    success = db.delete_addon(addon_id)
    if not success:
        raise HTTPException(status_code=404, detail="Add-on not found")

    return {"message": "Add-on deleted"}
