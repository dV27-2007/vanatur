import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { MenuTabs } from "@/components/sections/MenuTabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function RestaurantPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const restaurant = content?.restaurant;

  return (
    <>
      <PageHero
        eyebrow="Ресторан"
        title="Кухня и атмосфера, ради которых хочется задержаться дольше обычного."
        lead="VANATUR создаёт не просто подачу блюд, а красивый темп вечера: правильный свет, глубокие вкусы, приватные зоны и сервис без суеты."
        actions={
          <>
            <Button as="a" href="/contact">Забронировать стол</Button>
            <Button as="a" href="/suites" variant="ghost">Посмотреть купе</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard>
              <p className="card-kicker">Вечерний ритм</p>
              <p className="panel-copy">Для деловых встреч, семейных ужинов и долгих разговоров, которые не хочется прерывать.</p>
            </SurfaceCard>
            <SurfaceCard variant="dark">
              <p className="card-kicker">Лучшее сочетание</p>
              <p className="quote-text">Ужин в ресторане + приватное купе или сауна после него.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Меню"
            title="Фирменные направления кухни VANATUR."
            description="Меню построено вокруг насыщенных вкусов, красивой подачи и блюд, которые подходят и для романтического ужина, и для важного стола с гостями."
          />
          <MenuTabs categories={restaurant?.menuCategories ?? []} />
          <div className="hero-actions reveal">
            <Button as="a" href="/menu" variant="ghost">Открыть отдельный раздел меню</Button>
          </div>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader eyebrow="Зоны" title="Разные настроения внутри одного ресторана." />
          <InfoCardGrid>
            {restaurant?.zones?.map((zone) => (
              <InfoCard key={zone.title} meta={zone.meta} title={zone.title} text={zone.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Сопровождение" title="Вино, коктейли и чайные сеты под любой темп вечера." />
          <InfoCardGrid columns={3}>
            {restaurant?.pairings?.map((p) => (
              <InfoCard key={p.title} badge="Сопровождение" title={p.title} text={p.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
