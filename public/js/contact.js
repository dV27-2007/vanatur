import { fetchSiteContent } from "./api.js";
import { initInquiryForms } from "./forms.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, escapeHtml } from "./ui.js";

function renderAdvantages(advantages = []) {
  const container = document.querySelector("[data-contact-advantages]");

  if (!container) {
    return;
  }

  container.innerHTML = advantages.length
    ? advantages
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">Advantage</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Преимущества VANATUR скоро будут добавлены.");
}

function renderHours(hours = []) {
  const container = document.querySelector("[data-contact-hours]");

  if (!container) {
    return;
  }

  container.innerHTML = hours.length
    ? hours
        .map(
          (item) => `
            <article class="stack-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.value)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Режим работы скоро появится.");
}

function renderFaq(faq = []) {
  const container = document.querySelector("[data-contact-faq]");

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
    : createEmptyState("Ответы на вопросы скоро появятся.");
}

async function initPage() {
  initShell("contact");

  try {
    const content = await fetchSiteContent();
    renderAdvantages(content.contact?.advantages);
    renderHours(content.contact?.hours);
    renderFaq(content.contact?.faq);
  } catch (error) {
    console.error(error);
  }

  initInquiryForms();
  initReveal();
}

initPage();
