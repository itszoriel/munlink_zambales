"""
MunLink Zambales - Authentication Routes
User registration, login, email verification
"""
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import func
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt,
    decode_token
)
from datetime import datetime, timedelta
try:
    from apps.api import db
except ImportError:
    from __init__ import db
import bcrypt
try:
    from apps.api.models.user import User
except ImportError:
    from models.user import User
try:
    from apps.api.models.municipality import Municipality
except ImportError:
    from models.municipality import Municipality
try:
    from apps.api.models.transfer import TransferRequest
except ImportError:
    from models.transfer import TransferRequest
try:
    from apps.api.models.token_blacklist import TokenBlacklist
except ImportError:
    from models.token_blacklist import TokenBlacklist
try:
    from apps.api.utils import (
        validate_email,
        validate_username,
        validate_password,
        validate_phone,
        validate_name,
        validate_date_of_birth,
        ValidationError,
        generate_verification_token,
        save_profile_picture,
        save_verification_document,
    )
except ImportError:
    from utils import (
        validate_email,
        validate_username,
        validate_password,
        validate_phone,
        validate_name,
        validate_date_of_birth,
        ValidationError,
        generate_verification_token,
        save_profile_picture,
        save_verification_document,
    )

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new resident account (Gmail-only, email verification required)."""
    try:
        is_multipart = request.content_type and 'multipart/form-data' in request.content_type
        data = request.form.to_dict() if is_multipart else request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'date_of_birth']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate and sanitize inputs
        username = validate_username(data['username']).lower()
        email = validate_email(data['email']).lower()
        # Gmail-only enforcement
        if not (email.endswith('@gmail.com') or email.endswith('@googlemail.com')):
            return jsonify({'error': 'Registration requires a Gmail address'}), 400
        password = validate_password(data['password'])
        first_name = validate_name(data['first_name'], 'first_name')
        last_name = validate_name(data['last_name'], 'last_name')
        date_of_birth = validate_date_of_birth(data['date_of_birth'])
        
        # Optional fields
        middle_name = validate_name(data.get('middle_name'), 'middle_name') if data.get('middle_name') else None
        suffix = data.get('suffix')
        phone_number = validate_phone(data.get('phone_number'))
        municipality_slug = data.get('municipality_slug')
        
        # Get municipality ID from slug
        municipality_id = None
        if municipality_slug:
            municipality = Municipality.query.filter_by(slug=municipality_slug).first()
            if municipality:
                municipality_id = municipality.id
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 409
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create new user as resident
        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            suffix=suffix,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            municipality_id=municipality_id,
            role='resident'
        )
        
        db.session.add(user)
        db.session.flush()  # obtain user.id without committing

        # Optional uploads at registration: profile picture and verification docs if provided
        if request.files:
            municipality_slug_safe = municipality_slug or 'general'
            profile = request.files.get('profile_picture')
            if profile and getattr(profile, 'filename', ''):
                path = save_profile_picture(profile, user.id, municipality_slug_safe, user_type='residents')
                user.profile_picture = path

            id_front = request.files.get('valid_id_front')
            if id_front and getattr(id_front, 'filename', ''):
                user.valid_id_front = save_verification_document(id_front, user.id, municipality_slug_safe, 'valid_id_front', user_type='residents')

            id_back = request.files.get('valid_id_back')
            if id_back and getattr(id_back, 'filename', ''):
                user.valid_id_back = save_verification_document(id_back, user.id, municipality_slug_safe, 'valid_id_back', user_type='residents')

            selfie = request.files.get('selfie_with_id')
            if selfie and getattr(selfie, 'filename', ''):
                user.selfie_with_id = save_verification_document(selfie, user.id, municipality_slug_safe, 'selfie_with_id', user_type='residents')

        db.session.commit()

        # Generate email verification token
        verification_token = generate_verification_token(user.id, 'email')
        # Send verification email
        try:
            from apps.api.utils.email_sender import send_verification_email
            web_url = current_app.config.get('WEB_URL', 'http://localhost:3000')
            verify_link = f"{web_url}/verify-email?token={verification_token}"
            send_verification_email(user.email, verify_link)
        except Exception:
            # Non-fatal; registration still succeeds
            pass

        return jsonify({
            'message': 'Registration successful. Please check your Gmail to verify your account.',
            'user': user.to_dict(),
        }), 201
    
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login and get access tokens."""
    try:
        data = request.get_json()
        
        # Get credentials
        username_or_email = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not username_or_email or not password:
            return jsonify({'error': 'Username/email and password are required'}), 400
        
        # Find user by username or email (case-insensitive)
        ue = (username_or_email or '').lower()
        user = User.query.filter(
            (func.lower(User.username) == ue) |
            (func.lower(User.email) == ue)
        ).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is active
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create access and refresh tokens (subject must be a string) with role claim
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=1),
            additional_claims={"role": user.role}
        )
        refresh_token = create_refresh_token(
            identity=str(user.id),
            expires_delta=timedelta(days=30),
            additional_claims={"role": user.role}
        )
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(include_sensitive=True, include_municipality=True)
        }), 200
    
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout and blacklist the current token."""
    try:
        jti = get_jwt()['jti']
        user_id = get_jwt_identity()
        token_type = get_jwt().get('type', 'access')
        
        # Calculate expiration time
        expires_delta = timedelta(hours=1) if token_type == 'access' else timedelta(days=30)
        expires_at = datetime.utcnow() + expires_delta
        
        # Add token to blacklist
        TokenBlacklist.add_token_to_blacklist(jti, token_type, user_id, expires_at)
        
        return jsonify({'message': 'Logout successful'}), 200
    
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token."""
    try:
        user_id = get_jwt_identity()
        
        # Include current role in refreshed token
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        user = User.query.get(uid)
        role = getattr(user, 'role', None) or 'public'

        # Create new access token (subject must be a string)
        access_token = create_access_token(
            identity=str(user_id),
            expires_delta=timedelta(hours=1),
            additional_claims={"role": role}
        )
        
        return jsonify({'access_token': access_token}), 200
    
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500


