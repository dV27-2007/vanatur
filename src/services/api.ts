import { supabase } from "@/lib/supabase";
import type { SiteContent, InquiryPayload, InquiryRecord, ApiResponse } from "@/types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let siteContentCache: Promise<SiteContent> | null = null;

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!siteContentCache) {
    siteContentCache = (async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("payload")
        .eq("content_key", "main")
        .maybeSingle();

      if (error) throw new Error("Failed to load site content.");
      if (!data) throw new Error("Site content not found.");

      return data.payload as SiteContent;
    })();
  }

  return siteContentCache;
}

export async function submitInquiry(payload: InquiryPayload): Promise<ApiResponse<InquiryRecord>> {
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
    return { ok: false, message: data.message || "Не удалось отправить запрос." };
  }

  return { ok: true, message: data.message || "Запрос отправлен.", data: data.inquiry };
}

export async function fetchAdminInquiries(limit = 200): Promise<InquiryRecord[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Failed to load inquiries.");

  return (data ?? []).map((row) => ({
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
