from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# -----------------------------
# PostgreSQL DATABASE URL
# -----------------------------

DATABASE_URL = (
    "postgresql://postgres:fahad15fede@localhost:5432/coffee_robot"
)

# -----------------------------
# SQLAlchemy Engine
# -----------------------------

engine = create_engine(
        DATABASE_URL,
        echo=True,
        future=True
    )

# -----------------------------
# Session Factory
# -----------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------------------
# Base Class for ORM Models
# -----------------------------
Base = declarative_base()


# -----------------------------
# Dependency: get_db()
# FastAPI uses this in routes
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()