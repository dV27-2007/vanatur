import { createEmptyState, createFeatureList, escapeHtml } from "./ui.js";

function createIngredientsMarkup(ingredients = []) {
  if (!ingredients.length) return "";
  return `
    <p class="menu-dish-ingredients">
      <span>Ингредиенты:</span>
      ${ingredients.map((item) => escapeHtml(item)).join(" &bull; ")}
    </p>
  `;
}

function renderMenuDishCard(item, options = {}) {
  const { badge = "", mediaLabel = "VANATUR" } = options;
  const safeAlt = escapeHtml(item.imageAlt || item.name || "Блюдо VANATUR");

  return `
    <article class="menu-dish-card">
      ${item.image ? `
        <div class="menu-dish-media">
          <img class="menu-dish-image" src="${escapeHtml(item.image)}" alt="${safeAlt}" loading="lazy" decoding="async" />
          <span class="menu-dish-badge">${escapeHtml(badge || mediaLabel)}</span>
        </div>
      ` : ""}
      <div class="menu-dish-body">
        <div class="menu-dish-top">
          <h3>${escapeHtml(item.name || item.title)}</h3>
          <span class="price-pill">${escapeHtml(item.price)}</span>
        </div>
        <p class="menu-dish-description">${escapeHtml(item.description || item.text || "")}</p>
        ${createIngredientsMarkup(item.ingredients || [])}
        ${item.portion ? `<div class="menu-dish-meta"><span>${escapeHtml(item.portion)}</span></div>` : ""}
      </div>
    </article>
  `;
}

export function mountMenuTabs({ categories = [], tabsSelector, panelSelector, emptyMessage }) {
  const tabs = document.querySelector(tabsSelector);
  const panel = document.querySelector(panelSelector);
  if (!tabs || !panel) return;

  if (!categories.length) {
    panel.innerHTML = createEmptyState(emptyMessage);
    return;
  }

  let activeIndex = 0;

  const renderPanel = () => {
    const category = categories[activeIndex];
    panel.innerHTML = `
      <div class="menu-panel-header">
        <span class="pill">${escapeHtml(category.name)}</span>
        <h3 class="card-title">${escapeHtml(category.name)}</h3>
        <p class="section-copy">${escapeHtml(category.description)}</p>
      </div>
      <div class="menu-dish-grid menu-dish-grid--compact">
        ${category.items.map((item) => renderMenuDishCard(item, { mediaLabel: category.name })).join("")}
      </div>
    `;
  };

  const renderTabs = () => {
    tabs.innerHTML = categories
      .map(
        (category, index) => `
          <button class="tab-button ${index === activeIndex ? "is-active" : ""}" type="button" data-index="${index}">
            ${escapeHtml(category.name)}
          </button>
        `
      )
      .join("");

    const activeBtn = tabs.querySelector(".is-active");
    if (activeBtn) activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    activeIndex = Number(button.dataset.index);
    renderTabs();
    renderPanel();
  });

  renderTabs();
  renderPanel();
}

export function renderMenuCategoryGrid(selector, categories = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = categories.length
    ? categories
        .map(
          (category) => `
            <section class="menu-category-card reveal">
              <div class="menu-panel-header menu-category-card__header">
                <span class="pill">${escapeHtml(category.name)}</span>
                <h3 class="card-title">${escapeHtml(category.name)}</h3>
                <p class="section-copy">${escapeHtml(category.description)}</p>
              </div>
              <div class="menu-dish-grid">
                ${category.items.map((item) => renderMenuDishCard(item, { mediaLabel: category.name })).join("")}
              </div>
            </section>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderMenuHighlights(selector, highlights = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = highlights.length
    ? highlights
        .map(
          (item) => `
            <div class="reveal">
              ${renderMenuDishCard(
                {
                  name: item.title,
                  description: item.text,
                  price: item.price,
                  image: item.image,
                  ingredients: item.ingredients,
                  portion: item.portion,
                },
                { badge: item.badge, mediaLabel: "Рекомендуем" }
              )}
            </div>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}

export function renderMenuNotes(selector, notes = [], emptyMessage) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = notes.length
    ? notes
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">${escapeHtml(item.badge || "Информация")}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
              ${createFeatureList(item.points)}
            </article>
          `
        )
        .join("")
    : createEmptyState(emptyMessage);
}
