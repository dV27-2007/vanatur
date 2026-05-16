from __future__ import annotations

from datetime import datetime, timezone


def serialize_datetime(value: datetime | None) -> str | None:
    if value is None:
        return None

    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
