const SUPABASE_URL = "https://qwsomhprbregtangrnut.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3c29taHByYnJlZ3RhbmdybnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDM5MDYsImV4cCI6MjA5NDUxOTkwNn0.0Yf2KbncmpCm72y-uh84s-c82ANscV1QUQ1pBlWhwfM";

const { createClient } = supabase;
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let siteContentPromise;

export async function fetchSiteContent() {
  if (!siteContentPromise) {
    siteContentPromise = (async () => {
      const { data, error } = await supabaseClient
        .from("site_content")
        .select("payload")
        .eq("content_key", "main")
        .maybeSingle();

      if (error) {
        throw new Error("Не удалось загрузить данные сайта.");
      }

      if (!data) {
        throw new Error("Контент сайта не найден.");
      }

      return data.payload;
    })();
  }

  return siteContentPromise;
}

export async function submitInquiry(payload) {
  const apiUrl = `${SUPABASE_URL}/functions/v1/inquiries`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не удалось отправить запрос.");
  }

  return data;
}

export async function fetchAdminInquiries(limit = 200) {
  const { data, error } = await supabaseClient
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Не удалось загрузить заявки.");
  }

  return (data || []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    requestType: row.request_type,
    name: row.name,
    phone: row.phone,
    email: row.email,
    guests: row.guests,
    date: row.desired_date,
    space: row.space,
    sourcePage: row.source_page,
    message: row.message,
  }));
}
