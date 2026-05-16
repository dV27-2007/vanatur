from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from backend.models.shared import serialize_datetime


@dataclass(frozen=True)
class InquiryRecord:
    id: str
    created_at: datetime
    request_type: str
    name: str
    phone: str
    email: str = ""
    guests: int | None = None
    date: str = ""
    space: str = ""
    source_page: str = ""
    message: str = ""

    def to_dict(self) -> dict[str, object | None]:
        return {
            "id": self.id,
            "createdAt": serialize_datetime(self.created_at),
            "requestType": self.request_type,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "guests": self.guests,
            "date": self.date,
            "space": self.space,
            "sourcePage": self.source_page,
            "message": self.message,
        }
