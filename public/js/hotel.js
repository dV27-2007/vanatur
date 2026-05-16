import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, escapeHtml } from "./ui.js";

function renderHighlights(highlights = []) {
  const container = document.querySelector("[data-hotel-highlights]");

  if (!container) {
    return;
  }

  container.innerHTML = highlights.length
    ? highlights
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">${escapeHtml(item.badge || "Hotel")}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Информация об отеле скоро появится.");
}

function renderDetails(details = []) {
  const container = document.querySelector("[data-hotel-details]");

  if (!container) {
    return;
  }

  container.innerHTML = details.length
    ? details
        .map(
          (item) => `
            <article class="stack-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.value)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Детали по проживанию скоро появятся.");
}

function renderFaq(faq = []) {
  const container = document.querySelector("[data-hotel-faq]");

  if (!container) {
    return;
  }

  container.innerHTML = faq.length
    ? faq
        .map(
          (item) => `
            <details class="faq-item reveal">
              <summary>${escapeHtml(item.question)}</summary>
              <p>${escapeHtml(item.answer)}</p>
            </details>
          `
        )
        .join("")
    : createEmptyState("Вопросы по проживанию скоро появятся.");
}

async function initPage() {
  initShell("hotel");

  try {
    const content = await fetchSiteContent();
    renderHighlights(content.hotel?.highlights);
    renderDetails(content.hotel?.details);
    renderFaq(content.hotel?.faq);
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
