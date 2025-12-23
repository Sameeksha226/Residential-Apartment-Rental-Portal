from flask import Blueprint, request, jsonify
from models import db, Bookings
from datetime import datetime
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt
)

bookings_bp = Blueprint('bookings', __name__)

# -------------------------------
# CREATE BOOKING (USER)
# -------------------------------
@bookings_bp.route("/create", methods=["POST"], strict_slashes=False)
@jwt_required()
def create_booking():
    #user_id = int(get_jwt_identity())  # identity is STRING
    data = request.get_json() or {}
    user_id=data.get("user_id")
    unit_id = data.get("unit_id")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not user_id or not unit_id or not start_date or not end_date:
        return jsonify({"message":"user_id, unit_id, start_date, end_date required"}), 422

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Date format must be YYYY-MM-DD"}), 400

    booking = Bookings(
        user_id=user_id,
        unit_id=unit_id,
        start_date=start_date,
        end_date=end_date
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created",
        "id": booking.id
    }), 201


# -------------------------------
# LIST BOOKINGS (USER / ADMIN)
# -------------------------------
@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def list_bookings():
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    if claims.get("role") == "admin":
        bookings = Bookings.query.all()
    else:
        bookings = Bookings.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": b.id,
            "status": b.status,
            "start_date": b.start_date.isoformat() if b.start_date else None,
            "end_date": b.end_date.isoformat() if b.end_date else None,

            # ✅ IMPORTANT FIELDS
            "unit_name": b.unit.unit_id if b.unit else None,
            "tower_name": b.unit.tower.name if b.unit and b.unit.tower else None,
            "tower_address": b.unit.tower.address if b.unit and b.unit.tower else None,
        }
        for b in bookings
    ]), 200



# -------------------------------
# GET SINGLE BOOKING
# -------------------------------
@bookings_bp.route("/get/<int:booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    booking = Bookings.query.get_or_404(booking_id)

    if claims.get("role") != "admin" and booking.user_id != user_id:
        return jsonify({"message": "Access denied"}), 403

    return jsonify(booking.to_dict()), 200


# -------------------------------
# UPDATE BOOKING (ADMIN ONLY)
# -------------------------------
@bookings_bp.route("/update/<int:booking_id>", methods=["PATCH"])
@jwt_required()
def update_booking(booking_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Admin only"}), 403

    data = request.get_json() or {}
    booking = Bookings.query.get_or_404(booking_id)

    if "status" in data:
        booking.status = data["status"]

    if "admin_note" in data:
        booking.admin_note = data["admin_note"]

    db.session.commit()

    return jsonify({"message": "Booking updated"}), 200

@bookings_bp.route('/unit', methods=['POST'])
@jwt_required()
def book_unit():
    user_id = int(get_jwt_identity())  # identity is string
    data = request.get_json()

    unit_id = data.get('unit_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not unit_id or not start_date or not end_date:
        return jsonify({"message": "unit_id, start_date, end_date required"}), 422

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Date format must be YYYY-MM-DD"}), 400

    booking = Bookings(
        user_id=user_id,
        unit_id=unit_id,
        start_date=start_date,
        end_date=end_date,
        status='pending'
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'message': 'Booking request sent to admin',
        'booking': booking.to_dict()
    }), 201