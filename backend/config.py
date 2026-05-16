from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from backend.utils.env import load_env_file


DEFAULT_BOOKING_URL = (
    "https://www.booking.com/hotel/am/vanatur.ru.html?aid=2440491&label=cht532js-10CAsoB0IHdmFuYXR1ckgzWANoB4gBAZgBM7gBGcgBDNgBA-gBAfgBAYgCAagCAbgCzJH9zwbAAgHSAiRjMjkzZDdiOC0wYTAzLTQxMGQtYmJiMi1mN2RlY2Q4YTAyNGLYAgHgAgE&sid=4409f464b8317ec9fac7b0c2292b68b8&dest_id=-2324859&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1778338119&srpvid=58bf67e76a1202c4&type=total&ucfs=1&"
)

PAGE_ROUTES = {
    "/": "index.html",
    "/admin": "admin.html",
    "/hotel": "hotel.html",
    "/restaurant": "restaurant.html",
    "/menu": "menu.html",
    "/events": "events.html",
    "/suites": "suites.html",
    "/sauna": "sauna.html",
    "/contact": "contact.html",
}

CONTENT_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
}


def build_database_url_from_pg_env() -> str:
    host = os.environ.get("PGHOST", "127.0.0.1").strip()
    port = os.environ.get("PGPORT", "5432").strip()
    database = os.environ.get("PGDATABASE", "vanatur").strip()
    user = os.environ.get("PGUSER", "postgres").strip()
    password = os.environ.get("PGPASSWORD", "postgres").strip()

    return f"postgresql://{user}:{password}@{host}:{port}/{database}"


@dataclass(frozen=True)
class Settings:
    root_dir: Path
    host: str
    port: int
    public_dir: Path
    database_url: str
    admin_api_key: str
    booking_url: str = DEFAULT_BOOKING_URL
    page_routes: dict[str, str] = field(default_factory=lambda: dict(PAGE_ROUTES))
    content_types: dict[str, str] = field(default_factory=lambda: dict(CONTENT_TYPES))

    @classmethod
    def from_root(cls, root_dir: Path) -> "Settings":
        load_env_file(root_dir / ".env", override=True)

        host = os.environ.get("HOST", "127.0.0.1").strip() or "127.0.0.1"
        port = int(os.environ.get("PORT", "3000"))
        database_url = os.environ.get("DATABASE_URL", "").strip() or build_database_url_from_pg_env()
        admin_api_key = os.environ.get("ADMIN_API_KEY", "").strip()

        return cls(
            root_dir=root_dir,
            host=host,
            port=port,
            public_dir=root_dir / "public",
            database_url=database_url,
            admin_api_key=admin_api_key,
        )
