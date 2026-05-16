from __future__ import annotations

import secrets
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from backend.models import InquiryRecord


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def safe_text(value, max_length: int = 4000) -> str:
    return str(value or "").strip()[:max_length]


def normalize_guests(value) -> int | float | None:
    if value in (None, ""):
        return None

    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return float("nan")

    return int(parsed) if parsed.is_integer() else parsed


@dataclass(frozen=True)
class InquiryCreateSchema:
    request_type: str
    name: str
    phone: str
    email: str
    guests: int | float | None
    date: str
    space: str
    source_page: str
    message: str

    @classmethod
    def from_payload(cls, payload: dict[str, Any]) -> "InquiryCreateSchema":
        return cls(
            request_type=safe_text(payload.get("requestType") or "Общий запрос", 120),
            name=safe_text(payload.get("name"), 120),
            phone=safe_text(payload.get("phone"), 120),
            email=safe_text(payload.get("email"), 160),
            guests=normalize_guests(payload.get("guests")),
            date=safe_text(payload.get("date"), 40),
            space=safe_text(payload.get("space"), 120),
            source_page=safe_text(payload.get("sourcePage"), 80),
            message=safe_text(payload.get("message"), 4000),
        )

    def validate(self) -> list[str]:
        errors: list[str] = []

        if not self.name:
            errors.append("Укажите имя.")

        if not self.phone:
            errors.append("Укажите телефон.")

        if not self.request_type:
            errors.append("Укажите тип запроса.")

        if self.guests is not None:
            if self.guests != self.guests or self.guests < 1:
                errors.append("Количество гостей должно быть больше нуля.")
            elif not isinstance(self.guests, int):
                errors.append("Количество гостей должно быть целым числом.")

        return errors

    def to_model(self) -> InquiryRecord:
        return InquiryRecord(
            id=f"req_{int(time.time() * 1000)}_{secrets.token_hex(3)}",
            created_at=datetime.now(timezone.utc),
            request_type=self.request_type,
            name=self.name,
            phone=self.phone,
            email=self.email,
            guests=self.guests if isinstance(self.guests, int) else None,
            date=self.date,
            space=self.space,
            source_page=self.source_page,
            message=self.message,
        )


def validate_site_content_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Kontent sayta dolzhen byt' JSON-ob'ektom.")

    return payload


def normalize_limit(value: str, default: int = 200, maximum: int = 500) -> int:
    try:
        parsed = int(value)
    except ValueError as error:
        raise ValueError("Parametr limit dolzhen byt' chislom.") from error

    return min(max(parsed, 1), maximum) if parsed else default
