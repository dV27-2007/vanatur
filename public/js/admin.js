import { supabaseClient, fetchAdminInquiries, fetchSiteContent } from "./api.js";
import { initShell } from "./site-shell.js";
import { escapeHtml } from "./ui.js";

/* ============================================
   DOM references
   ============================================ */
const loginView = document.querySelector("[data-admin-login-view]");
const dashboardView = document.querySelector("[data-admin-dashboard-view]");
const loginForm = document.querySelector("[data-admin-login-form]");
const statusNode = document.querySelector("[data-admin-status]");
const inquiriesContainer = document.querySelector("[data-admin-inquiries]");
const logoutButton = document.querySelector("[data-admin-logout]");
const refreshButton = document.querySelector("[data-admin-refresh]");
const contentEditor = document.querySelector("[data-content-editor]");
const menuEditor = document.querySelector("[data-menu-editor]");
const imagesEditor = document.querySelector("[data-images-editor]");

let siteContent = null;

/* ============================================
   View switching
   ============================================ */
function showView(view) {
  if (view === "dashboard") {
    loginView.style.display = "none";
    dashboardView.style.display = "";
  } else {
    loginView.style.display = "";
    dashboardView.style.display = "none";
  }
}

function setStatus(message, state = "") {
  if (!statusNode) return;
  statusNode.textContent = message;
  if (state) statusNode.dataset.state = state;
  else delete statusNode.dataset.state;
}

/* ============================================
   Tab switching
   ============================================ */
function initTabs() {
  const tabContainer = document.querySelector("[data-admin-tabs]");
  if (!tabContainer) return;

  tabContainer.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (!tab) return;

    tabContainer.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");

    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("is-active"));
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) panel.classList.add("is-active");
  });
}

