import { supabaseClient, fetchAdminInquiries } from "./api.js";
import { initShell } from "./site-shell.js";
import { escapeHtml } from "./ui.js";

const loginView = document.querySelector("[data-admin-login-view]");
const dashboardView = document.querySelector("[data-admin-dashboard-view]");
const loginForm = document.querySelector("[data-admin-login-form]");
const statusNode = document.querySelector("[data-admin-status]");
const inquiriesContainer = document.querySelector("[data-admin-inquiries]");
const logoutButton = document.querySelector("[data-admin-logout]");
const refreshButton = document.querySelector("[data-admin-refresh]");

function setStatus(message, state = "") {
  if (!statusNode) return;
  statusNode.textContent = message;
  if (state) {
    statusNode.dataset.state = state;
  } else {
    delete statusNode.dataset.state;
  }
}

function showView(view) {
  if (view === "dashboard") {
    loginView.style.display = "none";
    dashboardView.style.display = "";
  } else {
    loginView.style.display = "";
    dashboardView.style.display = "none";
  }
}

function renderInquiries(inquiries) {
  if (!inquiriesContainer) return;

  if (!inquiries.length) {
    inquiriesContainer.innerHTML = '<div class="site-empty">Заявок пока нет.</div>';
    return;
  }

  inquiriesContainer.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Тип</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Гости</th>
            <th>Жел. дата</th>
            <th>Пространство</th>
            <th>Страница</th>
            <th>Сообщение</th>
          </tr>
        </thead>
        <tbody>
          ${inquiries
            .map(
              (inq) => `
            <tr>
              <td>${escapeHtml(new Date(inq.createdAt).toLocaleDateString("ru-RU"))}</td>
              <td>${escapeHtml(inq.requestType)}</td>
              <td>${escapeHtml(inq.name)}</td>
              <td>${escapeHtml(inq.phone)}</td>
              <td>${escapeHtml(inq.email || "—")}</td>
              <td>${inq.guests != null ? escapeHtml(String(inq.guests)) : "—"}</td>
              <td>${escapeHtml(inq.date || "—")}</td>
              <td>${escapeHtml(inq.space || "—")}</td>
              <td>${escapeHtml(inq.sourcePage || "—")}</td>
              <td class="admin-table-message">${escapeHtml(inq.message || "—")}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function loadInquiries() {
  if (!inquiriesContainer) return;

  inquiriesContainer.innerHTML =
    '<div class="loading-state"><div class="loading-spinner"></div><span>Загрузка...</span></div>';

  try {
    const data = await fetchAdminInquiries();
    renderInquiries(data);
  } catch {
    inquiriesContainer.innerHTML = '<div class="site-empty">Не удалось загрузить заявки.</div>';
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    setStatus("Укажите email и пароль.", "error");
    return;
  }

  setStatus("Входим...", "pending");

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    setStatus(error.message || "Не удалось войти.", "error");
    return;
  }

  setStatus("", "");
  showView("dashboard");
  loadInquiries();
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  showView("login");
  if (loginForm) loginForm.reset();
  if (inquiriesContainer) inquiriesContainer.innerHTML = "";
}

async function initAdmin() {
  initShell("admin");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    loginForm.addEventListener("input", () => setStatus("", ""));
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", loadInquiries);
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session) {
    showView("dashboard");
    loadInquiries();
  } else {
    showView("login");
  }
}

initAdmin();
