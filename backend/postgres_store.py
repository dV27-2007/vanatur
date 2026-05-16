"""Compatibility wrapper for older imports.

The project now uses:
- backend.config.Settings
- backend.db.DatabaseManager
- backend.db.StorageError
"""

from backend.config import Settings
from backend.db import DatabaseManager, StorageError

PostgresConfig = Settings
PostgresStore = DatabaseManager

__all__ = ["DatabaseManager", "PostgresConfig", "PostgresStore", "Settings", "StorageError"]
