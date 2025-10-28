"""Marketplace routes for items, transactions, and messages."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone, timedelta
import sqlite3
from sqlalchemy.exc import OperationalError as SAOperationalError, ProgrammingError as SAProgrammingError
from apps.api import db
from apps.api.models.user import User
from apps.api.models.marketplace import Item, Transaction, Message
from apps.api.models.municipality import Municipality
from apps.api.utils import (
    verified_resident_required,
    fully_verified_required,
    adult_required,
    validate_transaction_type,
    validate_item_condition,
    validate_price,
    ValidationError,
)
from apps.api.utils.file_handler import save_marketplace_image

marketplace_bp = Blueprint('marketplace', __name__, url_prefix='/api/marketplace')


@marketplace_bp.route('/items', methods=['GET'])
def list_items():
    """Get list of marketplace items with optional filters."""
    try:
        # Get query parameters
        municipality_id = request.args.get('municipality_id', type=int)
        category = request.args.get('category')
        transaction_type = request.args.get('transaction_type')
        status = request.args.get('status', 'available')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Build query
        query = Item.query.filter_by(is_active=True)
        
        if municipality_id:
            query = query.filter_by(municipality_id=municipality_id)
        
        if category:
            query = query.filter_by(category=category)
        
        if transaction_type:
            query = query.filter_by(transaction_type=transaction_type)
        
        if status:
            query = query.filter_by(status=status)
        
        # Order by most recent
        query = query.order_by(Item.created_at.desc())
        
        # Paginate
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Include municipality_name for each item
        items_data = []
        for item in paginated.items:
            d = item.to_dict(include_user=True)
            try:
                d['municipality_name'] = item.municipality.name if item.municipality else None
            except Exception:
                d['municipality_name'] = None
            items_data.append(d)

        return jsonify({
            'items': items_data,
            'total': paginated.total,
            'page': page,
            'per_page': per_page,
            'pages': paginated.pages
        }), 200
    
    except (sqlite3.OperationalError, SAOperationalError, SAProgrammingError):
        # SQLite missing table/column; return empty consistent shape
        return jsonify({
            'items': [],
            'total': 0,
            'page': page if 'page' in locals() else (request.args.get('page', 1, type=int) or 1),
            'per_page': per_page if 'per_page' in locals() else (request.args.get('per_page', 20, type=int) or 20),
            'pages': 0
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get items', 'details': str(e)}), 500


@marketplace_bp.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Get details of a specific item."""
    try:
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        if not item.is_active:
            return jsonify({'error': 'Item is no longer available'}), 404
        
        # Increment view count
        item.view_count += 1
        db.session.commit()
        
        return jsonify(item.to_dict(include_user=True)), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get item', 'details': str(e)}), 500


