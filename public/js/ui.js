/* ============================================
   Shared UI utilities and renderers
   ============================================ */

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);
}

/* --- Low-level markup helpers --- */

export function createFeatureList(items = []) {
  if (!items.length) return "";
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

/* --- Shared renderers (eliminate duplication across page modules) --- */

export function renderInfoCards(selector, items = [], pillLabel, emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">${escapeHtml(pillLabel)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderPriceCards(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="price-pill">${escapeHtml(item.meta || item.capacity || item.price)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text || item.description)}</p>
              ${createFeatureList(item.features)}
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderStackCards(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="stack-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.value)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderFaq(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <details class="faq-item reveal">
              <summary>${escapeHtml(item.question)}</summary>
              <p>${escapeHtml(item.answer)}</p>
            </details>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderTimelineCards(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="timeline-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderMetricCards(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="metric-card reveal">
              <span class="metric-value">${escapeHtml(item.value)}</span>
              <span class="metric-label">${escapeHtml(item.label)}</span>
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderExperienceCards(selector, items = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">${escapeHtml(item.badge)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
              <a class="inline-link" href="${escapeHtml(item.link)}">${escapeHtml(item.linkLabel)}</a>
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}
