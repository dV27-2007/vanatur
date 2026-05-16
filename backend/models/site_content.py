from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from backend.models.shared import serialize_datetime


@dataclass(frozen=True)
class SiteContentRecord:
    content_key: str
    payload: dict[str, Any]
    updated_at: datetime | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "contentKey": self.content_key,
            "payload": self.payload,
            "updatedAt": serialize_datetime(self.updated_at),
        }
