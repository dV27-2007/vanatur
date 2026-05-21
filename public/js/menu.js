import { fetchSiteContent } from "./api.js";
import {
  renderMenuCategoryGrid,
  renderMenuHighlights,
  renderMenuNotes
} from "./menu-renderers.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderInfoCards } from "./ui.js";

async function initPage() {
  initShell("menu");

  try {
    const content = await fetchSiteContent();
    renderMenuHighlights(
      "[data-menu-highlights]",
      content.menu?.highlights,
      "Рекомендуемые позиции скоро появятся."
    );
    renderMenuCategoryGrid(
      "[data-menu-categories]",
      content.restaurant?.menuCategories,
      "Полное меню временно недоступно."
    );
    renderInfoCards("[data-menu-pairings]", content.restaurant?.pairings, "Сопровождение", "Сопровождение к меню скоро появится.");
    renderMenuNotes(
      "[data-menu-notes]",
      content.menu?.notes,
      "Дополнительная информация по меню скоро появится."
    );
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
