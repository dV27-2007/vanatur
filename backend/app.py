from __future__ import annotations

import sys
from dataclasses import dataclass
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from backend.config import Settings
from backend.db import DatabaseManager, StorageError
from backend.http import RequestContext, RequestError, handle_api_error
from backend.routes.admin import dispatch_admin_routes
from backend.routes.public import dispatch_public_routes


@dataclass
class VanaturApplication:
    settings: Settings
    database: DatabaseManager

    def get_content_type(self, file_path: Path) -> str:
        return self.settings.content_types.get(file_path.suffix.lower(), "application/octet-stream")

    def resolve_public_path(self, pathname: str) -> Path | None:
        if pathname in self.settings.page_routes:
            return self.settings.public_dir / self.settings.page_routes[pathname]

        relative_path = pathname.lstrip("/")
        resolved_path = (self.settings.public_dir / relative_path).resolve()

        try:
            resolved_path.relative_to(self.settings.public_dir)
        except ValueError:
            return None

        return resolved_path

    def handle_request(self, handler: BaseHTTPRequestHandler, include_body: bool) -> None:
        context = RequestContext.from_handler(handler, self, include_body)

        try:
            if dispatch_public_routes(context):
                return

            if dispatch_admin_routes(context):
                return

            if context.method in {"GET", "HEAD"}:
                public_path = self.resolve_public_path(context.pathname)

                if public_path is None or not public_path.is_file():
                    context.send_text(HTTPStatus.NOT_FOUND, "Страница не найдена.")
                    return

                context.serve_file(public_path)
                return

            context.send_text(HTTPStatus.NOT_FOUND, "Страница не найдена.")
        except RequestError as error:
            if handle_api_error(context, error):
                return

            context.send_text(error.status, error.message)
        except StorageError as error:
            if handle_api_error(context, error):
                return

            context.send_text(HTTPStatus.INTERNAL_SERVER_ERROR, "Ошибка сервера.")
        except Exception as error:  # pragma: no cover - defensive fallback
            print("Unhandled server error:", error, file=sys.stderr)

            if handle_api_error(context, StorageError("Ошибка сервера.")):
                return

            context.send_text(HTTPStatus.INTERNAL_SERVER_ERROR, "Ошибка сервера.")


class VanaturRequestHandler(BaseHTTPRequestHandler):
    server_version = "VanaturPython/2.0"

    def do_GET(self) -> None:
        self.server.app.handle_request(self, include_body=True)  # type: ignore[attr-defined]

    def do_HEAD(self) -> None:
        self.server.app.handle_request(self, include_body=False)  # type: ignore[attr-defined]

    def do_POST(self) -> None:
        self.server.app.handle_request(self, include_body=True)  # type: ignore[attr-defined]

    def do_PUT(self) -> None:
        self.server.app.handle_request(self, include_body=True)  # type: ignore[attr-defined]

    def log_message(self, format: str, *args) -> None:
        sys.stdout.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))


def create_application(root_dir: Path) -> VanaturApplication:
    settings = Settings.from_root(root_dir)
    database = DatabaseManager(settings)
    database.bootstrap()
    return VanaturApplication(settings=settings, database=database)


def run() -> None:
    root_dir = Path(__file__).resolve().parent.parent

    try:
        application = create_application(root_dir)
    except StorageError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error

    server = ThreadingHTTPServer(
        (application.settings.host, application.settings.port),
        VanaturRequestHandler,
    )
    server.app = application  # type: ignore[attr-defined]
    print(
        f"VANATUR backend zapushchen na http://{application.settings.host}:{application.settings.port}"
    )
    print("Storage: PostgreSQL")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer ostanovlen.")
    finally:
        server.server_close()
