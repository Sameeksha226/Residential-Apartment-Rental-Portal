from models import db,Amenity,Lease,Payment
from flask import Blueprint,request,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt

amenity_bp=Blueprint('amenity',__name__)

@amenity_bp.route("/",methods=['GET'])
def list_amenities():   #listing all the amenities
    amenities=Amenity.query.limit(100).all()
    out=[]
    for a in amenities:
        out.append({'id':a.id,
                    'tower_id': a.tower_id,
                    'name': a.name,
                    'description': a.description,
                    'capacity': a.capacity,
                    'available': a.available
                    })
    return jsonify(out)

@amenity_bp.route("/create",methods=['POST'])
@jwt_required()
def create_amenity():
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    data=request.get_json() or {}
    ava=data.get('available')
    ap=True if ava==True else False
    a=Amenity(tower_id=data.get('tower_id'),
              name=data.get('name'),
              description=data.get('description'),
              capacity=data.get('capacity'),
              available=ap,
              icon=data.get('icon'),
              image_url=data.get('image_url'))
    db.session.add(a)
    db.session.commit()
    return jsonify({"message":"Amenity created","id":a.id}),200

@amenity_bp.route("/update/<int:amenity_id>",methods=['PATCH'])
@jwt_required()
def update_amenity(amenity_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    a=Amenity.query.get_or_404(amenity_id)
    data=request.get_json() or {}
    a.name=data.get('name',a.name)
    a.description=data.get('description',a.description)
    a.capacity=data.get('capacity',a.capacity)
    a.available=data.get('available',a.available)
    db.session.commit()
    return jsonify({"message":"Amenity updated"}),200

@amenity_bp.route("/delete/<int:amenity_id>",methods=['DELETE'])
@jwt_required()
def delete_amenity(amenity_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    a=Amenity.query.get_or_404(amenity_id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({"message":"Amenity deleted"}),200