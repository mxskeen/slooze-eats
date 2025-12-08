import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class PaymentType(str, enum.Enum):
    CARD = "card"
    UPI = "upi"
    NETBANKING = "netbanking"


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(PaymentType), nullable=False)
    last_four = Column(String(4), nullable=False)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="payment_methods")
