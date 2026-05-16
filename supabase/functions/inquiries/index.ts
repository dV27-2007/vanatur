import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname.endsWith("/inquiries")) {
      const body = await req.json();

      const { requestType, name, phone, email, guests, date, space, sourcePage, message } = body;

      if (!name || !phone || !requestType) {
        return new Response(
          JSON.stringify({ ok: false, message: "Укажите имя, телефон и тип запроса." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const id = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          id,
          created_at: new Date().toISOString(),
          request_type: requestType,
          name,
          phone,
          email: email || "",
          guests: guests ?? null,
          desired_date: date || "",
          space: space || "",
          source_page: sourcePage || "",
          message: message || "",
        }),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error("Insert failed:", errText);
        return new Response(
          JSON.stringify({ ok: false, message: "Не удалось сохранить заявку." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const [inserted] = await insertRes.json();

      return new Response(
        JSON.stringify({
          ok: true,
          message: "Запрос отправлен.",
          inquiry: {
            id: inserted.id,
            createdAt: inserted.created_at,
            requestType: inserted.request_type,
            name: inserted.name,
            phone: inserted.phone,
            email: inserted.email,
            guests: inserted.guests,
            date: inserted.desired_date,
            space: inserted.space,
            sourcePage: inserted.source_page,
            message: inserted.message,
          },
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, message: "Not found." }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
