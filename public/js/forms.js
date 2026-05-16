import { submitInquiry } from "./api.js";

function setStatus(node, message, state = "") {
  if (!node) {
    return;
  }

  node.textContent = message;

  if (state) {
    node.dataset.state = state;
  } else {
    delete node.dataset.state;
  }
}

function normalizeFormValue(value) {
  return typeof value === "string" ? value.trim() : value;
}

function getPayload(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  Object.keys(payload).forEach((key) => {
    payload[key] = normalizeFormValue(payload[key]);
  });

  payload.sourcePage = form.dataset.sourcePage || document.body.dataset.page || "site";
  return payload;
}

function setDateMinimums(form) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .split("T")[0];

  form.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = localDate;
  });
}

export function initInquiryForms() {
  const forms = document.querySelectorAll("[data-inquiry-form]");

  forms.forEach((form) => {
    if (form.dataset.bound === "true") {
      return;
    }

    form.dataset.bound = "true";
    setDateMinimums(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const statusNode = form.querySelector("[data-form-status]");
      const submitButton = form.querySelector('button[type="submit"]');
      const payload = getPayload(form);

      setStatus(statusNode, "Отправляем запрос...", "pending");

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await submitInquiry(payload);
        form.reset();
        setDateMinimums(form);
        setStatus(
          statusNode,
          response.message || "Спасибо! Ваш запрос отправлен.",
          "success"
        );
      } catch (error) {
        setStatus(
          statusNode,
          error instanceof Error ? error.message : "Не удалось отправить запрос.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
}
