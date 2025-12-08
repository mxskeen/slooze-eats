from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.restaurant import MenuItem
from app.models.order import Order, OrderItem, OrderStatus
from app.auth.dependencies import get_current_user, require_roles, get_country_filter
from app.schemas.order import AddToCartRequest, OrderResponse, OrderItemResponse, CheckoutRequest

router = APIRouter()


def get_order_response(order: Order) -> OrderResponse:
    items = []
    for item in order.items:
        items.append(OrderItemResponse(
            id=item.id,
            menu_item_id=item.menu_item_id,
            menu_item_name=item.menu_item.name,
            quantity=item.quantity,
            price=item.price
        ))
    return OrderResponse(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        country=order.country,
        created_at=order.created_at,
        items=items
    )


@router.get("/cart", response_model=OrderResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == OrderStatus.CART
    ).first()
    
    if not cart:
        cart = Order(
            user_id=current_user.id,
            status=OrderStatus.CART,
            country=current_user.country
        )
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    return get_order_response(cart)


@router.post("/cart/items", response_model=OrderResponse)
def add_to_cart(
    request: AddToCartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    menu_item = db.query(MenuItem).filter(MenuItem.id == request.menu_item_id).first()
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    cart = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == OrderStatus.CART
    ).first()
    
    if not cart:
        cart = Order(
            user_id=current_user.id,
            status=OrderStatus.CART,
            country=current_user.country
        )
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    existing_item = db.query(OrderItem).filter(
        OrderItem.order_id == cart.id,
        OrderItem.menu_item_id == request.menu_item_id
    ).first()
    
    if existing_item:
        existing_item.quantity += request.quantity
    else:
        order_item = OrderItem(
            order_id=cart.id,
            menu_item_id=request.menu_item_id,
            quantity=request.quantity,
            price=menu_item.price
        )
        db.add(order_item)
    
    cart.total_amount = sum(item.price * item.quantity for item in cart.items)
    db.commit()
    db.refresh(cart)
    
    return get_order_response(cart)


@router.delete("/cart/items/{item_id}", response_model=OrderResponse)
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == OrderStatus.CART
    ).first()
    
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    order_item = db.query(OrderItem).filter(
        OrderItem.id == item_id,
        OrderItem.order_id == cart.id
    ).first()
    
    if not order_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart"
        )
    
    db.delete(order_item)
    cart.total_amount = sum(item.price * item.quantity for item in cart.items if item.id != item_id)
    db.commit()
    db.refresh(cart)
    
    return get_order_response(cart)


@router.post("/checkout", response_model=OrderResponse)
def checkout(
    request: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    cart = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == OrderStatus.CART
    ).first()
    
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    cart.status = OrderStatus.PLACED
    db.commit()
    db.refresh(cart)
    
    return get_order_response(cart)


@router.get("", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Order).filter(Order.status != OrderStatus.CART)
    
    if current_user.role != UserRole.ADMIN:
        country_filter = get_country_filter(current_user)
        if country_filter:
            query = query.filter(Order.country == country_filter)
        query = query.filter(Order.user_id == current_user.id)
    
    orders = query.order_by(Order.created_at.desc()).all()
    return [get_order_response(order) for order in orders]


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order.status == OrderStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order is already cancelled"
        )
    
    if order.status == OrderStatus.CART:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a cart"
        )
    
    order.status = OrderStatus.CANCELLED
    db.commit()
    db.refresh(order)
    
    return get_order_response(order)
