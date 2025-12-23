from flask import Blueprint,request,jsonify
from models import db,Lease,Payment
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt

lease_bp=Blueprint('lease',__name__)

@lease_bp.route("/create",methods=['POST'])
@jwt_required()
def create_lease():
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    data=request.get_json() or {}
    booking_id=data.get('booking_id')
    user_id=data.get('user_id')
    unit_id=data.get('unit_id')
    start_date=data.get('start_date')
    end_date=data.get('end_date')
    rent_amount=data.get('rent_amount')
    deposit=data.get('deposit_amount')
    status=data.get('status')
    if not booking_id or not start_date or not end_date or not rent_amount or not deposit:
        return jsonify({"message":"booking_id, start_date, end_date and rent_amount are required"}),400
    l = Lease(booking_id=booking_id,user_id=user_id,unit_id=unit_id,start_date=start_date, end_date=end_date, rent_amount=rent_amount,deposit=deposit,status=status)
    db.session.add(l)
    db.session.commit()
    return jsonify({"message":"Lease created","id":l.id}),200

@lease_bp.route("/",methods=['GET'])
@jwt_required()
def list_leases():   #listing all leases
    identity=int(get_jwt_identity())
    role=get_jwt()['role']
    if role =='admin':
        leases=Lease.query.limit(100).all()
        return  jsonify({[
            l.to_dict() for l in leases
        ]
    })
    else:
        leases=Lease.query.filter_by(user_id=identity).all()
        return jsonify([
        {
            **l.to_dict(),
            "unit_name": l.unit.unit_id if l.unit else None,
            "tower_name": l.unit.tower.name if l.unit else None
        }
        for l in leases
    ])

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
