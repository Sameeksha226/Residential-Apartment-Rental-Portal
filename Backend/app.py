from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_cors import CORS
from models import db,Users,Tower,Unit,Amenity,Bookings,Lease,Payment
import models
from datetime import date, time
from routes.auth import auth_bp
from routes.bookings import bookings_bp
from routes.units import units_bp
from routes.amenity import amenity_bp
from routes.towers import tower_bp
from routes.lease_payment import lease_bp



app=Flask(__name__)

app.config["JWT_SECRET_KEY"]=os.getenv("JWT_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL"," YOUR_DEFAULT_DATABASE_URL_HERE")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]

CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:4200",'http://localhost:4208']}},
    supports_credentials=True,allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
)

jwt=JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)
# Register all API blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(units_bp, url_prefix='/api/units')
app.register_blueprint(amenity_bp, url_prefix='/api/amenities')
app.register_blueprint(tower_bp, url_prefix='/api/towers')
app.register_blueprint(lease_bp, url_prefix='/api/lease')


@app.cli.command('create-db')
def create_db():
    """
    CLI command: `flask create-db` — creates tables from models.
    (Requires FLASK_APP=app.py and the app to be importable)
    """
    with app.app_context():
        db.create_all()
        seed_data()
        print("Database tables created.")

def seed_data():
    """Initialize Database"""
    if Users.query.first() is None:
        # Create admin Users
        admin = Users(
            name='Admin',
            phone='1234567890',
            email='admin@rental.com',
            role='admin'
        )
        admin.set_password('admin123')
        
        # Create resident Userss
        resident1 = Users(
            name='John Doe',
            phone='9876543210',
            email='john@example.com',
            role='user'
        )
        resident1.set_password('user1')
        
        resident2 = Users(
            name='Jane Smith',
            phone='9876543211',
            email='jane@example.com',
            role='user'
        )
        resident2.set_password('user2')
        
        db.session.add_all([admin, resident1, resident2]) 
        db.session.commit()  

        tower1=Tower(
            name="High Rise Apartments",
            address="123 Main St, Cityville",
            total_floors=20
        ) 
        tower2=Tower(
            name="Sunset Towers",
            address="456 Elm St, Townsville",
            total_floors=15
        )
        db.session.add_all([tower1, tower2])
        db.session.commit()

        units = [
            Unit(tower_id=tower1.id, unit_id='A-101', floor=1, bedrooms=1, bathrooms=2, 
                 area_sqft=900, rent=1500, status='available',
                 description='Cozy 1BHK with city view',
                 image_url='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'),
            Unit(tower_id=tower1.id, unit_id='A-102', floor=1, bedrooms=3, bathrooms=2, 
                 area_sqft=1500, rent=3000, status='available',
                 description='Luxurious 3BHK apartment with balcony',
                 image_url='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
            Unit(tower_id=tower1.id, unit_id='A-201', floor=2, bedrooms=2, bathrooms=2, 
                 area_sqft=1000, rent=2000, status='occupied',
                 description='Spacious 2BHK modern amenities ',
                 image_url='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
            Unit(tower_id=tower2.id, unit_id='B-101', floor=1, bedrooms=2, bathrooms=2, 
                 area_sqft=1000, rent=2000, status='available',
                 description='Modern 2BHK with premium fittings and amenities',
                 image_url='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
            Unit(tower_id=tower2.id, unit_id='B-301', floor=3, bedrooms=3, bathrooms=3, 
                 area_sqft=1800, rent=3000, status='available',
                 description='Premium 3BHK penthouse with terrace and luxurious space',
                 image_url='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'),
        ]
        db.session.add_all(units)
        db.session.commit()
        
        # Create amenities
        amenities = [
            Amenity(tower_id=tower1.id,name='Swimming Pool', description='Olympic size swimming pool with separate kids area',
                   capacity=50, available=True, icon='pool',
                   image_url='https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800'),
            Amenity(tower_id=tower1.id,name='Gym', description='Fully equipped gym with modern fitness equipment',
                   capacity=30, available=True, icon='fitness_center',
                   image_url='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),
            Amenity(tower_id=tower1.id,name='Parking', description='Covered parking with 24/7 security',
                   capacity=100, available=True, icon='local_parking',
                   image_url='https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'),
            Amenity(tower_id=tower2.id,name='Club House', description='Multi-purpose club house for events and gatherings',
                   capacity=80, available=True, icon='home',
                   image_url='https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'),
            Amenity(tower_id=tower2.id,name='Tennis Court', description='Professional tennis court with lighting',
                   capacity=4, available=True, icon='sports_tennis',
                   image_url='https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'),
            Amenity(tower_id=tower2.id,name='Kids Play Area', description='Safe and fun play area for children',
                   capacity=20, available=True, icon='child_care',
                   image_url='https://images.unsplash.com/photo-1587845750216-13825d79fadb?w=800'),
        ]
        db.session.add_all(amenities)
        db.session.commit()

        # Create sample bookings
        bookings = [
            Bookings(user_id=resident1.id, amenity_id=amenities[0].id,
                   booking_date=date.today(), start_date=date(2025,11,28), end_date=date(2025,12,15),
                   status='approved', admin_note='Morning swim session'),
            Bookings(user_id=resident2.id, amenity_id=amenities[1].id,
                   booking_date=date.today(), start_date=date(2025,11,14), end_date=date(2025,12,5),
                   status='pending', admin_note='Evening workout',updated_at=date.today()),
        ]
        db.session.add_all(bookings)
        db.session.commit()
        
        # Create sample lease
        lease1 = Lease(
            booking_id=bookings[0].id,
            user_id=resident1.id,
            unit_id=units[2].id,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            rent_amount=2000,
            deposit=5000,
            status='active'
        )
        db.session.add(lease1)
        db.session.commit()
        
        # Create sample payments
        payments = [
            Payment(lease_id=lease1.id, amount=2000, payment_date=date(2024, 1, 5),
                   payment_method='Credit Card', status='completed', transaction_id='TXN001'),
            Payment(lease_id=lease1.id, amount=2000, payment_date=date(2024, 2, 5),
                   payment_method='Bank Transfer', status='completed', transaction_id='TXN002'),
            Payment(lease_id=lease1.id, amount=2000, payment_date=date(2024, 3, 5),
                   payment_method='Credit Card', status='completed', transaction_id='TXN003'),
        ]
        db.session.add_all(payments)
        
        db.session.commit()
        print("Database seeded successfully!")


if __name__== "__main__":
    app.run(debug=True)