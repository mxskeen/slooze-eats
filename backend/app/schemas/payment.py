from pydantic import BaseModel
from typing import Optional
from app.models.payment import PaymentType


class PaymentMethodCreate(BaseModel):
    type: PaymentType
    last_four: str
    is_default: bool = False


class PaymentMethodUpdate(BaseModel):
    type: Optional[PaymentType] = None
    last_four: Optional[str] = None
    is_default: Optional[bool] = None


class PaymentMethodResponse(BaseModel):
    id: int
    type: PaymentType
    last_four: str
    is_default: bool

    class Config:
        from_attributes = True
