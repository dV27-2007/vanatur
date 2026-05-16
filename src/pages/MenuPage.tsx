import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { MenuCategoryGrid } from "@/components/sections/MenuCategoryGrid";
import { MenuNotes } from "@/components/sections/MenuNotes";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function MenuPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const menu = content?.menu;
  const restaurant = content?.restaurant;

  return (
    <>
      <PageHero
        eyebrow="Меню VANATUR"
        title="Отдельный раздел, где можно спокойно выбрать блюда до бронирования."
        lead="Здесь собраны фирменные позиции кухни VANATUR, подборки для красивого ужина и сопровождение, которое делает вечер завершённым."
        actions={
          <>
            <Button as="a" href="/contact">Забронировать стол</Button>
            <Button as="a" href="/restaurant" variant="ghost">Перейти в ресторан</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard variant="emphasis">
              <p className="card-kicker">Акцент меню</p>
              <p className="quote-text">Фирменные блюда, сеты для двоих и позиции, которые особенно хорошо подходят для купе.</p>
            </SurfaceCard>
            <SurfaceCard>
              <p className="card-kicker">Подходит для</p>
              <p className="panel-copy">Романтического ужина, семейного вечера, мероприятия или приватного купе.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Рекомендуем" title="Позиции и форматы, с которых гости чаще всего начинают знакомство с кухней." />
          <InfoCardGrid columns={3}>
            <MenuHighlights highlights={menu?.highlights ?? []} />
          </InfoCardGrid>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader eyebrow="Полное меню" title="Все основные направления кухни в одном месте." />
          <MenuCategoryGrid categories={restaurant?.menuCategories ?? []} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Сопровождение" title="Напитки, сеты и сервисные детали для правильного ритма вечера." />
          <InfoCardGrid columns={3}>
            {restaurant?.pairings?.map((p) => (
              <article key={p.title} className="info-card reveal">
                <span className="pill">Сопровождение</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </InfoCardGrid>
          <InfoCardGrid columns={3} className="menu-notes-grid">
            <MenuNotes notes={menu?.notes ?? []} />
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
