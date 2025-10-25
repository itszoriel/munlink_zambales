"""API Routes - Import all blueprints here."""

try:
    from apps.api.routes.auth import auth_bp
    from apps.api.routes.municipalities import municipalities_bp
    from apps.api.routes.marketplace import marketplace_bp
    from apps.api.routes.announcements import announcements_bp
    from apps.api.routes.documents import documents_bp
    from apps.api.routes.issues import issues_bp
    from apps.api.routes.benefits import benefits_bp
except ImportError:
    from .auth import auth_bp
    from .municipalities import municipalities_bp
    from .marketplace import marketplace_bp
    from .announcements import announcements_bp
    from .documents import documents_bp
    from .issues import issues_bp
    from .benefits import benefits_bp

__all__ = [
    'auth_bp',
    'municipalities_bp',
    'marketplace_bp',
    'announcements_bp',
    'documents_bp',
    'issues_bp',
    'benefits_bp',
]
