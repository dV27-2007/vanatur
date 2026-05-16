import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { BookingShowcase } from "@/components/sections/BookingShowcase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function HomePage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const home = content?.home;
  const menu = content?.menu;

  return (
    <>
      <PageHero
        eyebrow="VANATUR"
        title="Пространство, где красивый ужин, отдых и важное событие звучат как одно впечатление."
        lead="Ресторан с атмосферой, большой зал для мероприятий, приватные купе и сауна — всё в одном месте, собранном для красивого отдыха и настоящего комфорта."
        className="hero-home"
        actions={
          <>
            <Button as="a" href="https://www.booking.com/hotel/am/vanatur.ru.html" target="_blank" rel="noreferrer">
              Проживание на Booking
            </Button>
            <Button as="a" href="/hotel" variant="ghost">
              Отель и номера
            </Button>
            <Button as="a" href="/events" variant="ghost">
              Посмотреть площадки
            </Button>
          </>
        }
        panel={
          <>
            <SurfaceCard variant="emphasis">
              <p className="card-kicker">Signature mood</p>
              <p className="quote-text">Ресторан для вечера. Большой зал для событий. Приватный отдых после них.</p>
            </SurfaceCard>
            <div className="metric-grid">
              {home?.stats?.map((stat) => (
                <article key={stat.label} className="metric-card reveal">
                  <span className="metric-value">{stat.value}</span>
                  <span className="metric-label">{stat.label}</span>
                </article>
              ))}
            </div>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <BookingShowcase
            eyebrow="Проживание"
            title="Если нужен номер, можно сразу перейти к проживанию VANATUR на Booking.com."
            description="Нажмите на фото комплекса или на кнопку ниже, чтобы открыть официальную страницу проживания и выбрать даты."
            actions={
              <Button as="a" href="https://www.booking.com/hotel/am/vanatur.ru.html" target="_blank" rel="noreferrer">
                Открыть Booking.com
              </Button>
            }
            images={[
              {
                src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/206427502.jpg?k=0f1585770a6eca78e4504fb5f0fecbb097091d03188d22f3a27984e43cfcdd41&o=",
                alt: "Внешний вид здания VANATUR",
                caption: "VANATUR Exterior",
                subcaption: "Нажмите, чтобы открыть Booking.com",
                href: "https://www.booking.com/hotel/am/vanatur.ru.html",
              },
              {
                src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/54280943.jpg?k=b3afbb93850112af2a2e0ed65e7ac1d41dd04181f247262364e01499240034f6&o=",
                alt: "Фасад и территория VANATUR",
                caption: "Фасад и территория",
                subcaption: "Проживание и бронирование номеров",
                href: "https://www.booking.com/hotel/am/vanatur.ru.html",
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Что есть в VANATUR"
            title="Один адрес для ужина, события, отдыха и приватного восстановления."
          />
          <InfoCardGrid>
            {home?.experiences?.map((item) => (
              <InfoCard
                key={item.title}
                badge={item.badge}
                title={item.title}
                text={item.text}
                link={item.link}
                linkLabel={item.linkLabel}
              />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader
            eyebrow="Меню"
            title="Популярные позиции, которые сразу задают тон вечеру."
            description="Если хочешь быстро понять характер кухни VANATUR, начни с этих позиций и потом открой полное меню."
          />
          <InfoCardGrid columns={3}>
            <MenuHighlights highlights={menu?.highlights ?? []} />
          </InfoCardGrid>
          <div className="hero-actions reveal">
            <Button as="a" href="/menu">Открыть всё меню</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Сценарии"
            title="Место, которое легко подстраивается под разные ритмы жизни."
          />
          <InfoCardGrid columns={3}>
            {home?.moments?.map((item) => (
              <InfoCard key={item.title} title={item.title} text={item.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
