from __future__ import annotations

from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.config import Settings
from backend.db import DatabaseManager, StorageError


def main() -> None:
    try:
        settings = Settings.from_root(ROOT_DIR)
        database = DatabaseManager(settings)
        database.bootstrap()
    except StorageError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error

    print("PostgreSQL bootstrap completed.")


if __name__ == "__main__":
    main()
