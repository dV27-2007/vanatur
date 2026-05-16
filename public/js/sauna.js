import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, createFeatureList, escapeHtml } from "./ui.js";

function initRituals(rituals = []) {
  const navContainer = document.querySelector("[data-sauna-ritual-nav]");
  const panelContainer = document.querySelector("[data-sauna-ritual-panel]");

  if (!navContainer || !panelContainer) {
    return;
  }

  if (!rituals.length) {
    panelContainer.innerHTML = createEmptyState("Форматы сауны скоро появятся.");
    return;
  }

  let activeIndex = 0;

  const renderPanel = () => {
    const ritual = rituals[activeIndex];

    panelContainer.innerHTML = `
      <span class="pill">Формат ${activeIndex + 1}</span>
      <h3>${escapeHtml(ritual.title)}</h3>
      <div class="ritual-meta">
        <span class="price-pill">${escapeHtml(ritual.duration)}</span>
        <span class="price-pill">${escapeHtml(ritual.price)}</span>
      </div>
      <p class="section-copy">${escapeHtml(ritual.description)}</p>
      <div class="ritual-includes">
        ${createFeatureList(ritual.includes)}
      </div>
    `;
  };

  const renderNav = () => {
    navContainer.innerHTML = rituals
      .map(
        (ritual, index) => `
          <button class="ritual-button ${index === activeIndex ? "is-active" : ""}" type="button" data-index="${index}">
            ${escapeHtml(ritual.title)}
          </button>
        `
      )
      .join("");
  };

  navContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");

    if (!button) {
      return;
    }

    activeIndex = Number(button.dataset.index);
    renderNav();
    renderPanel();
  });

  renderNav();
  renderPanel();
}

function renderSimpleCards(selector, items = [], pillLabel, emptyMessage) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

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

async function initPage() {
  initShell("sauna");

  try {
    const content = await fetchSiteContent();
    initRituals(content.sauna?.rituals);
    renderSimpleCards(
      "[data-sauna-benefits]",
      content.sauna?.benefits,
      "Преимущество",
      "Преимущества сауны скоро появятся."
    );
    renderSimpleCards(
      "[data-sauna-packages]",
      content.sauna?.packages,
      "Сценарий",
      "Комбинации с сауной скоро появятся."
    );
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
