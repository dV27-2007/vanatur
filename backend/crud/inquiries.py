from __future__ import annotations

from psycopg2 import extras

from backend.db import DatabaseManager
from backend.models import InquiryRecord


def create_inquiry(database: DatabaseManager, inquiry: InquiryRecord) -> InquiryRecord:
    with database.connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO app_inquiries (
                  id,
                  created_at,
                  request_type,
                  name,
                  phone,
                  email,
                  guests,
                  desired_date,
                  space,
                  source_page,
                  message
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    inquiry.id,
                    inquiry.created_at,
                    inquiry.request_type,
                    inquiry.name,
                    inquiry.phone,
                    inquiry.email,
                    inquiry.guests,
                    inquiry.date,
                    inquiry.space,
                    inquiry.source_page,
                    inquiry.message,
                ),
            )

    return inquiry


def list_inquiries(database: DatabaseManager, limit: int = 200) -> list[InquiryRecord]:
    normalized_limit = min(max(int(limit), 1), 500)

    with database.connection() as connection:
        with connection.cursor(cursor_factory=extras.RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                  id,
                  created_at,
                  request_type,
                  name,
                  phone,
                  email,
                  guests,
                  desired_date,
                  space,
                  source_page,
                  message
                FROM app_inquiries
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (normalized_limit,),
            )
            rows = cursor.fetchall()

    return [
        InquiryRecord(
            id=row["id"],
            created_at=row["created_at"],
            request_type=row["request_type"],
            name=row["name"],
            phone=row["phone"],
            email=row["email"],
            guests=row["guests"],
            date=row["desired_date"],
            space=row["space"],
            source_page=row["source_page"],
            message=row["message"],
        )
        for row in rows
    ]