/* ============================================
   Inquiries
   ============================================ */
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
            <th>Дата</th><th>Тип</th><th>Имя</th><th>Телефон</th><th>Email</th>
            <th>Гости</th><th>Жел. дата</th><th>Пространство</th><th>Страница</th><th>Сообщение</th>
          </tr>
        </thead>
        <tbody>
          ${inquiries.map((inq) => `
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
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function loadInquiries() {
  if (!inquiriesContainer) return;
  inquiriesContainer.innerHTML = '<div class="site-empty">Загрузка...</div>';
  try {
    const data = await fetchAdminInquiries();
    renderInquiries(data);
  } catch {
    inquiriesContainer.innerHTML = '<div class="site-empty">Не удалось загрузить заявки.</div>';
  }
}

/* ============================================
   Content editor
   ============================================ */
function renderContentEditor(content) {
  if (!contentEditor) return;

  const sections = [
    { key: "brand", label: "Бренд", fields: ["name", "tagline", "phone", "email", "address", "hours"] },
    { key: "home", label: "Главная", fields: null },
    { key: "restaurant", label: "Ресторан", fields: ["story"] },
    { key: "hotel", label: "Отель", fields: null },
    { key: "sauna", label: "Сауна", fields: null },
    { key: "events", label: "Мероприятия", fields: null },
    { key: "suites", label: "Купе", fields: null },
    { key: "contact", label: "Контакты", fields: null },
  ];

  let html = '<h2>Редактирование текстов</h2><p class="section-copy" style="margin-bottom:1.5rem">Измените тексты сайта и нажмите "Сохранить".</p>';

  sections.forEach((sec) => {
    const data = content[sec.key] || {};
    html += `<div class="admin-editor-section"><h3>${escapeHtml(sec.label)}</h3>`;

    if (sec.fields) {
      sec.fields.forEach((field) => {
        const val = data[field] || "";
        html += `
          <div class="admin-field-group">
            <label class="admin-field-label">${escapeHtml(field)}</label>
            <input class="admin-field-input" data-content-path="${sec.key}.${field}" value="${escapeHtml(String(val))}" />
          </div>
        `;
      });
    } else {
      const jsonStr = JSON.stringify(data, null, 2);
      html += `
        <div class="admin-field-group">
          <label class="admin-field-label">JSON данные</label>
          <textarea class="admin-field-input admin-field-textarea" data-content-path="${sec.key}" rows="8">${escapeHtml(jsonStr)}</textarea>
        </div>
      `;
    }

    html += "</div>";
  });

  html += `
    <div class="admin-save-bar">
      <button class="button" type="button" data-save-content>Сохранить все тексты</button>
      <span class="form-status" data-content-save-status></span>
    </div>
  `;

  contentEditor.innerHTML = html;
}

async function saveContent() {
  const statusEl = document.querySelector("[data-content-save-status]");
  if (statusEl) statusEl.textContent = "Сохранение...";

  const inputs = contentEditor.querySelectorAll("[data-content-path]");
  const updated = { ...siteContent };

  inputs.forEach((input) => {
    const path = input.dataset.contentPath;
    const parts = path.split(".");
    let val = input.value;

    if (parts.length === 2) {
      if (!updated[parts[0]]) updated[parts[0]] = {};
      try {
        updated[parts[0]][parts[1]] = val;
      } catch { /* skip */ }
    } else if (parts.length === 1) {
      try {
        updated[parts[0]] = JSON.parse(val);
      } catch {
        if (statusEl) { statusEl.textContent = `Ошибка JSON в секции "${parts[0]}"`; statusEl.dataset.state = "error"; }
        return;
      }
    }
  });

  const { error } = await supabaseClient
    .from("site_content")
    .update({ payload: updated })
    .eq("content_key", "main");

  if (error) {
    if (statusEl) { statusEl.textContent = "Ошибка сохранения."; statusEl.dataset.state = "error"; }
  } else {
    siteContent = updated;
    if (statusEl) { statusEl.textContent = "Сохранено."; statusEl.dataset.state = "success"; }
  }
}

/* ============================================
   Menu editor
   ============================================ */
function renderMenuEditor(content) {
  if (!menuEditor) return;

  const categories = content?.restaurant?.menuCategories || [];

  let html = `
    <h2>Управление меню</h2>
    <p class="section-copy" style="margin-bottom:1.5rem">Добавляйте, редактируйте и удаляйте категории и блюда.</p>
  `;

  categories.forEach((cat, catIdx) => {
    html += `
      <div class="admin-menu-category" data-cat-index="${catIdx}">
        <div class="admin-menu-item-header">
          <h4>${escapeHtml(cat.name)}</h4>
          <div style="display:flex;gap:0.4rem">
            <button class="admin-btn-icon danger" type="button" data-delete-cat="${catIdx}" title="Удалить категорию">&times;</button>
          </div>
        </div>
        <div class="admin-field-group">
          <label class="admin-field-label">Название категории</label>
          <input class="admin-field-input" data-cat-name="${catIdx}" value="${escapeHtml(cat.name)}" />
        </div>
        <div class="admin-field-group">
          <label class="admin-field-label">Описание</label>
          <input class="admin-field-input" data-cat-desc="${catIdx}" value="${escapeHtml(cat.description || "")}" />
        </div>
    `;

    (cat.items || []).forEach((item, itemIdx) => {
      html += `
        <div class="admin-menu-item">
          <div class="admin-menu-item-header">
            <h4>${escapeHtml(item.name)}</h4>
            <button class="admin-btn-icon danger" type="button" data-delete-item="${catIdx}.${itemIdx}" title="Удалить блюдо">&times;</button>
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">Название</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.name" value="${escapeHtml(item.name)}" />
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">Цена</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.price" value="${escapeHtml(item.price)}" />
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">Описание</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.description" value="${escapeHtml(item.description || "")}" />
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">Порция</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.portion" value="${escapeHtml(item.portion || "")}" />
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">Ингредиенты (через запятую)</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.ingredients" value="${escapeHtml((item.ingredients || []).join(", "))}" />
          </div>
          <div class="admin-field-group">
            <label class="admin-field-label">URL изображения</label>
            <input class="admin-field-input" data-item-field="${catIdx}.${itemIdx}.image" value="${escapeHtml(item.image || "")}" />
          </div>
          ${item.image ? `<img class="admin-image-preview" src="${escapeHtml(item.image)}" alt="" />` : ""}
        </div>
      `;
    });

    html += `
        <button class="admin-add-btn" type="button" data-add-item="${catIdx}">+ Добавить блюдо</button>
      </div>
    `;
  });

  html += `
    <button class="admin-add-btn" type="button" data-add-cat>+ Добавить категорию</button>
    <div class="admin-save-bar">
      <button class="button" type="button" data-save-menu>Сохранить меню</button>
      <span class="form-status" data-menu-save-status></span>
    </div>
  `;

  menuEditor.innerHTML = html;
}

function collectMenuData() {
  const categories = [];
  const catEls = menuEditor.querySelectorAll("[data-cat-index]");

  catEls.forEach((catEl) => {
    const catIdx = catEl.dataset.catIndex;
    const nameInput = catEl.querySelector(`[data-cat-name="${catIdx}"]`);
    const descInput = catEl.querySelector(`[data-cat-desc="${catIdx}"]`);

    const items = [];
    catEl.querySelectorAll(".admin-menu-item").forEach((itemEl) => {
      const itemData = {};
      itemEl.querySelectorAll("[data-item-field]").forEach((input) => {
        const field = input.dataset.itemField;
        const parts = field.split(".");
        const fieldName = parts[2];
        if (fieldName === "ingredients") {
          itemData[fieldName] = input.value.split(",").map((s) => s.trim()).filter(Boolean);
        } else {
          itemData[fieldName] = input.value;
        }
      });
      if (itemData.name) items.push(itemData);
    });

    categories.push({
      name: nameInput ? nameInput.value : "",
      description: descInput ? descInput.value : "",
      items,
    });
  });

  return categories;
}

async function saveMenu() {
  const statusEl = document.querySelector("[data-menu-save-status]");
  if (statusEl) statusEl.textContent = "Сохранение...";

  const categories = collectMenuData();
  if (!siteContent.restaurant) siteContent.restaurant = {};
  siteContent.restaurant.menuCategories = categories;

  const { error } = await supabaseClient
    .from("site_content")
    .update({ payload: siteContent })
    .eq("content_key", "main");

  if (error) {
    if (statusEl) { statusEl.textContent = "Ошибка сохранения."; statusEl.dataset.state = "error"; }
  } else {
    if (statusEl) { statusEl.textContent = "Сохранено."; statusEl.dataset.state = "success"; }
    renderMenuEditor(siteContent);
  }
}

function handleMenuActions(e) {
  const target = e.target;

  // Delete category
  const delCat = target.closest("[data-delete-cat]");
  if (delCat) {
    const idx = Number(delCat.dataset.deleteCat);
    if (siteContent?.restaurant?.menuCategories) {
      siteContent.restaurant.menuCategories.splice(idx, 1);
      renderMenuEditor(siteContent);
    }
    return;
  }

  // Delete item
  const delItem = target.closest("[data-delete-item]");
  if (delItem) {
    const [catIdx, itemIdx] = delItem.dataset.deleteItem.split(".").map(Number);
    if (siteContent?.restaurant?.menuCategories?.[catIdx]?.items) {
      siteContent.restaurant.menuCategories[catIdx].items.splice(itemIdx, 1);
      renderMenuEditor(siteContent);
    }
    return;
  }

  // Add item
  const addItem = target.closest("[data-add-item]");
  if (addItem) {
    const catIdx = Number(addItem.dataset.addItem);
    if (siteContent?.restaurant?.menuCategories?.[catIdx]) {
      siteContent.restaurant.menuCategories[catIdx].items.push({
        name: "Новое блюдо",
        price: "0 AMD",
        description: "",
        portion: "",
        ingredients: [],
        image: "",
      });
      renderMenuEditor(siteContent);
    }
    return;
  }

  // Add category
  const addCat = target.closest("[data-add-cat]");
  if (addCat) {
    if (!siteContent.restaurant) siteContent.restaurant = {};
    if (!siteContent.restaurant.menuCategories) siteContent.restaurant.menuCategories = [];
    siteContent.restaurant.menuCategories.push({
      name: "Новая категория",
      description: "",
      items: [],
    });
    renderMenuEditor(siteContent);
    return;
  }

  // Save menu
  const saveBtn = target.closest("[data-save-menu]");
  if (saveBtn) {
    // First sync input values into siteContent
    const categories = collectMenuData();
    if (!siteContent.restaurant) siteContent.restaurant = {};
    siteContent.restaurant.menuCategories = categories;
    saveMenu();
    return;
  }
}

/* ============================================
   Images editor
   ============================================ */
async function renderImagesEditor() {
  if (!imagesEditor) return;

  const { data: uploads } = await supabaseClient
    .from("admin_uploads")
    .select("*")
    .order("created_at", { ascending: false });

  let html = `
    <h2>Изображения</h2>
    <p class="section-copy" style="margin-bottom:1rem">Загрузите изображения для использования в меню и на страницах сайта.</p>
    <div class="admin-field-group">
      <label class="admin-field-label">Загрузить изображение</label>
      <input type="file" class="admin-file-input" accept="image/*" data-image-upload />
    </div>
    <div class="admin-field-group">
      <label class="admin-field-label">Контекст (необязательно)</label>
      <input class="admin-field-input" data-image-context placeholder="menu, hero, sauna..." />
    </div>
    <button class="button" type="button" data-upload-image style="margin-bottom:1.5rem">Загрузить</button>
    <span class="form-status" data-upload-status></span>
  `;

  if (uploads && uploads.length) {
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem">';
    uploads.forEach((upload) => {
      html += `
        <div class="surface-card" style="padding:0.5rem;display:grid;gap:0.4rem">
          <img src="${escapeHtml(upload.url)}" alt="${escapeHtml(upload.alt)}" style="width:100%;height:120px;object-fit:cover;border-radius:var(--radius-sm)" />
          <input class="admin-field-input" value="${escapeHtml(upload.url)}" readonly style="font-size:0.75rem" onclick="this.select()" />
          <button class="admin-btn-icon danger" type="button" data-delete-upload="${upload.id}" title="Удалить" style="width:100%">&times; Удалить</button>
        </div>
      `;
    });
    html += "</div>";
  } else {
    html += '<div class="site-empty">Нет загруженных изображений.</div>';
  }

  imagesEditor.innerHTML = html;
}

async function uploadImage() {
  const fileInput = document.querySelector("[data-image-upload]");
  const contextInput = document.querySelector("[data-image-context]");
  const statusEl = document.querySelector("[data-upload-status]");

  if (!fileInput || !fileInput.files.length) {
    if (statusEl) { statusEl.textContent = "Выберите файл."; statusEl.dataset.state = "error"; }
    return;
  }

  if (statusEl) { statusEl.textContent = "Загрузка..."; statusEl.dataset.state = "pending"; }

  const file = fileInput.files[0];
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const context = contextInput ? contextInput.value.trim() : "";

  const { error: uploadError } = await supabaseClient.storage
    .from("uploads")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    if (statusEl) { statusEl.textContent = "Ошибка загрузки файла."; statusEl.dataset.state = "error"; }
    return;
  }

  const { data: urlData } = supabaseClient.storage.from("uploads").getPublicUrl(fileName);
  const url = urlData.publicUrl;

  await supabaseClient.from("admin_uploads").insert({
    url,
    alt: "",
    context,
  });

  if (statusEl) { statusEl.textContent = "Загружено!"; statusEl.dataset.state = "success"; }
  fileInput.value = "";
  renderImagesEditor();
}

async function deleteUpload(id) {
  await supabaseClient.from("admin_uploads").delete().eq("id", id);
  renderImagesEditor();
}

/* ============================================
   Auth
   ============================================ */
async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) { setStatus("Укажите email и пароль.", "error"); return; }

  setStatus("Входим...", "pending");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) { setStatus(error.message || "Не удалось войти.", "error"); return; }

  setStatus("", "");
  showView("dashboard");
  initDashboard();
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  showView("login");
  if (loginForm) loginForm.reset();
  if (inquiriesContainer) inquiriesContainer.innerHTML = "";
}

/* ============================================
   Dashboard init
   ============================================ */
async function initDashboard() {
  loadInquiries();

  try {
    siteContent = await fetchSiteContent();
  } catch {
    siteContent = {};
  }

  renderContentEditor(siteContent);
  renderMenuEditor(siteContent);
  renderImagesEditor();
}

/* ============================================
   Event delegation
   ============================================ */
function initEvents() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    loginForm.addEventListener("input", () => setStatus("", ""));
  }

  if (logoutButton) logoutButton.addEventListener("click", handleLogout);
  if (refreshButton) refreshButton.addEventListener("click", loadInquiries);

  // Content save
  document.addEventListener("click", (e) => {
    const saveContentBtn = e.target.closest("[data-save-content]");
    if (saveContentBtn) { saveContent(); return; }
  });

  // Menu actions (delegated)
  if (menuEditor) menuEditor.addEventListener("click", handleMenuActions);

  // Image actions
  document.addEventListener("click", (e) => {
    const uploadBtn = e.target.closest("[data-upload-image]");
    if (uploadBtn) { uploadImage(); return; }

    const delBtn = e.target.closest("[data-delete-upload]");
    if (delBtn) { deleteUpload(delBtn.dataset.deleteUpload); return; }
  });
}

/* ============================================
   Init
   ============================================ */
async function initAdmin() {
  initShell("admin");
  initTabs();
  initEvents();

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    showView("dashboard");
    initDashboard();
  } else {
    showView("login");
  }
}

initAdmin();
