const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (symbol) => HTML_ENTITIES[symbol]);
}

export function createFeatureList(items = []) {
  if (!items.length) {
    return "";
  }

  return `
    <ul class="feature-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

export function createPills(items = [], className = "pill") {
  return items
    .filter(Boolean)
    .map((item) => `<span class="${className}">${escapeHtml(item)}</span>`)
    .join("");
}

export function createEmptyState(message) {
  return `<div class="site-empty">${escapeHtml(message)}</div>`;
}
