import { fetchSiteContent } from "./api.js";
import { renderMenuHighlights } from "./menu-renderers.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, escapeHtml } from "./ui.js";

function renderStats(stats = []) {
  const container = document.querySelector("[data-home-stats]");

  if (!container) {
    return;
  }

  container.innerHTML = stats.length
    ? stats
        .map(
          (stat) => `
            <article class="metric-card reveal">
              <span class="metric-value">${escapeHtml(stat.value)}</span>
              <span class="metric-label">${escapeHtml(stat.label)}</span>
            </article>
          `
        )
        .join("")
    : createEmptyState("Скоро здесь появятся ключевые показатели VANATUR.");
}

function renderExperiences(experiences = []) {
  const container = document.querySelector("[data-home-experiences]");

  if (!container) {
    return;
  }

  container.innerHTML = experiences.length
    ? experiences
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
    : createEmptyState("Разделы комплекса временно недоступны.");
}

function renderMoments(moments = []) {
  const container = document.querySelector("[data-home-moments]");

  if (!container) {
    return;
  }

  container.innerHTML = moments.length
    ? moments
        .map(
          (item) => `
            <article class="info-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Сценарии отдыха скоро появятся.");
}

async function initPage() {
  initShell("home");

  try {
    const content = await fetchSiteContent();
    renderStats(content.home?.stats);
    renderExperiences(content.home?.experiences);
    renderMenuHighlights(
      "[data-home-menu-highlights]",
      content.menu?.highlights,
      "Популярные позиции скоро появятся."
    );
    renderMoments(content.home?.moments);
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
