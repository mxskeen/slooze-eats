from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import auth, restaurants, orders, payments

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Slooze Eats API",
    description="Food ordering API with role-based access control",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(restaurants.router, prefix="/restaurants", tags=["Restaurants"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}
