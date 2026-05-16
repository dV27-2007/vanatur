from __future__ import annotations

from http import HTTPStatus

from backend.crud.inquiries import create_inquiry
from backend.crud.site_content import get_main_site_content
from backend.http import RequestContext
from backend.schemas import InquiryCreateSchema, iso_now


def dispatch_public_routes(context: RequestContext) -> bool:
    if context.method == "GET" and context.pathname == "/api/site-content":
        record = get_main_site_content(context.app.database)
        context.send_json(HTTPStatus.OK, record.payload)
        return True

    if context.method == "GET" and context.pathname == "/api/status":
        context.send_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "service": "VANATUR backend",
                "time": iso_now(),
            },
        )
        return True

    if context.method in {"GET", "HEAD"} and context.pathname == "/booking":
        context.redirect(context.app.settings.booking_url)
        return True

    if context.method == "POST" and context.pathname == "/api/inquiries":
        body = context.parse_json_body()
        inquiry_input = InquiryCreateSchema.from_payload(body)
        errors = inquiry_input.validate()

        if errors:
            context.send_json(
                HTTPStatus.BAD_REQUEST,
                {
                    "ok": False,
                    "message": errors[0],
                    "errors": errors,
                },
            )
            return True

        inquiry = create_inquiry(context.app.database, inquiry_input.to_model())
        context.send_json(
            HTTPStatus.CREATED,
            {
                "ok": True,
                "message": "Запрос отправлен.",
                "inquiry": inquiry.to_dict(),
            },
        )
        return True

    return False
