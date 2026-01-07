from flask import Blueprint,request,jsonify
from models import db,Unit,Amenity,Tower
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt

units_bp=Blueprint('units',__name__)

@units_bp.route('/',methods=['GET'])
def list_units():   #listing all the units
    units=Unit.query.limit(100).all()
    out=[]
    for u in units:
        out.append({'id':u.id,
                    'tower_id': u.tower_id,
                    'unit_id': u.unit_id,
                    'floor': u.floor,
                    'bedrooms': u.bedrooms,
                    'bathrooms': u.bathrooms,
                    'area_sqft': u.area_sqft,
                    'rent':str(u.rent),
                    'status': u.status,
                    'description': u.description,
                    'image_url': u.image_url
                    })
    return jsonify(out)
        
@units_bp.route('/get/<int:unit_id>',methods=['GET'])
def get_unit(unit_id):   #get a unit details
    u=Unit.query.get_or_404(unit_id)
    return jsonify({'id':u.id,
                    'tower_id': u.tower_id,
                    'unit_id': u.unit_id,
                    'floor': u.floor,
                    'bedrooms': u.bedrooms,
                    'bathrooms': u.bathrooms,
                    'area_sqft': u.area_sqft,
                    'rent':str(u.rent),
                    'status': u.status,
                    'description': u.description,
                    'image_url': u.image_url})

@units_bp.route("/create",methods=['POST'])
@jwt_required()
def create_unit():
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    data=request.get_json() or {}
    u=Unit(tower_id=data.get('tower_id'),
            unit_id=data.get('unit_id'),
            floor=data.get('floor'),
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            area_sqft=data.get('area_sqft'),
            rent=data.get('rent'),
            status=data.get('status','available'),
            description=data.get('description'),
            image_url=data.get('image_url'))
    db.session.add(u)
    db.session.commit()
    return jsonify({"message":"Unit created","id":u.id}),200

@units_bp.route('/update/<int:unit_id>',methods=['PATCH'])
@jwt_required()
def update_unit(unit_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    data=request.get_json() or {}
    u=Unit.query.get_or_404(unit_id)
    if 'tower_id' in data:
        u.tower_id=data['tower_id']
    if 'unit_id' in data:
        u.unit_id=data['unit_id']
    if 'floor' in data:
        u.floor=data['floor']
    if 'bedrooms' in data:
        u.bedrooms=data['bedrooms']
    if 'bathrooms' in data:
        u.bathrooms=data['bathrooms']
    if 'area_sqft' in data:
        u.area_sqft=data['area_sqft']
    if 'rent' in data:
        u.rent=data['rent']
    if 'status' in data:
        u.status=data['status']
    if 'description' in data:
        u.description=data['description']
    if 'image_url' in data:
        u.image_url=data['image_url']
    db.session.add(u)
    db.session.commit()
    return jsonify({'message':'Unit updated'})

@units_bp.route('/delete/<int:unit_id>',methods=['DELETE'])
@jwt_required()
def delete_unit(unit_id):
    identity=get_jwt_identity()
    role=get_jwt()['role']
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    u=Unit.query.get_or_404(unit_id)
    db.session.delete(u)
    db.session.commit()
    return jsonify({'message':'Unit deleted'})

@units_bp.route('/details/<int:unit_id>', methods=['GET'])
def unit_details(unit_id):
    unit = Unit.query.get_or_404(unit_id)
    tower = unit.tower

    return jsonify({
        'unit': {
            **unit.to_dict(),
            'tower_name': tower.name,
            'tower_address': tower.address
        },
        'amenities': [a.name for a in tower.amenities]
    })

@units_bp.route('/units-by-tower/<int:tower_id>',methods=['GET'])
def units_by_tower(tower_id):
    unit=Unit.query.filter_by(tower_id=tower_id)
    return jsonify({
        'unit':unit.to_dict()
    })

@units_bp.route('/available', methods=['GET'])
@jwt_required()
def get_available_units():
    units = Unit.query.filter_by(status='available').all()

    return jsonify([
        {
            'id': u.id,
            'tower_id': u.tower_id,
            'unit_id': u.unit_id,
            'floor': u.floor,
            'bedrooms': u.bedrooms,
            'bathrooms': u.bathrooms,
            'area_sqft': u.area_sqft,
            'rent': u.rent,
            'status': u.status,
            'description': u.description,
            'image_url': u.image_url
        }
        for u in units
    ]), 200
