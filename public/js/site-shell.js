const navigationItems = [
  { key: "home", label: "Главная", href: "/" },
  { key: "restaurant", label: "Ресторан", href: "/restaurant" },
  { key: "menu", label: "Меню", href: "/menu" },
  { key: "events", label: "Мероприятия", href: "/events" },
  { key: "suites", label: "Купе", href: "/suites" },
  { key: "sauna", label: "Сауна", href: "/sauna" },
  { key: "hotel", label: "Отель", href: "/hotel" },
];

let revealObserver;
let backdropEl = null;

function buildHeader(activePage) {
  const navLinks = navigationItems
    .map(
      (item) => `
        <a class="nav-link ${item.key === activePage ? "is-active" : ""}" href="${item.href}">
          ${item.label}
        </a>
      `
    )
    .join("");

  return `
    <div class="container site-header__inner">
      <a class="brand-link" href="/">
        <span class="brand-mark">V</span>
        <span class="brand-meta">
          <strong>VANATUR</strong>
          <span>Restaurant &bull; Events &bull; Coupe &bull; Sauna</span>
        </span>
      </a>

      <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" data-menu-toggle>
        <span></span>
      </button>

      <nav class="site-nav" data-site-nav>
        ${navLinks}
        <a class="button" href="/contact">Связаться</a>
      </nav>
    </div>
  `;
}

function buildFooter(activePage) {
  const footerLinks = navigationItems
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join("");

  const showBookingLink = !["sauna", "suites"].includes(activePage);
  const bookingLine = showBookingLink
    ? '<a href="/booking" target="_blank" rel="noreferrer">Номера на Booking.com</a>'
    : '<span class="footer-note">Купе и сауна: бронь через менеджера</span>';

  return `
    <div class="container">
      <div class="site-footer__inner">
        <div class="footer-top">
          <div class="footer-brand">
            <p class="eyebrow">VANATUR</p>
            <h3>Ресторан, мероприятия, купе и сауна в одном месте.</h3>
            <p>Спокойный сервис, тёплая атмосфера и быстрый контакт с менеджером.</p>
          </div>

          <div class="footer-grid">
            <div class="footer-column">
              <span class="footer-label">Навигация</span>
              <div class="footer-links">${footerLinks}</div>
            </div>

            <div class="footer-column">
              <span class="footer-label">Контакты</span>
              <div class="footer-links">
                <a href="tel:+37433510510">+374 33 510 510</a>
                <a href="mailto:hello@vanatur.am">hello@vanatur.am</a>
                <span class="footer-note">Ванадзор, ул. Тиграна Меца, 17</span>
              </div>
            </div>

            <div class="footer-column">
              <span class="footer-label">Бронирование</span>
              <div class="footer-links">
                ${bookingLine}
                <a href="/hotel">Страница отеля</a>
                <a href="/contact">Оставить заявку</a>
                <span class="footer-note">Ежедневно: 12:00 - 02:00</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span class="footer-note">&copy; <span data-year></span> VANATUR</span>
          <span class="footer-note">Место для красивых вечеров в Ванадзоре</span>
        </div>
      </div>
    </div>
  `;
}

function buildMobileQuickBar(activePage) {
  const isPhoneBookingPage = ["sauna", "suites"].includes(activePage);

  if (isPhoneBookingPage) {
    return `
      <div class="mobile-quickbar__inner">
        <a class="button mobile-quickbar__button" href="tel:+37433510510">Позвонить</a>
        <a class="mobile-quickbar__link" href="/contact">Заявка</a>
      </div>
    `;
  }

  return `
    <div class="mobile-quickbar__inner">
      <a class="button mobile-quickbar__button" href="/booking" target="_blank" rel="noreferrer">Номера</a>
      <a class="mobile-quickbar__link" href="tel:+37433510510">Позвонить</a>
    </div>
  `;
}

function getOrCreateBackdrop() {
  if (backdropEl) return backdropEl;
  backdropEl = document.createElement("div");
  backdropEl.className = "nav-backdrop";
  document.body.append(backdropEl);
  return backdropEl;
}

function bindMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const backdrop = getOrCreateBackdrop();

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    nav.classList.add("is-open");
    backdrop.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  backdrop.addEventListener("click", closeMenu);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initMobileQuickBar(activePage) {
  const existingBar = document.querySelector("[data-mobile-quickbar]");
  if (existingBar) existingBar.remove();

  const quickBar = document.createElement("div");
  quickBar.className = "mobile-quickbar";
  quickBar.dataset.mobileQuickbar = "true";
  quickBar.innerHTML = buildMobileQuickBar(activePage);
  document.body.append(quickBar);
}

export function initShell(activePage) {
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");

  if (header) {
    header.classList.add("site-header");
    header.innerHTML = buildHeader(activePage);
  }

  if (footer) {
    footer.classList.add("site-footer");
    footer.innerHTML = buildFooter(activePage);
    const yearNode = footer.querySelector("[data-year]");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  }

  bindMobileMenu();
  initMobileQuickBar(activePage);
}

export function initReveal() {
  const revealNodes = document.querySelectorAll(".reveal:not([data-reveal-ready])");
  if (!revealNodes.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    revealNodes.forEach((node) => {
      node.dataset.revealReady = "true";
      node.classList.add("is-visible");
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
  }

  revealNodes.forEach((node) => {
    node.dataset.revealReady = "true";
    revealObserver.observe(node);
  });
}
