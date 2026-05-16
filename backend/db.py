from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Iterator

import psycopg2
from psycopg2 import sql
from psycopg2.extensions import connection as PgConnection
from psycopg2.extensions import parse_dsn
from psycopg2.errorcodes import INVALID_CATALOG_NAME

from backend.config import Settings


SITE_CONTENT_KEY = "main"


class StorageError(RuntimeError):
    """Raised when PostgreSQL storage is unavailable or invalid."""


class DatabaseManager:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.connection_params = self._build_connection_params(settings.database_url)

    def bootstrap(self) -> None:
        self.ensure_database_exists()

        with self.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS app_site_content (
                      content_key TEXT PRIMARY KEY,
                      payload JSONB NOT NULL,
                      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                    )
                    """
                )
                cursor.execute(
                    """
                    CREATE TABLE IF NOT EXISTS app_inquiries (
                      id TEXT PRIMARY KEY,
                      created_at TIMESTAMPTZ NOT NULL,
                      request_type TEXT NOT NULL,
                      name TEXT NOT NULL,
                      phone TEXT NOT NULL,
                      email TEXT NOT NULL DEFAULT '',
                      guests INTEGER NULL,
                      desired_date TEXT NOT NULL DEFAULT '',
                      space TEXT NOT NULL DEFAULT '',
                      source_page TEXT NOT NULL DEFAULT '',
                      message TEXT NOT NULL DEFAULT ''
                    )
                    """
                )
                cursor.execute(
                    """
                    CREATE INDEX IF NOT EXISTS app_inquiries_created_at_idx
                    ON app_inquiries (created_at DESC)
                    """
                )

                cursor.execute(
                    "SELECT 1 FROM app_site_content WHERE content_key = %s",
                    (SITE_CONTENT_KEY,),
                )
                if cursor.fetchone() is None:
                    cursor.execute(
                        """
                        INSERT INTO app_site_content (content_key, payload)
                        VALUES (%s, %s::jsonb)
                        """,
                        (
                            SITE_CONTENT_KEY,
                            "{}",
                        ),
                    )

    def ensure_database_exists(self) -> None:
        target_database = self.connection_params.get("dbname", "").strip()

        if not target_database:
            raise StorageError("DATABASE_URL ne soderzhit nazvanie bazy.")

        if target_database in {"postgres", "template1"}:
            return

        target_check_error = self._get_target_database_error()
        if target_check_error is None:
            return

        if not self._is_missing_database_error(target_check_error):
            details = str(target_check_error).strip() or (
                "proverte DATABASE_URL/PG* peremennye i dostupnost' PostgreSQL servera"
            )
            raise StorageError(f"Ne udalos' podklyuchit'sya k PostgreSQL: {details}")

        admin_connection = self._connect_to_bootstrap_database()
        admin_connection.autocommit = True

        try:
            with admin_connection.cursor() as cursor:
                cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_database,))
                if cursor.fetchone() is not None:
                    return

                cursor.execute(
                    sql.SQL("CREATE DATABASE {}").format(sql.Identifier(target_database))
                )
        finally:
            admin_connection.close()

    @contextmanager
    def connection(self) -> Iterator[PgConnection]:
        try:
            connection = psycopg2.connect(connect_timeout=5, **self.connection_params)
        except psycopg2.Error as error:
            details = str(error).strip() or (
                "proverte DATABASE_URL/PG* peremennye i dostupnost' PostgreSQL servera"
            )
            raise StorageError(f"Ne udalos' podklyuchit'sya k PostgreSQL: {details}") from error

        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def _connect_to_bootstrap_database(self) -> PgConnection:
        bootstrap_candidates = []
        preferred_bootstrap_db = "postgres"

        if self.connection_params.get("dbname") != preferred_bootstrap_db:
            bootstrap_candidates.append(preferred_bootstrap_db)

        bootstrap_candidates.append("template1")

        last_error: Exception | None = None
        for bootstrap_db in bootstrap_candidates:
            params = dict(self.connection_params)
            params["dbname"] = bootstrap_db

            try:
                return psycopg2.connect(connect_timeout=5, **params)
            except psycopg2.Error as error:
                last_error = error

        details = str(last_error).strip() if last_error else ""
        details = details or "ne udalos' podklyuchit'sya k bootstrap-baze postgres/template1"
        raise StorageError(f"Ne udalos' sozdat' bazu dannyh: {details}")

    def _get_target_database_error(self) -> psycopg2.Error | None:
        try:
            connection = psycopg2.connect(connect_timeout=5, **self.connection_params)
        except psycopg2.Error as error:
            return error

        connection.close()
        return None

    def _is_missing_database_error(self, error: psycopg2.Error) -> bool:
        if getattr(error, "pgcode", None) == INVALID_CATALOG_NAME:
            return True

        message = str(error).lower()
        return "does not exist" in message and "database" in message

    def _build_connection_params(self, database_url: str) -> dict[str, Any]:
        try:
            params = parse_dsn(database_url)
        except psycopg2.Error as error:
            raise StorageError(f"Nekorrektnyy DATABASE_URL: {error}") from error

        normalized = dict(params)
        normalized.setdefault("host", "127.0.0.1")
        normalized.setdefault("port", "5432")
        normalized.setdefault("dbname", "vanatur")
        normalized.setdefault("user", "postgres")
        normalized.setdefault("password", "postgres")
        return normalized
