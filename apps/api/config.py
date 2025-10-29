"""
MunLink Zambales - Configuration
Application configuration management
"""
import os
from datetime import timedelta
from pathlib import Path

# Get project root (2 levels up from this file)
BASE_DIR = Path(__file__).parent.parent.parent.resolve()


class Config:
    """Base configuration"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database
    DATABASE_URL = os.getenv(
        'DATABASE_URL',
        f'sqlite:///{BASE_DIR}/munlink_zambales.db'
    )
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = DEBUG
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))
    )
    JWT_ALGORITHM = 'HS256'
    # Enable JWT in headers and cookies; use cookies for refresh token
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    # Cookie settings for refresh token (and optionally access later)
    JWT_COOKIE_SECURE = (os.getenv('JWT_COOKIE_SECURE', 'False' if DEBUG else 'True') == 'True')
    JWT_COOKIE_SAMESITE = os.getenv('JWT_COOKIE_SAMESITE', 'Lax')
    JWT_COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN')  # e.g., .munlink.example.com
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/'
    # CSRF can be enabled later if we migrate access to cookies
    JWT_COOKIE_CSRF_PROTECT = (os.getenv('JWT_COOKIE_CSRF_PROTECT', 'False') == 'True')
    
    # Admin Security
    ADMIN_SECRET_KEY = os.getenv('ADMIN_SECRET_KEY', 'admin-secret-key')
    
    # File Uploads
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_FILE_SIZE', 10 * 1024 * 1024))  # 10MB
    UPLOAD_FOLDER = BASE_DIR / os.getenv('UPLOAD_FOLDER', 'uploads/zambales')
    ALLOWED_EXTENSIONS = set(
        os.getenv('ALLOWED_EXTENSIONS', 'pdf,jpg,jpeg,png,doc,docx').split(',')
    )
    
    # Email (SMTP)
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME', '')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@munlink-zambales.gov.ph')
    
    # QR Codes
    QR_BASE_URL = os.getenv('QR_BASE_URL', 'http://localhost:3000/verify')
    QR_EXPIRY_DAYS = int(os.getenv('QR_EXPIRY_DAYS', 30))
    
    # Application
    APP_NAME = os.getenv('APP_NAME', 'MunLink Zambales')
    
    # Frontend URLs (for CORS)
    WEB_URL = os.getenv('WEB_URL', 'http://localhost:3000')
    ADMIN_URL = os.getenv('ADMIN_URL', 'http://localhost:3001')
    
    # Location Data
    LOCATION_DATA_FILE = BASE_DIR / 'data' / 'locations' / 'philippines_full_locations.json'
    
    # Asset Paths
    MUNICIPAL_LOGOS_DIR = BASE_DIR / 'public' / 'logos' / 'municipalities'
    PROVINCE_LOGO_DIR = BASE_DIR / 'public' / 'logos' / 'zambales'
    LANDMARKS_DIR = BASE_DIR / 'public' / 'landmarks'
    
    @staticmethod
    def init_app(app):
        """Initialize application configuration"""
        # Create upload directories if they don't exist
        upload_dir = Path(Config.UPLOAD_FOLDER)
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Create municipality upload directories
        municipalities = [
            'botolan', 'cabangan', 'candelaria', 'castillejos', 'iba',
            'masinloc', 'palauig', 'san_antonio', 'san_felipe',
            'san_marcelino', 'san_narciso', 'santa_cruz', 'subic'
        ]
        
        for mun in municipalities:
            mun_dir = upload_dir / 'municipalities' / mun
            (mun_dir / 'residents').mkdir(parents=True, exist_ok=True)
            (mun_dir / 'issues').mkdir(parents=True, exist_ok=True)
            (mun_dir / 'documents' / 'generated').mkdir(parents=True, exist_ok=True)
        
        # Create marketplace upload directory
        (upload_dir / 'marketplace' / 'items').mkdir(parents=True, exist_ok=True)


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


# Config dictionary
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

