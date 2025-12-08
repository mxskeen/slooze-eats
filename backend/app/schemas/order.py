from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.order import OrderStatus
from app.models.user import Country


class AddToCartRequest(BaseModel):
    menu_item_id: int
    quantity: int = 1


class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    menu_item_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    total_amount: float
    country: Country
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class CheckoutRequest(BaseModel):
    payment_method_id: Optional[int] = None
