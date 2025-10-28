"""
Idempotent migration to add `pickup_at` column to `transactions` table.

Usage (from repo root):
  - Activate venv
  - Run: python apps/api/scripts/migrate_add_pickup_at.py
"""

import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'munlink_zambales.db')


def column_exists(cursor: sqlite3.Cursor, table: str, column: str) -> bool:
    cursor.execute(f"PRAGMA table_info({table})")
    return any(row[1] == column for row in cursor.fetchall())


def main():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return
    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.cursor()
        # Add pickup_at if missing
        if not column_exists(cur, 'transactions', 'pickup_at'):
            try:
                cur.execute('ALTER TABLE transactions ADD COLUMN pickup_at DATETIME')
                conn.commit()
                print('Added column `pickup_at` to `transactions`.')
            except Exception as e:
                print(f'Failed to add pickup_at: {e}')
                conn.rollback()
        else:
            print('Column `pickup_at` already exists.')

        # Add pickup_location if missing
        if not column_exists(cur, 'transactions', 'pickup_location'):
            try:
                cur.execute('ALTER TABLE transactions ADD COLUMN pickup_location VARCHAR(200)')
                conn.commit()
                print('Added column `pickup_location` to `transactions`.')
            except Exception as e:
                print(f'Failed to add pickup_location: {e}')
                conn.rollback()
        else:
            print('Column `pickup_location` already exists.')
    finally:
        conn.close()


if __name__ == '__main__':
    main()


