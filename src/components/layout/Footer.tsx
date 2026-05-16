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

export function Footer() {
  const location = useLocation();
  const isPhoneBooking = ["sauna", "suites"].some((p) =>
    location.pathname.startsWith(`/${p}`)
  );

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__inner">
          <div className="footer-top">
            <div className="footer-brand">
              <p className="eyebrow">VANATUR</p>
              <h3>Ресторан, мероприятия, купе и сауна в одном месте.</h3>
              <p>Спокойный сервис, тёплая атмосфера и быстрый контакт с менеджером.</p>
            </div>

            <div className="footer-grid">
              <div className="footer-column">
                <span className="footer-label">Навигация</span>
                <div className="footer-links">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.key} to={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="footer-column">
                <span className="footer-label">Контакты</span>
                <div className="footer-links">
                  <a href="tel:+37433510510">+374 33 510 510</a>
                  <a href="mailto:hello@vanatur.am">hello@vanatur.am</a>
                  <span className="footer-note">Ванадзор, ул. Тиграна Меца, 17</span>
                </div>
              </div>

              <div className="footer-column">
                <span className="footer-label">Бронирование</span>
                <div className="footer-links">
                  {isPhoneBooking ? (
                    <span className="footer-note">Купе и сауна: бронь через менеджера</span>
                  ) : (
                    <a
                      href="https://www.booking.com/hotel/am/vanatur.ru.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Номера на Booking.com
                    </a>
                  )}
                  <Link to="/hotel">Страница отеля</Link>
                  <Link to="/contact">Оставить заявку</Link>
                  <span className="footer-note">Ежедневно: 12:00 - 02:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-note">&copy; {new Date().getFullYear()} VANATUR</span>
            <span className="footer-note">Место для красивых вечеров в Ванадзоре</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
