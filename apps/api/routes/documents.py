"""Document types and requests routes."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

try:
    from apps.api import db
    from apps.api.models.document import DocumentType, DocumentRequest
    from apps.api.models.user import User
    from apps.api.utils import (
        validate_required_fields,
        ValidationError,
        save_document_request_file,
        fully_verified_required,
    )
except ImportError:
    from __init__ import db
    from models.document import DocumentType, DocumentRequest
    from models.user import User
    from utils import (
        validate_required_fields,
        ValidationError,
        save_document_request_file,
        fully_verified_required,
    )


documents_bp = Blueprint('documents', __name__, url_prefix='/api/documents')


@documents_bp.route('/types', methods=['GET'])
def list_document_types():
    """Public list of active document types."""
    try:
        types = DocumentType.query.filter_by(is_active=True).all()
        return jsonify({
            'types': [t.to_dict() for t in types],
            'count': len(types)
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get document types', 'details': str(e)}), 500


@documents_bp.route('/requests', methods=['POST'])
@jwt_required()
@fully_verified_required
def create_document_request():
    """Create a new document request for the current user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        required = ['document_type_id', 'municipality_id', 'delivery_method', 'purpose']
        validate_required_fields(data, required)

        # Enforce municipality scoping: residents may only request in their registered municipality
        if not user.municipality_id or int(user.municipality_id) != int(data['municipality_id']):
            return jsonify({'error': 'You can only request documents in your registered municipality'}), 403

        # Create request
        # Normalize and capture extended fields
        additional_details = data.get('additional_details') or data.get('additional_notes')
        civil_status = data.get('civil_status')
        request_level = data.get('request_level')

        # If new columns are not present in DB yet, store structured data in additional_notes as JSON
        import json
        notes_value = additional_details
        extra_payload = {}
        if civil_status:
            extra_payload['civil_status'] = civil_status
        if request_level:
            extra_payload['request_level'] = request_level
        if extra_payload:
            notes_value = json.dumps({ 'text': additional_details or '', **extra_payload })

        req = DocumentRequest(
            request_number=f"REQ-{user_id}-{User.query.count()}-{DocumentRequest.query.count()+1}",
            user_id=user_id,
            document_type_id=data['document_type_id'],
            municipality_id=data['municipality_id'],
            barangay_id=data.get('barangay_id'),
            delivery_method=data['delivery_method'],
            delivery_address=data.get('delivery_address'),
            purpose=data['purpose'],
            additional_notes=notes_value,
            supporting_documents=data.get('supporting_documents') or [],
            status='pending',
        )

        # Gracefully set new fields if columns exist
        try:
            if hasattr(req, 'civil_status') and civil_status is not None:
                setattr(req, 'civil_status', civil_status)
            if hasattr(req, 'request_level') and request_level is not None:
                setattr(req, 'request_level', request_level)
        except Exception:
            pass

        db.session.add(req)
        db.session.commit()

        return jsonify({'message': 'Request created successfully', 'request': req.to_dict()}), 201

    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create document request', 'details': str(e)}), 500


@documents_bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    """Get current user's document requests."""
    try:
        user_id = get_jwt_identity()
        requests_q = DocumentRequest.query.filter_by(user_id=user_id).order_by(DocumentRequest.created_at.desc()).all()
        return jsonify({
            'count': len(requests_q),
            'requests': [r.to_dict() for r in requests_q]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get document requests', 'details': str(e)}), 500


@documents_bp.route('/requests/<int:request_id>', methods=['GET'])
@jwt_required()
def get_request_detail(request_id: int):
    """Get a specific request detail (owned by user)."""
    try:
        user_id = get_jwt_identity()
        r = DocumentRequest.query.get(request_id)
        if not r or r.user_id != int(user_id):
            return jsonify({'error': 'Request not found'}), 404
        return jsonify({'request': r.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get request', 'details': str(e)}), 500


@documents_bp.route('/requests/<int:request_id>/upload', methods=['POST'])
@jwt_required()
@fully_verified_required
def upload_request_files(request_id: int):
    """Upload supporting documents to a request (owned by user). Accepts multiple 'file' parts."""
    try:
        user_id = get_jwt_identity()
        r = DocumentRequest.query.get(request_id)
        if not r or r.user_id != int(user_id):
            return jsonify({'error': 'Request not found'}), 404

        if not request.files:
            return jsonify({'error': 'No files uploaded'}), 400

        # Determine municipality slug from request
        municipality_slug = r.municipality.slug if getattr(r, 'municipality', None) else 'unknown'

        saved = []
        # Accept multiple 'file' fields
        for key in request.files:
            files = request.files.getlist(key)
            for f in files:
                rel = save_document_request_file(f, r.id, municipality_slug)
                saved.append(rel)

        existing = r.supporting_documents or []
        r.supporting_documents = existing + saved
        db.session.commit()

        return jsonify({'message': 'Files uploaded', 'files': saved, 'request': r.to_dict()}), 200
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload files', 'details': str(e)}), 500


