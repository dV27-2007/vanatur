import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { key: "home", label: "Главная", href: "/" },
  { key: "restaurant", label: "Ресторан", href: "/restaurant" },
  { key: "menu", label: "Меню", href: "/menu" },
  { key: "events", label: "Мероприятия", href: "/events" },
  { key: "suites", label: "Купе", href: "/suites" },
  { key: "sauna", label: "Сауна", href: "/sauna" },
  { key: "hotel", label: "Отель", href: "/hotel" },
];

function getActiveKey(pathname: string): string {
  if (pathname === "/") return "home";
  const segment = pathname.split("/")[1];
  return NAV_ITEMS.find((n) => n.href === `/${segment}`)?.key ?? "";
}

export function Header() {
  const location = useLocation();
  const activeKey = getActiveKey(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand-link" to="/">
          <span className="brand-mark">V</span>
          <span className="brand-meta">
            <strong>VANATUR</strong>
            <span>Restaurant &middot; Events &middot; Coupe &middot; Sauna</span>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          Меню
        </button>

        <nav className={`site-nav${menuOpen ? " is-open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={`nav-link${item.key === activeKey ? " is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button" to="/contact" onClick={() => setMenuOpen(false)}>
            Связаться
          </Link>
        </nav>
      </div>
    </header>
  );
}
