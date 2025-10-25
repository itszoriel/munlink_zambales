"""Quick test to verify imports work."""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

print("Testing imports...")
print("-" * 50)

try:
    from apps.api.app import create_app, db, jwt
    print("[OK] App and extensions imported successfully")
except Exception as e:
    print(f"[FAIL] App import failed: {e}")
    sys.exit(1)

try:
    from apps.api.models import User, Municipality, Barangay
    print("[OK] Models imported successfully")
except Exception as e:
    print(f"[FAIL] Model import failed: {e}")
    sys.exit(1)

try:
    from apps.api.routes import auth_bp, municipalities_bp, marketplace_bp
    print("[OK] Routes imported successfully")
except Exception as e:
    print(f"[FAIL] Route import failed: {e}")
    sys.exit(1)

try:
    from apps.api.utils import validate_email, validate_username
    print("[OK] Utilities imported successfully")
except Exception as e:
    print(f"[FAIL] Utility import failed: {e}")
    sys.exit(1)

try:
    app = create_app()
    print("[OK] Flask app created successfully")
    print(f"  - App name: {app.name}")
    print(f"  - Debug mode: {app.config.get('DEBUG', False)}")
    print(f"  - Registered blueprints: {len(app.blueprints)}")
except Exception as e:
    print(f"[FAIL] App creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("-" * 50)
print("[SUCCESS] ALL TESTS PASSED!")
print("\nBackend API is ready to use!")

