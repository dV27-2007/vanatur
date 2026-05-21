import { fetchSiteContent } from "./api.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderInfoCards, renderStackCards, renderFaq } from "./ui.js";

async function initPage() {
  initShell("hotel");

  try {
    const content = await fetchSiteContent();
    renderInfoCards("[data-hotel-highlights]", content.hotel?.highlights, "Отель", "Информация об отеле скоро появится.");
    renderStackCards("[data-hotel-details]", content.hotel?.details, "Детали по проживанию скоро появятся.");
    renderFaq("[data-hotel-faq]", content.hotel?.faq, "Вопросы по проживанию скоро появятся.");
  } catch (error) {
    console.error(error);
  }

  initReveal();
}

initPage();
