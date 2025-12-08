from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.restaurant import Restaurant, MenuItem
from app.auth.dependencies import get_current_user, get_country_filter
from app.schemas.restaurant import RestaurantResponse, RestaurantDetailResponse

router = APIRouter()


@router.get("", response_model=List[RestaurantResponse])
def list_restaurants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    country_filter = get_country_filter(current_user)
    query = db.query(Restaurant)
    
    if country_filter:
        query = query.filter(Restaurant.country == country_filter)
    
    return query.all()


@router.get("/{restaurant_id}", response_model=RestaurantDetailResponse)
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    country_filter = get_country_filter(current_user)
    query = db.query(Restaurant).filter(Restaurant.id == restaurant_id)
    
    if country_filter:
        query = query.filter(Restaurant.country == country_filter)
    
    restaurant = query.first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    return restaurant
