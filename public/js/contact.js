import { fetchSiteContent } from "./api.js";
import { initInquiryForms } from "./forms.js";
import { initReveal, initShell } from "./site-shell.js";
import { renderInfoCards, renderStackCards, renderFaq } from "./ui.js";

async function initPage() {
  initShell("contact");

  try {
    const content = await fetchSiteContent();
    renderInfoCards("[data-contact-advantages]", content.contact?.advantages, "Преимущество", "Преимущества VANATUR скоро будут добавлены.");
    renderStackCards("[data-contact-hours]", content.contact?.hours, "Режим работы скоро появится.");
    renderFaq("[data-contact-faq]", content.contact?.faq, "Ответы на вопросы скоро появятся.");
  } catch (error) {
    console.error(error);
  }

  initInquiryForms();
  initReveal();
}

initPage();