@marketplace_bp.route('/items', methods=['POST'])
@jwt_required()
@fully_verified_required
def create_item():
    """Create a new marketplace item."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json(silent=True) or {}
        
        # Validate required fields
        required_fields = ['title', 'description', 'category', 'condition', 'transaction_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate transaction type and condition
        transaction_type = validate_transaction_type(data['transaction_type'])
        condition = validate_item_condition(data['condition'])
        
        # Validate price if selling
        price = None
        if transaction_type == 'sell':
            if 'price' not in data:
                return jsonify({'error': 'Price is required for sell items'}), 400
            price = validate_price(data['price'], transaction_type)
        
        # Require resident to have a registered municipality
        if not user.municipality_id:
            return jsonify({'error': 'Set your municipality in your profile before posting items'}), 400

        # Create item (force user's municipality/barangay)
        item = Item(
            user_id=user_id,
            title=data['title'],
            description=data['description'],
            category=data['category'],
            condition=condition,
            transaction_type=transaction_type,
            price=price,
            lend_duration_days=data.get('lend_duration_days'),
            security_deposit=data.get('security_deposit'),
            municipality_id=user.municipality_id,
            barangay_id=user.barangay_id,
            pickup_location=data.get('pickup_location'),
            images=[],
            status='pending'
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'message': 'Item created successfully',
            'item': item.to_dict()
        }), 201
    
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create item', 'details': str(e)}), 500


@marketplace_bp.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    """Update an existing item (owner only)."""
    try:
        user_id = get_jwt_identity()
        # Normalize identity to integer when possible to match DB values
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        # Check ownership
        if item.user_id != uid:
            return jsonify({'error': 'You can only edit your own items'}), 403
        
        data = request.get_json(silent=True) or {}
        
        # Update allowed fields
        if 'title' in data:
            item.title = data['title']
        
        if 'description' in data:
            item.description = data['description']
        
        if 'condition' in data:
            item.condition = validate_item_condition(data['condition'])
        
        if 'price' in data and item.transaction_type == 'sell':
            item.price = validate_price(data['price'], item.transaction_type)
        
        if 'status' in data:
            item.status = data['status']
        
        if 'pickup_location' in data:
            item.pickup_location = data['pickup_location']

        if 'images' in data and isinstance(data['images'], list):
            item.images = data['images']
        
        item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Item updated successfully',
            'item': item.to_dict()
        }), 200
    
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update item', 'details': str(e)}), 500


@marketplace_bp.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    """Delete an item (soft delete)."""
    try:
        user_id = get_jwt_identity()
        # Normalize identity to integer when possible to match DB values
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        # Check ownership
        if item.user_id != uid:
            return jsonify({'error': 'You can only delete your own items'}), 403
        
        # Soft delete
        item.is_active = False
        item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Item deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete item', 'details': str(e)}), 500


@marketplace_bp.route('/my-items', methods=['GET'])
@jwt_required()
def get_my_items():
    """Get current user's items."""
    try:
        user_id = get_jwt_identity()
        # flask_jwt_extended returns identity as string in our tokens; cast safely
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id

        items = (
            Item.query
            .filter_by(user_id=uid, is_active=True)
            .order_by(Item.created_at.desc())
            .all()
        )
        
        return jsonify({
            'count': len(items),
            'items': [item.to_dict() for item in items]
        }), 200
    except (sqlite3.OperationalError, SAOperationalError, SAProgrammingError):
        # Missing table/column during early setups: return empty consistent shape
        return jsonify({'count': 0, 'items': []}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get items', 'details': str(e)}), 500


@marketplace_bp.route('/items/<int:item_id>/upload', methods=['POST'])
@jwt_required()
@fully_verified_required
def upload_item_image(item_id):
    """Upload an image for a marketplace item (owner only, max 5)."""
    try:
        user_id = get_jwt_identity()
        # Normalize identity to integer when possible (tokens may carry string ids)
        try:
            uid = int(user_id) if isinstance(user_id, str) else int(user_id)
        except Exception:
            uid = user_id
        item = Item.query.get(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        if item.user_id != uid:
            return jsonify({'error': 'Forbidden'}), 403

        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        file = request.files['file']

        images = item.images or []
        if len(images) >= 5:
            return jsonify({'error': 'Maximum images reached (5)'}), 400

        municipality = Municipality.query.get(item.municipality_id)
        municipality_slug = municipality.slug if municipality else 'unknown'

        rel_path = save_marketplace_image(file, item_id, municipality_slug)
        images.append(rel_path)
        item.images = images
        db.session.commit()

        return jsonify({'message': 'Image uploaded', 'path': rel_path, 'item': item.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload image', 'details': str(e)}), 500


@marketplace_bp.route('/transactions', methods=['POST'])
@jwt_required()
@fully_verified_required
def create_transaction():
    """Create a transaction request (buy, borrow, or request donation)."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        item_id = data.get('item_id')
        buyer_notes = data.get('notes')
        
        if not item_id:
            return jsonify({'error': 'item_id is required'}), 400
        
        # Get item
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        if item.status != 'available':
            return jsonify({'error': 'Item is no longer available'}), 400
        
        # Can't transact with yourself
        if item.user_id == user_id:
            return jsonify({'error': 'You cannot transact with your own item'}), 400
        
        # Enforce municipality scoping: transactions only within user's registered municipality
        if not user.municipality_id or int(user.municipality_id) != int(item.municipality_id):
            return jsonify({'error': 'Transactions are limited to your municipality'}), 403

        # Prevent duplicate pending/proposed requests for same item
        existing_pending = (
            Transaction.query
            .filter(Transaction.item_id == item_id, Transaction.status.in_(['pending', 'awaiting_buyer']))
            .first()
        )
        if existing_pending:
            return jsonify({'error': 'This item already has a pending request'}), 400

        # Create transaction; keep item visible until seller proposes
        transaction = Transaction(
            item_id=item_id,
            buyer_id=user_id,
            seller_id=item.user_id,
            transaction_type=item.transaction_type,
            amount=item.price if item.transaction_type == 'sell' else None,
            buyer_notes=buyer_notes,
            status='pending'
        )

        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Transaction request created successfully',
            'transaction': transaction.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create transaction', 'details': str(e)}), 500


@marketplace_bp.route('/transactions/<int:transaction_id>/propose', methods=['POST'])
@jwt_required()
def propose_transaction(transaction_id):
    """Seller proposes pickup datetime and location; moves status to awaiting_buyer."""
    try:
        user_id = get_jwt_identity()
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        data = request.get_json(silent=True) or {}
        pickup_at_raw = (data.get('pickup_at') or '').strip()
        pickup_location = (data.get('pickup_location') or '').strip()
        if not pickup_at_raw:
            return jsonify({'error': 'pickup_at is required'}), 400
        if not pickup_location:
            return jsonify({'error': 'pickup_location is required'}), 400
        try:
            parsed = datetime.fromisoformat(pickup_at_raw.replace('Z', '+00:00'))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            when_utc = parsed.astimezone(timezone.utc)
        except Exception:
            return jsonify({'error': 'pickup_at must be ISO-8601'}), 400
        if when_utc <= datetime.now(timezone.utc) + timedelta(minutes=5):
            return jsonify({'error': 'pickup_at must be at least 5 minutes in the future'}), 400

        tx = Transaction.query.get(transaction_id)
        if not tx:
            return jsonify({'error': 'Transaction not found'}), 404
        if tx.seller_id != uid:
            return jsonify({'error': 'Only the seller can propose pickup details'}), 403
        if tx.status != 'pending' and tx.status != 'awaiting_buyer':
            return jsonify({'error': 'Proposal not allowed in current status'}), 400

        tx.pickup_at = when_utc.replace(tzinfo=None)
        tx.pickup_location = pickup_location
        tx.status = 'awaiting_buyer'
        tx.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Pickup details proposed', 'transaction': tx.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to propose pickup details', 'details': str(e)}), 500


@marketplace_bp.route('/transactions/<int:transaction_id>/confirm', methods=['POST'])
@jwt_required()
def buyer_confirm_transaction(transaction_id):
    """Buyer confirms the proposed pickup details; reserves item and accepts."""
    try:
        user_id = get_jwt_identity()
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        tx = Transaction.query.get(transaction_id)
        if not tx:
            return jsonify({'error': 'Transaction not found'}), 404
        if tx.buyer_id != uid:
            return jsonify({'error': 'Only the buyer can confirm'}), 403
        if tx.status != 'awaiting_buyer':
            return jsonify({'error': 'Transaction is not awaiting buyer confirmation'}), 400
        if not tx.pickup_at or not tx.pickup_location:
            return jsonify({'error': 'Pickup details are incomplete'}), 400

        # Reserve the item and accept
        item = Item.query.get(tx.item_id)
        if item and item.status == 'available':
            item.status = 'reserved'
            item.updated_at = datetime.utcnow()
        tx.status = 'accepted'
        tx.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Transaction accepted by buyer', 'transaction': tx.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to confirm transaction', 'details': str(e)}), 500


@marketplace_bp.route('/transactions/<int:transaction_id>/reject-buyer', methods=['POST'])
@jwt_required()
def buyer_reject_transaction(transaction_id):
    """Buyer rejects the proposed pickup; frees item for new requests and marks transaction rejected."""
    try:
        user_id = get_jwt_identity()
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        tx = Transaction.query.get(transaction_id)
        if not tx:
            return jsonify({'error': 'Transaction not found'}), 404
        if tx.buyer_id != uid:
            return jsonify({'error': 'Only the buyer can reject the proposal'}), 403
        if tx.status != 'awaiting_buyer':
            return jsonify({'error': 'Transaction is not awaiting buyer confirmation'}), 400

        # Free the item for new requests
        item = Item.query.get(tx.item_id)
        if item and item.is_active:
            item.status = 'available'
            item.updated_at = datetime.utcnow()
        tx.status = 'rejected'
        tx.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Proposal rejected. Item is available again.', 'transaction': tx.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to reject proposal', 'details': str(e)}), 500


@marketplace_bp.route('/transactions/<int:transaction_id>/accept', methods=['POST'])
@jwt_required()
def accept_transaction(transaction_id):
    """Legacy: Direct seller acceptance. Prefer /propose + buyer confirmation flow."""
    try:
        user_id = get_jwt_identity()
        # Normalize identity to integer when possible to match DB values
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        data = request.get_json(silent=True) or {}
        pickup_at_raw = (data.get('pickup_at') or '').strip()
        pickup_location = (data.get('pickup_location') or '').strip()
        if not pickup_at_raw:
            return jsonify({'error': 'pickup_at is required'}), 400
        if not pickup_location:
            return jsonify({'error': 'pickup_location is required'}), 400
        # Parse ISO datetime; accept both with 'Z' and with explicit offset
        try:
            parsed = datetime.fromisoformat(pickup_at_raw.replace('Z', '+00:00'))
            if parsed.tzinfo is None:
                # Assume UTC if no tz provided
                parsed = parsed.replace(tzinfo=timezone.utc)
            when_utc = parsed.astimezone(timezone.utc)
        except Exception:
            return jsonify({'error': 'pickup_at must be ISO-8601'}), 400
        # Require pickup to be at least 5 minutes in the future
        if when_utc <= datetime.now(timezone.utc) + timedelta(minutes=5):
            return jsonify({'error': 'pickup_at must be at least 5 minutes in the future'}), 400
        transaction = Transaction.query.get(transaction_id)
        
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404
        
        # Check if seller
        if transaction.seller_id != uid:
            return jsonify({'error': 'Only the seller can accept this transaction'}), 403
        
        if transaction.status not in ['pending', 'awaiting_buyer']:
            return jsonify({'error': 'Transaction cannot be accepted in its current state'}), 400
        
        # Store details and move to awaiting_buyer to require buyer confirmation
        transaction.pickup_at = when_utc.replace(tzinfo=None)
        transaction.pickup_location = pickup_location
        transaction.status = 'awaiting_buyer'
        transaction.updated_at = datetime.utcnow()

        # Do NOT reserve item yet; reservation happens upon buyer confirmation
        try:
            item = Item.query.get(transaction.item_id)
            if item and item.status == 'reserved' and transaction.status == 'pending':
                # normalize any inconsistent state
                item.status = 'available'
                item.updated_at = datetime.utcnow()
        except Exception:
            pass

        db.session.commit()
        
        return jsonify({'message': 'Pickup details saved. Awaiting buyer confirmation.', 'transaction': transaction.to_dict()}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to accept transaction', 'details': str(e)}), 500


@marketplace_bp.route('/transactions/<int:transaction_id>/reject', methods=['POST'])
@jwt_required()
def reject_transaction(transaction_id):
    """Reject a pending transaction request (seller only). Keeps item available for others."""
    try:
        user_id = get_jwt_identity()
        transaction = Transaction.query.get(transaction_id)

        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404

        # Only seller can reject
        if transaction.seller_id != user_id:
            return jsonify({'error': 'Only the seller can reject this transaction'}), 403

        if transaction.status != 'pending' and transaction.status != 'awaiting_buyer':
            return jsonify({'error': 'Only pending or awaiting_buyer transactions can be rejected'}), 400

        transaction.status = 'rejected'
        transaction.updated_at = datetime.utcnow()

        # Ensure item stays available for others
        try:
            item = Item.query.get(transaction.item_id)
            if item and item.is_active:
                # If anyone had set it otherwise, keep it available for new requests
                item.status = 'available'
                item.updated_at = datetime.utcnow()
        except Exception:
            pass

        db.session.commit()

        return jsonify({'message': 'Transaction rejected', 'transaction': transaction.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to reject transaction', 'details': str(e)}), 500


@marketplace_bp.route('/my-transactions', methods=['GET'])
@jwt_required()
def get_my_transactions():
    """Get current user's transactions (as buyer or seller)."""
    try:
        user_id = get_jwt_identity()
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id

        as_buyer = (
            Transaction.query
            .filter_by(buyer_id=uid)
            .order_by(Transaction.created_at.desc())
            .all()
        )
        as_seller = (
            Transaction.query
            .filter_by(seller_id=uid)
            .order_by(Transaction.created_at.desc())
            .all()
        )
        
        return jsonify({
            'as_buyer': [t.to_dict() for t in as_buyer],
            'as_seller': [t.to_dict() for t in as_seller]
        }), 200
    except (sqlite3.OperationalError, SAOperationalError, SAProgrammingError):
        return jsonify({'as_buyer': [], 'as_seller': []}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get transactions', 'details': str(e)}), 500

