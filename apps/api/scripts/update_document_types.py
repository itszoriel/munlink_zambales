#!/usr/bin/env python3
"""
Update only the Document Types to the allowed catalog without touching users or other data.

Usage:
  python apps/api/scripts/update_document_types.py --confirm
"""
import os
import sys
from datetime import datetime

# Ensure project root is importable
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../../..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import argparse

from apps.api.app import create_app
from apps.api import db
from apps.api.models.document import DocumentType

# Reuse the allowed catalog from seed_data
from apps.api.scripts.seed_data import DOCUMENT_TYPES


def upsert_document_types():
    """Deactivate all existing types and upsert the allowed catalog."""
    # Soft-deactivate all current types
    for t in DocumentType.query.all():
        t.is_active = False
    db.session.commit()

    # Upsert allowed catalog by code
    created, updated = 0, 0
    for spec in DOCUMENT_TYPES:
        code = spec['code']
        rec = DocumentType.query.filter_by(code=code).first()
        if rec is None:
            rec = DocumentType(
                name=spec['name'],
                code=code,
            )
            db.session.add(rec)
            created += 1
        else:
            updated += 1

        # Update common fields
        rec.description = spec.get('description')
        rec.authority_level = spec.get('authority_level', 'municipal')
        rec.requirements = spec.get('requirements')
        rec.fee = spec.get('fee', 0.0)
        rec.processing_days = spec.get('processing_days', 3)
        rec.supports_physical = spec.get('supports_physical', True)
        rec.supports_digital = spec.get('supports_digital', False)
        rec.is_active = True

    db.session.commit()
    return created, updated


def main():
    parser = argparse.ArgumentParser(description='Replace Document Types with allowed catalog only')
    parser.add_argument('--confirm', action='store_true', help='Confirm the replacement of document types')
    args = parser.parse_args()

    if not args.confirm:
        print('ERROR: --confirm flag is required to proceed.')
        sys.exit(1)

    app = create_app()
    with app.app_context():
        created, updated = upsert_document_types()
        print(f"DONE. Created: {created}, Updated: {updated}, Total active: {DocumentType.query.filter_by(is_active=True).count()}")


if __name__ == '__main__':
    main()


