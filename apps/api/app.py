"""
MunLink Zambales - Flask API Application
Main application entry point
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file at project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
load_dotenv(os.path.join(project_root, '.env'))

# Add parent directory to path for absolute imports
sys.path.insert(0, project_root)

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# Import config - try absolute first, then relative
try:
    from apps.api.config import Config
    from apps.api import db, migrate, jwt
except ImportError:
    from config import Config
    from __init__ import db, migrate, jwt

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    # Ensure directories and other config-dependent setup are initialized
    try:
        config_class.init_app(app)
    except Exception:
        # Safe to ignore if init_app does not require running or fails in tests
        pass
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                app.config['WEB_URL'],
                app.config['ADMIN_URL'],
                "http://localhost:3000",
                "http://localhost:3001"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # JWT token blacklist check
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        try:
            from apps.api.models.token_blacklist import TokenBlacklist
        except ImportError:
            from models.token_blacklist import TokenBlacklist
        jti = jwt_payload['jti']
        return TokenBlacklist.is_token_revoked(jti)
    
    # Register blueprints
    try:
        from apps.api.routes import auth_bp, municipalities_bp, marketplace_bp, announcements_bp, documents_bp, issues_bp, benefits_bp
        from apps.api.routes.admin import admin_bp
    except ImportError:
        from routes import auth_bp, municipalities_bp, marketplace_bp, announcements_bp, documents_bp, issues_bp, benefits_bp
        from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(municipalities_bp)
    app.register_blueprint(marketplace_bp)
    app.register_blueprint(announcements_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(issues_bp)
    app.register_blueprint(benefits_bp)
    app.register_blueprint(admin_bp)
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint for monitoring"""
        return jsonify({
            'status': 'healthy',
            'service': 'MunLink Zambales API',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        """API root endpoint"""
        return jsonify({
            'message': 'MunLink Zambales API',
            'version': '1.0.0',
            'province': 'Zambales',
            'municipalities': 13,
            'docs': '/api/docs'
        }), 200
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        """Serve uploaded files from the uploads directory"""
        try:
            # Get the upload directory from config
            upload_dir = app.config.get('UPLOAD_FOLDER', 'uploads')
            # Ensure string path for Flask static serving
            directory = str(upload_dir)
            return send_from_directory(directory, filename)
        except FileNotFoundError:
            return jsonify({'error': 'File not found'}), 404
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )

