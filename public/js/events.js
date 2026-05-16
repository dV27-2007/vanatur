import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, createFeatureList, escapeHtml } from "./ui.js";

function renderFormats(formats = []) {
  const container = document.querySelector("[data-event-formats]");

  if (!container) {
    return;
  }

  container.innerHTML = formats.length
    ? formats
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">Формат</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Форматы мероприятий скоро появятся.");
}

function renderSpaces(spaces = []) {
  const container = document.querySelector("[data-event-spaces]");

  if (!container) {
    return;
  }

  container.innerHTML = spaces.length
    ? spaces
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="price-pill">${escapeHtml(item.capacity)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              ${createFeatureList(item.features)}
            </article>
          `
        )
        .join("")
    : createEmptyState("Площадки временно недоступны.");
}

function renderSteps(steps = []) {
  const container = document.querySelector("[data-event-steps]");

  if (!container) {
    return;
  }

  container.innerHTML = steps.length
    ? steps
        .map(
          (item) => `
            <article class="timeline-card reveal">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Процесс организации скоро появится.");
}

function renderPackages(packages = []) {
  const container = document.querySelector("[data-event-packages]");

  if (!container) {
    return;
  }

  container.innerHTML = packages.length
    ? packages
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="price-pill">${escapeHtml(item.price)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Пакеты скоро будут опубликованы.");
}

async function initPage() {
  initShell("events");

  try {
    const content = await fetchSiteContent();
    renderFormats(content.events?.formats);
    renderSpaces(content.events?.spaces);
    renderSteps(content.events?.steps);
    renderPackages(content.events?.packages);
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
