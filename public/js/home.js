import { fetchSiteContent } from "./api.js";
import { renderMenuHighlights } from "./menu-renderers.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderMetricCards, renderExperienceCards, renderInfoCards } from "./ui.js";

async function initPage() {
  initShell("home");

  try {
    const content = await fetchSiteContent();
    renderMetricCards("[data-home-stats]", content.home?.stats, "Скоро здесь появятся ключевые показатели VANATUR.");
    renderExperienceCards("[data-home-experiences]", content.home?.experiences, "Разделы комплекса временно недоступны.");
    renderMenuHighlights(
      "[data-home-menu-highlights]",
      content.menu?.highlights,
      "Популярные позиции скоро появятся."
    );
    renderInfoCards("[data-home-moments]", content.home?.moments, "Сценарии отдыха", "Сценарии отдыха скоро появятся.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
