import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { RitualSelector } from "@/components/sections/RitualSelector";
import { BookingShowcase } from "@/components/sections/BookingShowcase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function SaunaPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const sauna = content?.sauna;

  return (
    <>
      <PageHero
        eyebrow="Сауна"
        title="Две приватные сауны-купе для спокойного отдыха без лишнего шума."
        lead="У нас нет бассейна. В VANATUR есть две отдельные сауны-купе с приватным форматом, зоной отдыха и бронью только по телефону."
        actions={
          <>
            <Button as="a" href="tel:+37433510510">Позвонить и забронировать</Button>
            <Button as="a" href="/contact" variant="ghost">Открыть контакты</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard variant="emphasis">
              <p className="card-kicker">Важно</p>
              <p className="quote-text">Сауна бронируется только по телефону. Формат полностью приватный.</p>
            </SurfaceCard>
            <SurfaceCard>
              <p className="card-kicker">Формат</p>
              <p className="panel-copy">Две сауны-купе, зона отдыха, душ и спокойная атмосфера без общего потока гостей.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section section-band">
        <div className="container">
          <BookingShowcase
            eyebrow="Фото сауны"
            title="Это фотографии именно сауны VANATUR."
            description="Посмотрите атмосферу двух саун-купе VANATUR и для брони сразу позвоните менеджеру по номеру +374 33 510 510."
            actions={
              <Button as="a" href="tel:+37433510510">Позвонить для брони</Button>
            }
            images={[
              {
                src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/54280955.jpg?k=55794e4e4ec0a29a7f29cd7d4e2d018e6e9bae6dab48211533b99a85341123ea&o=",
                alt: "Сауна-купе VANATUR",
                caption: "Сауна-купе 1",
                subcaption: "Приватный формат с парной и зоной отдыха",
              },
              {
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw5zqcNI5u9dWZX0HCG3vXCKmE0xdw3x-lGA&s",
                alt: "Вторая сауна-купе VANATUR",
                caption: "Сауна-купе 2",
                subcaption: "Отдельное пространство без бассейна и без посторонних",
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Форматы" title="Выберите одну из двух саун-купе и уточните детали по телефону." />
          <RitualSelector rituals={sauna?.rituals ?? []} />
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader eyebrow="Почему VANATUR" title="Сауна сделана как приватный формат отдыха, а не как шумная общая зона." />
          <InfoCardGrid>
            {sauna?.benefits?.map((b) => (
              <InfoCard key={b.title} badge="Преимущество" title={b.title} text={b.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Комбинации" title="После сауны можно продолжить вечер в ресторане или в приватном купе." />
          <InfoCardGrid columns={3}>
            {sauna?.packages?.map((p) => (
              <InfoCard key={p.title} badge="Сценарий" title={p.title} text={p.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
