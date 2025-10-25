#!/usr/bin/env python3
"""
Initialize database tables for MunLink Zambales
This script creates all necessary tables if they don't exist
"""

import sys
import os

# Resolve project root (three levels up) so we can import apps.api.* consistently
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '../../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from apps.api.app import create_app
from apps.api import db

def init_database():
    """Initialize database tables"""
    print("Initializing MunLink Zambales database...")
    
    try:
        # Create Flask app
        app = create_app()
        
        with app.app_context():
            # Create all tables
            db.create_all()
            print("Database tables created successfully!")
            
            # Check if tables exist
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            print(f"Created {len(tables)} tables:")
            for table in sorted(tables):
                print(f"  - {table}")
            
            print("\nDatabase initialization complete!")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
