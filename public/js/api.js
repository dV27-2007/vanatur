let siteContentPromise;

export async function fetchSiteContent() {
  if (!siteContentPromise) {
    siteContentPromise = fetch("/api/site-content").then(async (response) => {
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные сайта.");
      }

      return response.json();
    });
  }

  return siteContentPromise;
}

export async function submitInquiry(payload) {
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не удалось отправить запрос.");
  }

  return data;
}

function buildAdminHeaders(adminKey) {
  return {
    "Content-Type": "application/json",
    "X-Admin-Key": String(adminKey || "").trim()
  };
}

export async function fetchAdminSiteContent(adminKey) {
  const response = await fetch("/api/admin/site-content", {
    headers: buildAdminHeaders(adminKey)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не удалось загрузить admin-контент.");
  }

  return data;
}

export async function updateAdminSiteContent(payload, adminKey) {
  const response = await fetch("/api/admin/site-content", {
    method: "PUT",
    headers: buildAdminHeaders(adminKey),
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не удалось обновить контент в базе.");
  }

  return data;
}

export async function fetchAdminInquiries(adminKey, limit = 200) {
  const searchParams = new URLSearchParams({
    limit: String(limit)
  });
  const response = await fetch(`/api/admin/inquiries?${searchParams.toString()}`, {
    headers: buildAdminHeaders(adminKey)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Не удалось загрузить заявки из базы.");
  }

  return data.items || [];
}
