import { useLocation } from "react-router-dom";

export function MobileQuickBar() {
  const location = useLocation();
  const isPhoneBooking = ["/sauna", "/suites"].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="mobile-quickbar" data-mobile-quickbar="true">
      <div className="mobile-quickbar__inner">
        {isPhoneBooking ? (
          <>
            <a className="button mobile-quickbar__button" href="tel:+37433510510">
              Позвонить
            </a>
            <a className="mobile-quickbar__link" href="/contact">
              Заявка
            </a>
          </>
        ) : (
          <>
            <a
              className="button mobile-quickbar__button"
              href="https://www.booking.com/hotel/am/vanatur.ru.html"
              target="_blank"
              rel="noreferrer"
            >
              Номера
            </a>
            <a className="mobile-quickbar__link" href="tel:+37433510510">
              Позвонить
            </a>
          </>
        )}
      </div>
    </div>
  );
}