@auth_bp.route('/admin/register', methods=['POST'])
def admin_register():
    """Create a municipal admin account (separate admin site).
    Requires ADMIN_SECRET_KEY to be provided in the request body as 'admin_secret'.
    Accepts admin_municipality_id or admin_municipality_slug to scope the admin.
    """
    try:
        is_multipart = request.content_type and 'multipart/form-data' in request.content_type
        data = request.form.to_dict() if is_multipart else request.get_json()

        admin_secret = data.get('admin_secret')
        if not admin_secret:
            return jsonify({'error': 'admin_secret is required'}), 400
        if admin_secret != current_app.config.get('ADMIN_SECRET_KEY'):
            return jsonify({'error': 'Invalid admin secret'}), 401

        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Validate and sanitize inputs
        username = validate_username(data['username']).lower()
        email = validate_email(data['email']).lower()
        password = validate_password(data['password'])
        first_name = validate_name(data['first_name'], 'first_name')
        middle_name = validate_name(data.get('middle_name'), 'middle_name') if data.get('middle_name') else None
        last_name = validate_name(data['last_name'], 'last_name')

        admin_municipality_id = data.get('admin_municipality_id')
        admin_municipality_slug = data.get('admin_municipality_slug')

        if admin_municipality_slug and not admin_municipality_id:
            mun = Municipality.query.filter_by(slug=admin_municipality_slug).first()
            if not mun:
                return jsonify({'error': 'Invalid municipality slug'}), 400
            admin_municipality_id = mun.id

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 409
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create admin user
        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            role='municipal_admin',
            email_verified=True,
            admin_verified=True,
            admin_municipality_id=admin_municipality_id,
        )

        db.session.add(user)
        db.session.flush()

        # Require ID uploads via multipart for admin
        if not is_multipart:
            db.session.rollback()
            return jsonify({'error': 'Admin registration requires Valid ID Front and Back uploaded as files (multipart/form-data)'}), 400

        if request.files:
            municipality_slug = data.get('admin_municipality_slug') or 'general'

            # Validate required IDs
            id_front = request.files.get('valid_id_front')
            id_back = request.files.get('valid_id_back')
            if not (id_front and getattr(id_front, 'filename', '')) or not (id_back and getattr(id_back, 'filename', '')):
                db.session.rollback()
                return jsonify({'error': 'Valid ID Front and Back are required for admin registration'}), 400

            # Optional profile
            profile = request.files.get('profile_picture')
            if profile and getattr(profile, 'filename', ''):
                user.profile_picture = save_profile_picture(profile, user.id, municipality_slug, user_type='admins')

            user.valid_id_front = save_verification_document(id_front, user.id, municipality_slug, 'valid_id_front', user_type='admins')
            user.valid_id_back = save_verification_document(id_back, user.id, municipality_slug, 'valid_id_back', user_type='admins')

        db.session.commit()

        return jsonify({
            'message': 'Admin account created successfully',
            'user': user.to_dict(include_sensitive=True, include_municipality=True)
        }), 201

    except ValidationError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        # Log the full error for debugging
        import traceback
        current_app.logger.error(f"Admin registration error: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({'error': 'Admin registration failed', 'details': str(e)}), 500


@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify user email with token."""
    try:
        # Decode the token
        decoded = decode_token(token)
        # flask_jwt_extended changed sub to string; identity is in sub
        user_id = decoded.get('sub') or decoded.get('user_id')
        token_type = decoded.get('type')
        
        if token_type != 'email':
            return jsonify({'error': 'Invalid verification token'}), 400
        
        # Find user
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id
        user = User.query.get(uid)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.email_verified:
            return jsonify({'message': 'Email already verified'}), 200
        
        # Verify email
        user.email_verified = True
        user.email_verified_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': 'Email verification failed', 'details': str(e)}), 400


@auth_bp.route('/resend-verification', methods=['POST'])
@jwt_required()
def resend_verification_email():
    """Resend the email verification link to the authenticated user."""
    try:
        user_id = get_jwt_identity()
        # user_id may be a string
        try:
            uid = int(user_id) if isinstance(user_id, str) else user_id
        except Exception:
            uid = user_id

        user = User.query.get(uid)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user.email_verified:
            return jsonify({'message': 'Email already verified'}), 200

        verification_token = generate_verification_token(user.id, 'email')
        try:
            from apps.api.utils.email_sender import send_verification_email
            web_url = current_app.config.get('WEB_URL', 'http://localhost:3000')
            verify_link = f"{web_url}/verify-email?token={verification_token}"
            send_verification_email(user.email, verify_link)
        except Exception:
            # Don't fail hard if email service has issues
            pass

        return jsonify({'message': 'Verification email sent'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to resend verification email', 'details': str(e)}), 400


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_sensitive=True, include_municipality=True)), 200
    
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = validate_name(data['first_name'], 'first_name')
        
        if 'middle_name' in data:
            user.middle_name = validate_name(data['middle_name'], 'middle_name') if data['middle_name'] else None
        
        if 'last_name' in data:
            user.last_name = validate_name(data['last_name'], 'last_name')
        
        if 'suffix' in data:
            user.suffix = data['suffix']
        
        if 'phone_number' in data:
            user.phone_number = validate_phone(data['phone_number'])
        
        if 'street_address' in data:
            user.street_address = data['street_address']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(include_sensitive=True, include_municipality=True)
        }), 200
    
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile', 'details': str(e)}), 500


@auth_bp.route('/verification-docs', methods=['POST'])
@jwt_required()
def upload_verification_docs():
    """Upload resident verification documents after email verification.

    Accepts multipart/form-data with any of: valid_id_front, valid_id_back, selfie_with_id.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user.role == 'public':
            return jsonify({'error': 'Resident account required'}), 403

        if not user.email_verified:
            return jsonify({'error': 'Please verify your email first'}), 403

        if not (request.content_type and 'multipart/form-data' in request.content_type):
            return jsonify({'error': 'Files must be uploaded as multipart/form-data'}), 400

        municipality_slug = request.form.get('municipality_slug') or 'general'

        # Check if user already has ID documents uploaded
        existing_ids = bool(user.valid_id_front or user.valid_id_back)
        
        # Save provided files (optional)
        saved_any = False

        id_front = request.files.get('valid_id_front')
        if id_front and getattr(id_front, 'filename', ''):
            user.valid_id_front = save_verification_document(id_front, user.id, municipality_slug, 'valid_id_front', user_type='residents')
            saved_any = True

        id_back = request.files.get('valid_id_back')
        if id_back and getattr(id_back, 'filename', ''):
            user.valid_id_back = save_verification_document(id_back, user.id, municipality_slug, 'valid_id_back', user_type='residents')
            saved_any = True

        selfie = request.files.get('selfie_with_id')
        if selfie and getattr(selfie, 'filename', ''):
            user.selfie_with_id = save_verification_document(selfie, user.id, municipality_slug, 'selfie_with_id', user_type='residents')
            saved_any = True

        if not saved_any:
            return jsonify({'error': 'Please upload at least one verification file'}), 400

        user.updated_at = datetime.utcnow()
        db.session.commit()

        if existing_ids:
            message = 'Verification documents updated. Your account is pending admin review.'
        else:
            message = 'Verification documents uploaded. Your account is pending admin review.'

        return jsonify({
            'message': message,
            'user': user.to_dict(include_sensitive=True)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload verification documents', 'details': str(e)}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not bcrypt.checkpw(current_password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        new_password = validate_password(new_password)
        
        # Hash and update password
        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
    
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to change password', 'details': str(e)}), 500


@auth_bp.route('/transfer', methods=['POST'])
@jwt_required()
def request_transfer():
    """Resident-initiated transfer to another municipality."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'resident':
            return jsonify({'error': 'Resident access required'}), 403
        data = request.get_json() or {}
        to_municipality_id = int(data.get('to_municipality_id') or 0)
        if not to_municipality_id:
            return jsonify({'error': 'to_municipality_id is required'}), 400
        if not user.municipality_id:
            return jsonify({'error': 'Your current municipality is not set'}), 400
        if int(user.municipality_id) == to_municipality_id:
            return jsonify({'error': 'You are already in this municipality'}), 400
        if not Municipality.query.get(to_municipality_id):
            return jsonify({'error': 'Target municipality not found'}), 404
        t = TransferRequest(
            user_id=user.id,
            from_municipality_id=user.municipality_id,
            to_municipality_id=to_municipality_id,
            status='pending',
            notes=data.get('notes'),
        )
        db.session.add(t)
        db.session.commit()
        return jsonify({'message': 'Transfer request submitted', 'transfer': t.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to submit transfer', 'details': str(e)}), 500
