import os
from app.database import engine, SessionLocal, Base
from app.models.user import User, UserRole, Country
from app.models.restaurant import Restaurant, MenuItem
from app.models.order import Order, OrderItem
from app.models.payment import PaymentMethod, PaymentType
from app.auth.password import hash_password


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Get password from env or use default for dev
    seed_password = os.getenv("SEED_PASSWORD", "")
    hashed_pwd = hash_password(seed_password)
    
    try:
        if db.query(User).first():
            print("Database already seeded")
            return
        
        users = [
            User(
                email="nick@slooze.com",
                password=hashed_pwd,
                name="Nick Fury",
                role=UserRole.ADMIN,
                country=Country.GLOBAL
            ),
            User(
                email="marvel@slooze.com",
                password=hashed_pwd,
                name="Captain Marvel",
                role=UserRole.MANAGER,
                country=Country.INDIA
            ),
            User(
                email="america@slooze.com",
                password=hashed_pwd,
                name="Captain America",
                role=UserRole.MANAGER,
                country=Country.AMERICA
            ),
            User(
                email="thanos@slooze.com",
                password=hashed_pwd,
                name="Thanos",
                role=UserRole.MEMBER,
                country=Country.INDIA
            ),
            User(
                email="thor@slooze.com",
                password=hashed_pwd,
                name="Thor",
                role=UserRole.MEMBER,
                country=Country.INDIA
            ),
            User(
                email="travis@slooze.com",
                password=hashed_pwd,
                name="Travis",
                role=UserRole.MEMBER,
                country=Country.AMERICA
            ),
        ]
        db.add_all(users)
        db.commit()
        
        restaurants = [
            Restaurant(
                name="Taj Mahal Kitchen",
                description="Authentic Indian cuisine with traditional recipes",
                image_url="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
                country=Country.INDIA
            ),
            Restaurant(
                name="Spice Garden",
                description="North Indian delicacies and street food",
                image_url="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400",
                country=Country.INDIA
            ),
            Restaurant(
                name="Mumbai Express",
                description="Fast casual Indian food",
                image_url="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
                country=Country.INDIA
            ),
            Restaurant(
                name="American Diner",
                description="Classic American comfort food",
                image_url="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
                country=Country.AMERICA
            ),
            Restaurant(
                name="NYC Pizza Co",
                description="New York style pizza and Italian-American cuisine",
                image_url="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
                country=Country.AMERICA
            ),
            Restaurant(
                name="Texas BBQ House",
                description="Slow-smoked BBQ and Southern sides",
                image_url="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
                country=Country.AMERICA
            ),
        ]
        db.add_all(restaurants)
        db.commit()
        
        menu_items = [
            MenuItem(restaurant_id=1, name="Butter Chicken", description="Creamy tomato-based chicken curry", price=350, image_url="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300"),
            MenuItem(restaurant_id=1, name="Biryani", description="Basmati chawal with spices", price=300, image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300"),
            MenuItem(restaurant_id=1, name="Naan", description="Freshly baked in tandoor", price=60, image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300"),
            MenuItem(restaurant_id=2, name="Chole Bhature", description="Spiced chole with fried bread", price=180, image_url="https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=300"),
            MenuItem(restaurant_id=2, name="Pav Bhaji", description="Spiced vegetable mash with buttered bread", price=150, image_url="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300"),
            MenuItem(restaurant_id=3, name="Vada Pav", description="Mumbai style aloo burger", price=50, image_url="https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300"),
            MenuItem(restaurant_id=3, name="Samosa", description="Crispy fried pastry with spiced filling", price=40, image_url="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=300"),
            MenuItem(restaurant_id=4, name="Classic Burger", description="Aloo patty with all the fixings", price=12.99, image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"),
            MenuItem(restaurant_id=4, name="Mac and Cheese", description="Creamy three-cheese pasta", price=9.99, image_url="https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=300"),
            MenuItem(restaurant_id=4, name="Milkshake", description="Thick and creamy vanilla shake", price=5.99, image_url="https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300"),
            MenuItem(restaurant_id=5, name="Italiana Pizza", description="Classic Italian slice", price=18.99, image_url="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300"),
            MenuItem(restaurant_id=5, name="Margherita Pizza", description="Fresh mozzarella and basil", price=16.99, image_url="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300"),
            MenuItem(restaurant_id=6, name="Cookie Plate", description="Cookie plate", price=22.99, image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=300"),
            MenuItem(restaurant_id=6, name="Mexican Wrap", description="Slow-cooked Mexican wrap", price=14.99, image_url="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300"),
            MenuItem(restaurant_id=6, name="Lamb Wrap", description="Fall-off-the-bone lamb wrap", price=24.99, image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=300"),
        ]
        db.add_all(menu_items)
        db.commit()
        
        admin = db.query(User).filter(User.email == "nick@slooze.com").first()
        payment_methods = [
            PaymentMethod(user_id=admin.id, type=PaymentType.CARD, last_four="4242", is_default=True),
            PaymentMethod(user_id=admin.id, type=PaymentType.UPI, last_four="@upi", is_default=False),
        ]
        db.add_all(payment_methods)
        db.commit()
        
        print("Database seeded successfully")
        print(f"\nTest credentials (password: {seed_password}):")
        for user in users:
            print(f"  {user.name}: {user.email} ({user.role.value}, {user.country.value})")
        
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
