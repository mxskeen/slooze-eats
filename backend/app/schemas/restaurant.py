from pydantic import BaseModel
from typing import List, Optional
from app.models.user import Country


class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]

    class Config:
        from_attributes = True


class RestaurantResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_url: Optional[str]
    country: Country

    class Config:
        from_attributes = True


class RestaurantDetailResponse(RestaurantResponse):
    menu_items: List[MenuItemResponse] = []
