document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-admin-login-form]");
  const status = document.querySelector("[data-admin-status]");

  if (!form || !status) {
    return;
  }

  const setStatus = (message, tone = "") => {
    status.textContent = message;
    status.dataset.tone = tone;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!username || !password) {
      setStatus("Заполните логин и пароль.", "error");
      return;
    }

    setStatus(
      "Login UI est', i backend API uzhe gotov dlya PostgreSQL, no avtorizaciya na etoy stranice poka ne podklyuchena.",
      "success"
    );
  });

  form.addEventListener("input", () => {
    setStatus("", "");
  });
});
