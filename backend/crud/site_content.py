from __future__ import annotations

import json

from backend.db import DatabaseManager, SITE_CONTENT_KEY, StorageError
from backend.models import SiteContentRecord


def get_main_site_content(database: DatabaseManager) -> SiteContentRecord:
    with database.connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT content_key, payload::text, updated_at
                FROM app_site_content
                WHERE content_key = %s
                """,
                (SITE_CONTENT_KEY,),
            )
            row = cursor.fetchone()

    if row is None:
        raise StorageError("Kontent sayta ne nayden v PostgreSQL.")

    payload = json.loads(row[1])
    if not isinstance(payload, dict):
        raise StorageError("Kontent sayta v PostgreSQL povrezhden.")

    return SiteContentRecord(
        content_key=row[0],
        payload=payload,
        updated_at=row[2],
    )


def replace_main_site_content(database: DatabaseManager, payload: dict) -> SiteContentRecord:
    with database.connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO app_site_content (content_key, payload, updated_at)
                VALUES (%s, %s::jsonb, NOW())
                ON CONFLICT (content_key)
                DO UPDATE SET
                  payload = EXCLUDED.payload,
                  updated_at = NOW()
                RETURNING content_key, payload::text, updated_at
                """,
                (
                    SITE_CONTENT_KEY,
                    json.dumps(payload, ensure_ascii=False),
                ),
            )
            row = cursor.fetchone()

    return SiteContentRecord(
        content_key=row[0],
        payload=json.loads(row[1]),
        updated_at=row[2],
    )
