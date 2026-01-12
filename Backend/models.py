from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


# ---------------- USERS ----------------
class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship("Bookings", backref="user", lazy=True,cascade="all, delete-orphan",passive_deletes=True)
    sent_messages = db.relationship(
        'Message',
        foreign_keys='Message.sender_id',
        back_populates='sender',
        cascade='all, delete-orphan'
    )

    received_messages = db.relationship(
        'Message',
        foreign_keys='Message.receiver_id',
        back_populates='receiver',
        cascade='all, delete-orphan'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }


# ---------------- TOWER ----------------
class Tower(db.Model):
    __tablename__ = 'tower'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    address = db.Column(db.String(250), nullable=False)
    total_floors = db.Column(db.Integer, nullable=False)

    units = db.relationship('Unit', backref='tower', lazy=True, cascade='all, delete-orphan',passive_deletes=True)
    amenities = db.relationship('Amenity', backref='tower', lazy=True,passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'total_floors': self.total_floors
        }


# ---------------- UNIT ----------------
class Unit(db.Model):
    __tablename__ = 'unit'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    tower_id = db.Column(db.Integer, db.ForeignKey('tower.id', ondelete="CASCADE"), nullable=False)
    unit_id = db.Column(db.String(50), nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    area_sqft = db.Column(db.Float, nullable=False)
    rent = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(100), default='available')
    description = db.Column(db.Text)
    image_url = db.Column(db.String(250))

    bookings = db.relationship('Bookings', backref='unit', lazy=True,cascade="all, delete-orphan",passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'tower_id': self.tower_id,
            'unit_id': self.unit_id,
            'floor': self.floor,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'area_sqft': self.area_sqft,
            'rent': self.rent,
            'status': self.status,
            'description': self.description,
            'image_url': self.image_url
        }


# ---------------- AMENITY ----------------
class Amenity(db.Model):
    __tablename__ = 'amenity'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    tower_id = db.Column(db.Integer, db.ForeignKey('tower.id'), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text)
    capacity = db.Column(db.Integer)
    image_url = db.Column(db.String(750))

    def to_dict(self):
        return {
            'id': self.id,
            'tower_id': self.tower_id,
            'name': self.name,
            'description': self.description,
            'capacity': self.capacity,
            'image_url': self.image_url
        }


# ---------------- BOOKINGS ----------------
class Bookings(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id', ondelete="CASCADE"))
    status = db.Column(db.String(20), default='pending')
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    start_date = db.Column(db.Date,nullable=False)
    end_date = db.Column(db.Date,nullable=False)
    admin_note = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'unit_id': self.unit_id,
            'status': self.status,
            'booking_date': self.booking_date.isoformat(),
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'admin_note': self.admin_note,
            'updated_at': self.updated_at.isoformat()
        }


# ---------------- LEASE ----------------
class Lease(db.Model):
    __tablename__ = 'lease'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id', ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id', ondelete="CASCADE"))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    rent_amount = db.Column(db.Numeric(10, 2))
    deposit = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(100), default='active')

    booking = db.relationship("Bookings", backref=db.backref("lease", uselist=False),lazy=True,passive_deletes=True)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'user_id': self.user_id,
            'unit_id': self.unit_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'rent_amount': str(self.rent_amount),
            'deposit': self.deposit,
            'status': self.status
        }


# ---------------- PAYMENT ----------------
class Payment(db.Model):
    __tablename__ = 'payment'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id', ondelete="CASCADE"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50))
    status = db.Column(db.String(20), default='pending')
    transaction_id = db.Column(db.String(100))

    lease = db.relationship(
    "Lease",
    backref=db.backref(
        "payments",
        cascade="all, delete-orphan",
        passive_deletes=True
    ),
    lazy=True
)


    def to_dict(self):
        return {
            'id': self.id,
            'lease_id': self.lease_id,
            'amount': self.amount,
            'payment_date': self.payment_date.isoformat(),
            'payment_method': self.payment_method,
            'status': self.status,
            'transaction_id': self.transaction_id
        }

class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Who sent the message
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)

    # Who should receive the message
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)

    # Message content
    message = db.Column(db.Text, nullable=False)


    # Read tracking
    is_read = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship(
        'Users',
        foreign_keys=[sender_id],
        back_populates='sent_messages'
    )

    receiver = db.relationship(
        'Users',
        foreign_keys=[receiver_id],
        back_populates='received_messages'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }
