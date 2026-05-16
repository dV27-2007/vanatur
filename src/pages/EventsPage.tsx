import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { FeatureList } from "@/components/ui/FeatureList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";

export function EventsPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const events = content?.events;

  return (
    <>
      <PageHero
        eyebrow="Мероприятия"
        title="Большое событие без организационного хаоса и с ощущением премиального комфорта."
        lead="Свадьбы, юбилеи, корпоративные вечера и закрытые ужины — VANATUR соединяет зал, кухню, приватные зоны, купе и сауну в один продуманный сценарий."
        actions={
          <>
            <Button as="a" href="/contact">Запросить дату</Button>
            <Button as="a" href="/suites" variant="ghost">Купе для гостей</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard variant="emphasis">
              <p className="card-kicker">Event concept</p>
              <p className="quote-text">От первого брифа до позднего ужина, приватных зон и спокойного финала вечера.</p>
            </SurfaceCard>
            <SurfaceCard>
              <p className="card-kicker">Подходит для</p>
              <p className="panel-copy">Больших свадеб, камерных юбилеев, деловых ужинов и частных событий.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Форматы" title="Собираем событие под ваш масштаб и настроение." />
          <InfoCardGrid>
            {events?.formats?.map((f) => (
              <InfoCard key={f.title} badge="Формат" title={f.title} text={f.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader eyebrow="Площадки" title="Несколько пространств для разных типов гостей и тайминга." />
          <InfoCardGrid>
            {events?.spaces?.map((space) => (
              <article key={space.title} className="info-card reveal">
                <Pill variant="price">{space.capacity}</Pill>
                <h3>{space.title}</h3>
                <p>{space.description}</p>
                <FeatureList items={space.features} />
              </article>
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Процесс" title="Чёткая логика работы, чтобы вы не тонули в деталях." />
          <div className="timeline-grid">
            {events?.steps?.map((step) => (
              <article key={step.title} className="timeline-card reveal">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Пакеты" title="Базовые форматы, от которых удобно отталкиваться." />
          <InfoCardGrid columns={3}>
            {events?.packages?.map((pkg) => (
              <article key={pkg.title} className="info-card reveal">
                <Pill variant="price">{pkg.price}</Pill>
                <h3>{pkg.title}</h3>
                <p>{pkg.text}</p>
              </article>
            ))}
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
