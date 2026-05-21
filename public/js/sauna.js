import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, createFeatureList, escapeHtml, renderInfoCards } from "./ui.js";

function initRituals(rituals = []) {
  const navContainer = document.querySelector("[data-sauna-ritual-nav]");
  const panelContainer = document.querySelector("[data-sauna-ritual-panel]");

  if (!navContainer || !panelContainer) return;

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
    panelContainer.setAttribute("aria-labelledby", `ritual-tab-${activeIndex}`);
  };

  const renderNav = () => {
    navContainer.setAttribute("role", "tablist");
    navContainer.setAttribute("aria-label", "Форматы сауны");

    navContainer.innerHTML = rituals
      .map(
        (ritual, index) => `
          <button
            class="ritual-button ${index === activeIndex ? "is-active" : ""}"
            type="button"
            role="tab"
            id="ritual-tab-${index}"
            aria-selected="${index === activeIndex}"
            aria-controls="ritual-panel"
            data-index="${index}"
          >
            ${escapeHtml(ritual.title)}
          </button>
        `
      )
      .join("");
  };

  navContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;

    activeIndex = Number(button.dataset.index);
    renderNav();
    renderPanel();
  });

  panelContainer.setAttribute("role", "tabpanel");
  panelContainer.id = "ritual-panel";

  renderNav();
  renderPanel();
}

async function initPage() {
  initShell("sauna");

  try {
    const content = await fetchSiteContent();
    initRituals(content.sauna?.rituals);
    renderInfoCards("[data-sauna-benefits]", content.sauna?.benefits, "Преимущество", "Преимущества сауны скоро появятся.");
    renderInfoCards("[data-sauna-packages]", content.sauna?.packages, "Сценарий", "Комбинации с сауной скоро появятся.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
