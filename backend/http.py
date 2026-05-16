from __future__ import annotations

import json
from dataclasses import dataclass
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from typing import TYPE_CHECKING, Any
from urllib.parse import parse_qs, urlparse

from backend.db import StorageError


if TYPE_CHECKING:
    from backend.app import VanaturApplication


MAX_BODY_BYTES = 1_000_000


class RequestError(Exception):
    def __init__(self, status: HTTPStatus, message: str) -> None:
        super().__init__(message)
        self.status = status
        self.message = message


@dataclass
class RequestContext:
    handler: BaseHTTPRequestHandler
    app: "VanaturApplication"
    include_body: bool
    method: str
    pathname: str
    query: dict[str, list[str]]

    @classmethod
    def from_handler(
        cls,
        handler: BaseHTTPRequestHandler,
        app: "VanaturApplication",
        include_body: bool,
    ) -> "RequestContext":
        parsed_url = urlparse(handler.path or "/")
        return cls(
            handler=handler,
            app=app,
            include_body=include_body,
            method=handler.command,
            pathname=parsed_url.path or "/",
            query=parse_qs(parsed_url.query or ""),
        )

    def parse_json_body(self) -> Any:
        content_length_raw = self.handler.headers.get("Content-Length", "0").strip() or "0"

        try:
            content_length = int(content_length_raw)
        except ValueError as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, "Некорректный Content-Length.") from error

        if content_length > MAX_BODY_BYTES:
            raise RequestError(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "Слишком большой запрос.")

        raw_body = self.handler.rfile.read(content_length) if content_length > 0 else b""
        if not raw_body:
            return {}

        try:
            return json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, "Некорректный JSON.") from error

    def require_admin_key(self) -> None:
        expected_key = self.app.settings.admin_api_key
        if not expected_key:
            raise RequestError(
                HTTPStatus.SERVICE_UNAVAILABLE,
                "Admin API key ne nastroen na servere.",
            )

        provided_key = self.handler.headers.get("X-Admin-Key", "").strip()
        if provided_key != expected_key:
            raise RequestError(HTTPStatus.UNAUTHORIZED, "Admin dostup zapreshchen.")

    def send_json(self, status: HTTPStatus, payload: Any) -> None:
        content = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.handler.send_response(status)
        self.handler.send_header("Cache-Control", "no-cache")
        self.handler.send_header("Content-Type", "application/json; charset=utf-8")
        self.handler.send_header("Content-Length", str(len(content)))
        self.handler.end_headers()

        if self.include_body:
            self.handler.wfile.write(content)

    def send_text(self, status: HTTPStatus, message: str) -> None:
        content = message.encode("utf-8")
        self.handler.send_response(status)
        self.handler.send_header("Cache-Control", "no-cache")
        self.handler.send_header("Content-Type", "text/plain; charset=utf-8")
        self.handler.send_header("Content-Length", str(len(content)))
        self.handler.end_headers()

        if self.include_body and content:
            self.handler.wfile.write(content)

    def serve_file(self, file_path: Path) -> None:
        content = file_path.read_bytes()
        self.handler.send_response(HTTPStatus.OK)
        self.handler.send_header("Cache-Control", "no-cache")
        self.handler.send_header("Content-Type", self.app.get_content_type(file_path))
        self.handler.send_header("Content-Length", str(len(content)))
        self.handler.end_headers()

        if self.include_body:
            self.handler.wfile.write(content)

    def redirect(self, location: str, status: HTTPStatus = HTTPStatus.FOUND) -> None:
        self.handler.send_response(status)
        self.handler.send_header("Cache-Control", "no-cache")
        self.handler.send_header("Location", location)
        self.handler.end_headers()


def handle_api_error(context: RequestContext, error: Exception) -> bool:
    if not context.pathname.startswith("/api/"):
        return False

    if isinstance(error, RequestError):
        context.send_json(
            error.status,
            {
                "ok": False,
                "message": error.message,
            },
        )
        return True

    if isinstance(error, StorageError):
        context.send_json(
            HTTPStatus.INTERNAL_SERVER_ERROR,
            {
                "ok": False,
                "message": str(error),
            },
        )
        return True

    return False
