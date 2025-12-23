from flask import Blueprint,request,jsonify
from models import db,Tower
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt

tower_bp=Blueprint('tower',__name__)

@tower_bp.route("/",methods=['GET'])
def list_tower():
    towers=Tower.query.limit(100).all()
    out=[]
    for t in towers:
        out.append({
            'id':t.id,
            'name':t.name,
            'address':t.address,
            'total_floors':t.total_floors
        })
    return jsonify(out)

@tower_bp.route("/create",methods=['POST'])
@jwt_required()
def create_tower():
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    data=request.get_json() or {}
    name=data.get('name')
    address=data.get('address')
    total_floors=data.get('total_floors')
    t=Tower(name=name,address=address,total_floors=total_floors)
    db.session.add(t)
    db.session.commit()
    return jsonify({"message":"Tower Created Successfully"})

@tower_bp.route("/get/<int:tower_id>",methods=['GET'])
@jwt_required()
def tower_details(tower_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    t=Tower.query.get_or_404(tower_id)
    return jsonify({
        'id':t.id,
        'name':t.name,
        'address':t.address,
        'total_floors':t.total_floors
    })

@tower_bp.route("/update/<int:tower_id>",methods=['PATCH'])
@jwt_required()
def update_tower(tower_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    t=Tower.query.get_or_404(tower_id)
    data=request.get_json() or {}
    if 'name' in data:
        t.name=data['name']
    if 'address' in data:
        t.address=data['address']
    if 'total_floors' in data:
        t.total_floors=data['total_floors']
    db.session.add(t)
    db.session.commit()
    return jsonify({"message":"updated"}),200

@tower_bp.route("/delete/<int:tower_id>",methods=['DELETE'])
@jwt_required()
def del_tower(tower_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    t=Tower.query.get_or_404(tower_id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({"message":"Tower deleted"}),200
    