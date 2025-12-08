from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.payment import PaymentMethod
from app.auth.dependencies import get_current_user, require_roles
from app.schemas.payment import PaymentMethodCreate, PaymentMethodUpdate, PaymentMethodResponse

router = APIRouter()


@router.get("/methods", response_model=List[PaymentMethodResponse])
def list_payment_methods(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == current_user.id).all()


@router.post("/methods", response_model=PaymentMethodResponse)
def create_payment_method(
    request: PaymentMethodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    if request.is_default:
        db.query(PaymentMethod).filter(
            PaymentMethod.user_id == current_user.id
        ).update({"is_default": False})
    
    payment_method = PaymentMethod(
        user_id=current_user.id,
        type=request.type,
        last_four=request.last_four,
        is_default=request.is_default
    )
    db.add(payment_method)
    db.commit()
    db.refresh(payment_method)
    
    return payment_method


@router.put("/methods/{method_id}", response_model=PaymentMethodResponse)
def update_payment_method(
    method_id: int,
    request: PaymentMethodUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    payment_method = db.query(PaymentMethod).filter(
        PaymentMethod.id == method_id,
        PaymentMethod.user_id == current_user.id
    ).first()
    
    if not payment_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment method not found"
        )
    
    if request.is_default:
        db.query(PaymentMethod).filter(
            PaymentMethod.user_id == current_user.id
        ).update({"is_default": False})
    
    if request.type is not None:
        payment_method.type = request.type
    if request.last_four is not None:
        payment_method.last_four = request.last_four
    if request.is_default is not None:
        payment_method.is_default = request.is_default
    
    db.commit()
    db.refresh(payment_method)
    
    return payment_method


@router.delete("/methods/{method_id}")
def delete_payment_method(
    method_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    payment_method = db.query(PaymentMethod).filter(
        PaymentMethod.id == method_id,
        PaymentMethod.user_id == current_user.id
    ).first()
    
    if not payment_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment method not found"
        )
    
    db.delete(payment_method)
    db.commit()
    
    return {"message": "Payment method deleted"}
