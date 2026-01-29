from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
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

# Configure CORS for both development and production
origins = [
    "http://localhost:3000",  # React dev server
    "https://localhost:3000",
    "http://127.0.0.1:3000",
]

# Get the current Railway domain from environment
current_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN") or os.getenv("RAILWAY_STATIC_URL")
if current_domain:
    origins.extend([
        f"https://{current_domain}",
        f"http://{current_domain}"
    ])

# Also allow the specific domain we know about
origins.extend([
    "https://web-production-12d6e.up.railway.app",
    "http://web-production-12d6e.up.railway.app"
])

print(f"CORS Origins: {origins}")  # Debug logging

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routes (these will be accessible directly)
app.include_router(customer_router)
app.include_router(menu_item_router)
app.include_router(add_on_router)
app.include_router(ingred_router)
app.include_router(ingredient_menu_router)
app.include_router(order_router)
app.include_router(order_item_router)
app.include_router(order_item_addon_router)
app.include_router(payment_router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Coffee Shop Order Robot API is running!"}

# Database connection debug endpoint
@app.get("/api/debug/db")
def debug_database():
    from app.database.postgres_config import test_connection, get_connection_info
    
    # Test connection
    success, message = test_connection()
    
    # Get connection info
    conn_info = get_connection_info()
    
    return {
        "database_connection": {
            "status": "connected" if success else "failed",
            "message": message,
            "connection_info": conn_info
        }
    }

# Serve static files and React app
frontend_build_path = "/app/frontend/build"
if os.path.exists(frontend_build_path):
    # Serve static assets
    app.mount("/static", StaticFiles(directory=f"{frontend_build_path}/static"), name="static")
    
    # Serve React app for all other routes (SPA fallback)
    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        # If it's an API route that doesn't exist, return 404
        if full_path.startswith(("customers", "menu", "addon", "ingredients", "orders", "order-item", "order-item-addon", "payments")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        # For all other routes, serve the React app
        return FileResponse(f"{frontend_build_path}/index.html")
else:
    @app.get("/")
    def home():
        return {"message": "Coffee Shop Order Robot API is running!"}


