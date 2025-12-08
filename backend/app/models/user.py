import enum
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"


class Country(str, enum.Enum):
    INDIA = "india"
    AMERICA = "america"
    GLOBAL = "global"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    country = Column(Enum(Country), nullable=False)

    orders = relationship("Order", back_populates="user")
    payment_methods = relationship("PaymentMethod", back_populates="user")
