from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_database
from .routes import (
    auth_routes, medicine_routes, pharmacy_routes,
    reservation_routes, pharmacy_admin_routes, delivery_routes
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed sample data
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Startup database seeding note: {e}")
    yield

app = FastAPI(
    title="MediAccess API",
    description="Medicine Availability, Strip Identification, Reservation & Home Delivery API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for local React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_routes.router)
app.include_router(medicine_routes.router)
app.include_router(pharmacy_routes.router)
app.include_router(reservation_routes.router)
app.include_router(pharmacy_admin_routes.router)
app.include_router(delivery_routes.router)


@app.get("/")
def root():
    return {
        "app": "MediAccess Platform",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "tagline": "Your Medicine, Just a Tap Away!"
    }
