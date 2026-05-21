import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, createFeatureList, createPills, escapeHtml, renderInfoCards } from "./ui.js";

function initSuiteFilters(suitesData = []) {
  const filtersContainer = document.querySelector("[data-suite-filters]");
  const gridContainer = document.querySelector("[data-suite-grid]");

  if (!filtersContainer || !gridContainer) return;

  if (!suitesData.length) {
    gridContainer.innerHTML = createEmptyState("Купе временно недоступны.");
    return;
  }

  const filters = ["Все", ...new Set(suitesData.flatMap((suite) => suite.audiences || []))];
  let activeFilter = "Все";

  const renderGrid = () => {
    const filteredSuites =
      activeFilter === "Все"
        ? suitesData
        : suitesData.filter((suite) => (suite.audiences || []).includes(activeFilter));

    gridContainer.innerHTML = filteredSuites.length
      ? filteredSuites
          .map(
            (suite) => `
              <article class="info-card reveal">
                <div class="meta-row">
                  <span class="pill">${escapeHtml(suite.highlight)}</span>
                  <span class="price-pill">${escapeHtml(suite.price)}</span>
                </div>
                <h3>${escapeHtml(suite.name)}</h3>
                <div class="meta-row">
                  ${createPills([suite.size, suite.guests], "price-pill")}
                </div>
                <p>${escapeHtml(suite.description)}</p>
                ${createFeatureList(suite.features)}
              </article>
            `
          )
          .join("")
      : createEmptyState("По выбранному фильтру подходящих купе пока нет.");

    initReveal();
  };

  const renderFilters = () => {
    filtersContainer.setAttribute("role", "tablist");
    filtersContainer.setAttribute("aria-label", "Фильтр купе");

    filtersContainer.innerHTML = filters
      .map(
        (filter) => `
          <button
            class="filter-button ${filter === activeFilter ? "is-active" : ""}"
            type="button"
            role="tab"
            aria-selected="${filter === activeFilter}"
            data-filter="${escapeHtml(filter)}"
          >
            ${escapeHtml(filter)}
          </button>
        `
      )
      .join("");
  };

  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeFilter = button.dataset.filter || "Все";
    renderFilters();
    renderGrid();
  });

  renderFilters();
  renderGrid();
}

async function initPage() {
  initShell("suites");

  try {
    const content = await fetchSiteContent();
    const suitePage = content.suites || {};

    initSuiteFilters(suitePage.suites);
    renderInfoCards("[data-suite-services]", suitePage.services, "Сервис", "Сервисы для купе скоро появятся.");
    renderInfoCards("[data-suite-experiences]", suitePage.experiences, "Формат", "Сценарии вечера скоро появятся.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
