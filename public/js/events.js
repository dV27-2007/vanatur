import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderInfoCards, renderPriceCards, renderTimelineCards } from "./ui.js";

async function initPage() {
  initShell("events");

  try {
    const content = await fetchSiteContent();
    renderInfoCards("[data-event-formats]", content.events?.formats, "Формат", "Форматы мероприятий скоро появятся.");
    renderPriceCards("[data-event-spaces]", content.events?.spaces, "Площадки временно недоступны.");
    renderTimelineCards("[data-event-steps]", content.events?.steps, "Процесс организации скоро появится.");
    renderPriceCards("[data-event-packages]", content.events?.packages, "Пакеты скоро будут опубликованы.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
