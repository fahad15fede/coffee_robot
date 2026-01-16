from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router.customer_route import router as customer_router
from app.router.menu_item_route import router as menu_item_router
from app.router.add_on_route import router as add_on_router
from app.router.ingredients_route import router as ingred_router
from app.router.ingredient_menu_route import router as ingredient_menu_router
from app.router.orders_route import router as order_router
from app.router.order_item_route import router as order_item_router
from app.router.order_item_addon import router as order_item_addon_router
from app.router.payment_route import router as payment_router

app = FastAPI(
    title="Coffee Shop Order Robot API",
    version="1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route groups here
app.include_router(customer_router)
app.include_router(menu_item_router)
app.include_router(add_on_router)
app.include_router(ingred_router)
app.include_router(ingredient_menu_router)
app.include_router(order_router)
app.include_router(order_item_router)
app.include_router(order_item_addon_router)
app.include_router(payment_router)

@app.get("/")
def home():
    return {"message": "Coffee Shop Order Robot API is running!"}


