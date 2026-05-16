from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.config import Settings
from backend.crud.inquiries import replace_inquiries
from backend.crud.site_content import replace_main_site_content
from backend.db import DatabaseManager, StorageError
from backend.models import InquiryRecord


def load_json(file_path: Path, fallback_value):
    try:
        raw = file_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return fallback_value

    return json.loads(raw)


def build_inquiry_records(items: list[dict]) -> list[InquiryRecord]:
    records: list[InquiryRecord] = []

    for item in items:
        if not isinstance(item, dict):
            continue

        created_at_raw = str(item.get("createdAt") or "").strip()
        if not created_at_raw:
            continue

        try:
            from datetime import datetime

            created_at = datetime.fromisoformat(created_at_raw.replace("Z", "+00:00"))
        except ValueError:
            continue

        records.append(
            InquiryRecord(
                id=str(item.get("id") or ""),
                created_at=created_at,
                request_type=str(item.get("requestType") or ""),
                name=str(item.get("name") or ""),
                phone=str(item.get("phone") or ""),
                email=str(item.get("email") or ""),
                guests=item.get("guests") if isinstance(item.get("guests"), int) else None,
                date=str(item.get("date") or ""),
                space=str(item.get("space") or ""),
                source_page=str(item.get("sourcePage") or ""),
                message=str(item.get("message") or ""),
            )
        )

    return records


def main() -> None:
    try:
        settings = Settings.from_root(ROOT_DIR)
        database = DatabaseManager(settings)
        database.bootstrap()

        content_payload = load_json(ROOT_DIR / "data" / "site-content.json", {})
        inquiries_payload = load_json(ROOT_DIR / "data" / "inquiries.json", [])

        replace_main_site_content(database, content_payload if isinstance(content_payload, dict) else {})
        imported_count = replace_inquiries(
            database,
            build_inquiry_records(inquiries_payload if isinstance(inquiries_payload, list) else []),
        )
    except StorageError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error

    print("Data folder migrated to PostgreSQL.")
    print(f"Imported inquiries: {imported_count}")


if __name__ == "__main__":
    main()
