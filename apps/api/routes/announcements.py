"""Public announcements routes."""
from flask import Blueprint, jsonify, request
from sqlalchemy import and_
from sqlalchemy.exc import OperationalError as SAOperationalError, ProgrammingError as SAProgrammingError
import sqlite3

try:
    from apps.api import db
    from apps.api.models.announcement import Announcement
except ImportError:
    from __init__ import db
    from models.announcement import Announcement


announcements_bp = Blueprint('announcements', __name__, url_prefix='/api/announcements')


@announcements_bp.route('', methods=['GET'])
def list_announcements():
    """List active announcements with optional filters and pagination.

    Query params:
      - municipality_id: int (optional)
      - active: bool (default true)
      - page: int (default 1)
      - per_page: int (default 20)
    """
    try:
        municipality_id = request.args.get('municipality_id', type=int)
        active_param = request.args.get('active', 'true').lower()
        is_active = True if active_param in ['true', '1', 'yes'] else False if active_param in ['false', '0', 'no'] else True
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        # Build filters
        filters = []
        if municipality_id:
            filters.append(Announcement.municipality_id == municipality_id)
        if is_active is not None:
            filters.append(Announcement.is_active == is_active)

        query = Announcement.query
        if filters:
            query = query.filter(and_(*filters))

        query = query.order_by(Announcement.created_at.desc())
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            'announcements': [a.to_dict() for a in paginated.items],
            'count': len(paginated.items),
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
            }
        }), 200

    except (sqlite3.OperationalError, SAOperationalError, SAProgrammingError):
        # Likely missing table in SQLite; return safe empty shape instead of 500
        # Re-parse paging so we can respond consistently
        page = max(1, request.args.get('page', 1, type=int) or 1)
        per_page = max(1, request.args.get('per_page', 20, type=int) or 20)
        return jsonify({
            'announcements': [],
            'count': 0,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': 0,
                'pages': 0,
            }
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get announcements', 'details': str(e)}), 500


@announcements_bp.route('/<int:announcement_id>', methods=['GET'])
def get_announcement(announcement_id: int):
    """Get a single announcement by id."""
    try:
        ann = Announcement.query.get(announcement_id)
        if not ann or (ann.is_active is False):
            return jsonify({'error': 'Announcement not found'}), 404

        return jsonify(ann.to_dict()), 200

    except (sqlite3.OperationalError, SAOperationalError, SAProgrammingError):
        return jsonify({'error': 'Announcement not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to get announcement', 'details': str(e)}), 500


