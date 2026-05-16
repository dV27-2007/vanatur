from __future__ import annotations

from http import HTTPStatus

from backend.crud.inquiries import list_inquiries
from backend.crud.site_content import get_main_site_content, replace_main_site_content
from backend.http import RequestContext, RequestError
from backend.schemas import normalize_limit, validate_site_content_payload


def dispatch_admin_routes(context: RequestContext) -> bool:
    if context.pathname == "/api/admin/site-content" and context.method == "GET":
        context.require_admin_key()
        record = get_main_site_content(context.app.database)
        context.send_json(HTTPStatus.OK, record.payload)
        return True

    if context.pathname == "/api/admin/site-content" and context.method == "PUT":
        context.require_admin_key()
        body = context.parse_json_body()

        try:
            payload = validate_site_content_payload(body)
        except ValueError as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, str(error)) from error

        record = replace_main_site_content(context.app.database, payload)
        context.send_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "message": "Kontent sayta obnovlen v PostgreSQL.",
                "content": record.payload,
            },
        )
        return True

    if context.pathname == "/api/admin/inquiries" and context.method == "GET":
        context.require_admin_key()
        limit_raw = context.query.get("limit", ["200"])[0]

        try:
            limit = normalize_limit(limit_raw)
        except ValueError as error:
            raise RequestError(HTTPStatus.BAD_REQUEST, str(error)) from error

        items = [inquiry.to_dict() for inquiry in list_inquiries(context.app.database, limit)]
        context.send_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "items": items,
            },
        )
        return True

    return False
