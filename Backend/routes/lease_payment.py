from flask import Blueprint,request,jsonify
from models import db,Lease,Payment,Unit,Tower
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt

lease_bp=Blueprint('lease',__name__)

from datetime import datetime

@lease_bp.route("/create", methods=['POST'])
@jwt_required()
def create_lease():
    role = get_jwt()['role']
    if role != 'admin':
        return jsonify({"message": "admin only"}), 403

    data = request.get_json() or {}

    booking_id = data.get('booking_id')
    user_id = data.get('user_id')
    unit_id = data.get('unit_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    rent_amount = data.get('rent_amount')
    deposit = data.get('deposit')  # ✅ FIXED
    status = data.get('status', 'active')

    # ✅ REQUIRED FIELD CHECK
    if not all([booking_id, start_date, end_date, rent_amount, deposit]):
        return jsonify({
            "message": "booking_id, start_date, end_date, rent_amount and deposit are required"
        }), 400

    # ✅ CONVERT STRING → DATE
    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    lease = Lease(
        booking_id=booking_id,
        user_id=user_id,
        unit_id=unit_id,
        start_date=start_date,
        end_date=end_date,
        rent_amount=rent_amount,
        deposit=deposit,
        status=status
    )

    db.session.add(lease)
    db.session.commit()

    return jsonify({
        "message": "Lease created successfully",
        "id": lease.id
    }), 200


@lease_bp.route("/", methods=['GET'])
@jwt_required()
def list_leases():
    identity = int(get_jwt_identity())
    role = get_jwt()['role']

    if role == 'admin':
        leases = (
            db.session.query(Lease, Unit, Tower)
            .join(Unit, Lease.unit_id == Unit.id)
            .join(Tower, Unit.tower_id == Tower.id)
            .limit(100)
            .all()
        )

        return jsonify([
            {
                **l.to_dict(),
                "unit_name": u.unit_id,
                "tower_name": t.name
            }
            for l, u, t in leases
        ]), 200

    else:
        leases = (
            db.session.query(Lease, Unit, Tower)
            .join(Unit, Lease.unit_id == Unit.id)
            .join(Tower, Unit.tower_id == Tower.id)
            .filter(Lease.user_id == identity)
            .all()
        )

        return jsonify([
            {
                **l.to_dict(),
                "unit_name": u.unit_id,
                "tower_name": t.name
            }
            for l, u, t in leases
        ]), 200


@lease_bp.route("/get/<int:lease_id>",methods=['GET'])
@jwt_required()
def get_lease(lease_id):   #get a lease details
    identity=get_jwt_identity()
    id=get_jwt()['id']
    role=get_jwt()['role']
    l=Lease.query.get_or_404(lease_id)
    if role !='admin' and l.user_id != id:
        return jsonify({"message":"access denied"}),403
    return jsonify({'id':l.id,
                    'booking_id': l.booking_id,
                    'user_id': l.user_id,
                    'unit_id': l.unit_id,
                    'start_date': str(l.start_date),
                    'end_date': str(l.end_date),
                    'rent_amount': str(l.rent_amount),
                    'deposit': str(l.deposit),
                    'status': l.status})

@lease_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_leases(user_id):
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({'message': 'Admin only'}), 403

    leases = Lease.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            'id': l.id,
            'rent_amount': l.rent_amount,
            'deposit': l.deposit,
            'start_date': l.start_date,
            'end_date': l.end_date
        }
        for l in leases
    ])


@lease_bp.route("/update/<int:lease_id>",methods=['PATCH'])
@jwt_required()
def update_lease(lease_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    l=Lease.query.get_or_404(lease_id)
    data=request.get_json() or {}
    l.start_date=data.get('start_date',l.start_date)
    l.end_date=data.get('end_date',l.end_date)
    l.rent_amount=data.get('rent_amount',l.rent_amount)
    l.deposit=data.get('deposit',l.deposit)
    l.status=data.get('status',l.status)
    db.session.commit()
    return jsonify({"message":"Lease updated"}),200

@lease_bp.route("delete/<int:lease_id>",methods=['DELETE'])
@jwt_required()
def delete_lease(lease_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    l=Lease.query.get_or_404(lease_id)
    db.session.delete(l)
    db.session.commit()
    return jsonify({"message":"Lease deleted"}),200

@lease_bp.route("/payment/create",methods=['POST'])
@jwt_required()
def create_payment():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    lease_id = data.get('lease_id')
    amount = data.get('amount')
    payment_method = data.get('payment_method')

    if not lease_id or not amount or not payment_method:
        return jsonify({'message': 'lease_id, amount and payment_method required'}), 400

    lease = Lease.query.filter_by(id=lease_id, user_id=user_id).first()
    if not lease:
        return jsonify({'message': 'Invalid lease'}), 404

    payment = Payment(
        lease_id=lease_id,
        amount=amount,
        payment_date=datetime.utcnow().date(),
        payment_method=payment_method,
        status='completed',
        transaction_id=f"TXN{int(datetime.utcnow().timestamp())}"
    )

    db.session.add(payment)
    db.session.commit()

    return jsonify({'message': 'Payment successful'}), 201



@lease_bp.route("/my-payments", methods=["GET"])
@jwt_required()
def my_payments():
    user_id = int(get_jwt_identity())
    payments = (
        Payment.query
        .join(Lease)
        .filter(Lease.user_id == user_id)
        .all()
    )

    return jsonify([p.to_dict() for p in payments])

@lease_bp.route('/payments/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_payments(user_id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Admin only'}), 403

    payments = (
        db.session.query(Payment)
        .join(Lease)
        .filter(Lease.user_id == user_id)
        .all()
    )

    return jsonify([
        {
            'id': p.id,
            'lease_id': p.lease_id,
            'amount': p.amount,
            'payment_date': p.payment_date.isoformat() if p.payment_date else None,
            'payment_method': p.payment_method,
            'status': p.status,
            'transaction_id': p.transaction_id
        }
        for p in payments
    ]), 200
