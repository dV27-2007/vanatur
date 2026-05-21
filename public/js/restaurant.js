import { fetchSiteContent } from "./api.js";
import { mountMenuTabs } from "./menu-renderers.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderPriceCards, renderInfoCards } from "./ui.js";

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
    renderPriceCards("[data-restaurant-zones]", content.restaurant?.zones, "Зоны ресторана скоро будут добавлены.");
    renderInfoCards("[data-restaurant-pairings]", content.restaurant?.pairings, "Сопровождение", "Сопровождение ужина появится позже.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
