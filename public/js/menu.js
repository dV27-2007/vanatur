import { fetchSiteContent } from "./api.js";
import {
  renderMenuCategoryGrid,
  renderMenuHighlights,
  renderMenuNotes
} from "./menu-renderers.js";
import { initReveal, initShell } from "./site-shell.js";
import { createEmptyState, escapeHtml } from "./ui.js";

function renderPairings(pairings = []) {
  const container = document.querySelector("[data-menu-pairings]");

  if (!container) {
    return;
  }

  container.innerHTML = pairings.length
    ? pairings
        .map(
          (item) => `
            <article class="info-card reveal">
              <span class="pill">Сопровождение</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")
    : createEmptyState("Сопровождение к меню скоро появится.");
}

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
    renderPairings(content.restaurant?.pairings);
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
