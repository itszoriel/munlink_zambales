"""Municipality and Barangay routes."""
from flask import Blueprint, jsonify, request
from apps.api.models.municipality import Municipality, Barangay
from apps.api import db

municipalities_bp = Blueprint('municipalities', __name__, url_prefix='/api/municipalities')


@municipalities_bp.route('', methods=['GET'])
def list_municipalities():
    """Get list of all municipalities in Zambales."""
    try:
        municipalities = Municipality.query.filter_by(is_active=True).all()
        
        return jsonify({
            'count': len(municipalities),
            'municipalities': [m.to_dict() for m in municipalities]
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get municipalities', 'details': str(e)}), 500


@municipalities_bp.route('/<int:municipality_id>', methods=['GET'])
def get_municipality(municipality_id):
    """Get details of a specific municipality."""
    try:
        municipality = Municipality.query.get(municipality_id)
        
        if not municipality:
            return jsonify({'error': 'Municipality not found'}), 404
        
        include_barangays = request.args.get('include_barangays', 'false').lower() == 'true'
        
        return jsonify(municipality.to_dict(include_barangays=include_barangays)), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get municipality', 'details': str(e)}), 500


@municipalities_bp.route('/slug/<slug>', methods=['GET'])
def get_municipality_by_slug(slug):
    """Get municipality by slug."""
    try:
        municipality = Municipality.query.filter_by(slug=slug).first()
        
        if not municipality:
            return jsonify({'error': 'Municipality not found'}), 404
        
        include_barangays = request.args.get('include_barangays', 'false').lower() == 'true'
        
        return jsonify(municipality.to_dict(include_barangays=include_barangays)), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get municipality', 'details': str(e)}), 500


@municipalities_bp.route('/<int:municipality_id>/barangays', methods=['GET'])
def list_barangays(municipality_id):
    """Get list of barangays in a municipality."""
    try:
        municipality = Municipality.query.get(municipality_id)
        
        if not municipality:
            return jsonify({'error': 'Municipality not found'}), 404
        
        barangays = Barangay.query.filter_by(
            municipality_id=municipality_id,
            is_active=True
        ).all()
        
        return jsonify({
            'municipality': municipality.name,
            'count': len(barangays),
            'barangays': [b.to_dict() for b in barangays]
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get barangays', 'details': str(e)}), 500


@municipalities_bp.route('/barangays/<int:barangay_id>', methods=['GET'])
def get_barangay(barangay_id):
    """Get details of a specific barangay."""
    try:
        barangay = Barangay.query.get(barangay_id)
        
        if not barangay:
            return jsonify({'error': 'Barangay not found'}), 404
        
        data = barangay.to_dict()
        data['municipality'] = barangay.municipality.to_dict()
        
        return jsonify(data), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get barangay', 'details': str(e)}), 500
