import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, escapeHtml } from "./ui.js";
import { mountMenuTabs } from "./menu-renderers.js";

function renderZones(zones = []) {
  const container = document.querySelector("[data-restaurant-zones]");

  if (!container) {
    return;
  }

  container.innerHTML = zones.length
    ? zones
        .map(
          (zone) => `
            <article class="info-card reveal">
              <span class="price-pill">${escapeHtml(zone.meta)}</span>
              <h3>${escapeHtml(zone.title)}</h3>
              <p>${escapeHtml(zone.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Зоны ресторана скоро будут добавлены.");
}

function renderPairings(pairings = []) {
  const container = document.querySelector("[data-restaurant-pairings]");

  if (!container) {
    return;
  }

  container.innerHTML = pairings.length
    ? pairings
        .map(
          (pairing) => `
            <article class="info-card reveal">
              <span class="pill">Сопровождение</span>
              <h3>${escapeHtml(pairing.title)}</h3>
              <p>${escapeHtml(pairing.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Сопровождение ужина появится позже.");
}

async function initPage() {
  initShell("restaurant");

  try {
    const content = await fetchSiteContent();
    mountMenuTabs({
      categories: content.restaurant?.menuCategories,
      tabsSelector: "[data-menu-tabs]",
      panelSelector: "[data-menu-panel]",
      emptyMessage: "Меню временно недоступно."
    });
    renderZones(content.restaurant?.zones);
    renderPairings(content.restaurant?.pairings);
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
