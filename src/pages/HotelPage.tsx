import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { BookingShowcase } from "@/components/sections/BookingShowcase";
import { FaqItem } from "@/components/ui/FaqItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function HotelPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const hotel = content?.hotel;

  return (
    <>
      <PageHero
        eyebrow="Отель VANATUR"
        title="Проживание рядом с рестораном, мероприятиями и приватным отдыхом."
        lead="Если вам нужен номер после ужина, мероприятия или спокойного семейного отдыха, проживание VANATUR можно сразу открыть на Booking.com и выбрать удобные даты."
        actions={
          <>
            <Button as="a" href="https://www.booking.com/hotel/am/vanatur.ru.html" target="_blank" rel="noreferrer">
              Открыть Booking
            </Button>
            <Button as="a" href="/contact" variant="ghost">Связаться с менеджером</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard variant="emphasis">
              <p className="card-kicker">Проживание</p>
              <p className="quote-text">Отель VANATUR удобно сочетается с рестораном, большим залом и вечерними форматами отдыха.</p>
            </SurfaceCard>
            <SurfaceCard>
              <p className="card-kicker">Бронирование</p>
              <p className="panel-copy">Номер можно выбрать онлайн через Booking.com или уточнить детали у менеджера.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <BookingShowcase
            eyebrow="Фото отеля"
            title="Посмотрите, как выглядит комплекс VANATUR снаружи и перед переходом к бронированию."
            description="Нажмите на фото или на кнопку, чтобы сразу перейти на страницу отеля и выбрать проживание на Booking.com."
            actions={
              <Button as="a" href="https://www.booking.com/hotel/am/vanatur.ru.html" target="_blank" rel="noreferrer">
                Перейти к броне
              </Button>
            }
            images={[
              {
                src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/206427502.jpg?k=0f1585770a6eca78e4504fb5f0fecbb097091d03188d22f3a27984e43cfcdd41&o=",
                alt: "Отель VANATUR",
                caption: "Отель VANATUR",
                subcaption: "Открыть бронирование на Booking.com",
                href: "https://www.booking.com/hotel/am/vanatur.ru.html",
              },
              {
                src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/54280943.jpg?k=b3afbb93850112af2a2e0ed65e7ac1d41dd04181f247262364e01499240034f6&o=",
                alt: "Территория и фасад VANATUR",
                caption: "Фасад и территория",
                subcaption: "Выбрать даты проживания",
                href: "https://www.booking.com/hotel/am/vanatur.ru.html",
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Почему удобно" title="Проживание, которое естественно продолжает вечер в VANATUR." />
          <InfoCardGrid columns={3}>
            {hotel?.highlights?.map((h) => (
              <InfoCard key={h.title} badge={h.badge} title={h.title} text={h.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section section-band">
        <div className="container split-layout">
          <div>
            <SectionHeader eyebrow="Об отеле" title="Что важно знать до бронирования." />
            <div className="stack-list">
              {hotel?.details?.map((d) => (
                <article key={d.title} className="stack-card reveal">
                  <h3>{d.title}</h3>
                  <p>{d.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Частые вопросы" title="Коротко о проживании и бронировании." />
            <div className="faq-list">
              {hotel?.faq?.map((f) => (
                <FaqItem key={f.question} question={f.question} answer={f.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
