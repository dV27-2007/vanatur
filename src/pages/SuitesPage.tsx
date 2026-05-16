import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { SuiteFilter } from "@/components/sections/SuiteFilter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function SuitesPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const suites = content?.suites;

  return (
    <>
      <PageHero
        eyebrow="Купе"
        title="Приватные места, где можно спокойно сидеть, ужинать и проводить вечер своей компанией."
        lead="В VANATUR купе это не номера и не проживание. Это отдельные приватные места для ужина, встречи, семейного вечера или небольшого праздника в более закрытом формате."
        actions={
          <>
            <Button as="a" href="/contact">Выбрать купе</Button>
            <Button as="a" href="tel:+37433510510" variant="ghost">Позвонить</Button>
            <Button as="a" href="/restaurant" variant="ghost">К ресторану</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard>
              <p className="card-kicker">Формат</p>
              <p className="panel-copy">Приватная посадка, спокойная атмосфера, подача из ресторана и удобный формат для пары, семьи или небольшой компании.</p>
            </SurfaceCard>
            <SurfaceCard variant="dark">
              <p className="card-kicker">Лучшее сочетание</p>
              <p className="quote-text">Купе + ужин + сауна = спокойный приватный вечер без суеты.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section section-band">
        <div className="container">
          <SectionHeader
            eyebrow="Как это работает"
            title="Купе в VANATUR созданы для ужина и общения в более приватной атмосфере."
            description="Это отдельные места, где люди сидят, едят и проводят время своей компанией. Здесь не нужна ссылка на Booking, потому что речь не о проживании."
          />
          <InfoCardGrid columns={3}>
            <InfoCard badge="Для кого" title="Пара, семья или друзья" text="Есть форматы для тихого ужина на двоих, семейного вечера и небольшой компании." />
            <InfoCard badge="Сервис" title="Подача из ресторана" text="В купе можно заказать блюда, напитки, десерты и спокойно провести вечер отдельно от общего зала." />
            <InfoCard badge="Бронь" title="Быстрое подтверждение" text="Купе можно выбрать через форму, по телефону или при бронировании стола у менеджера VANATUR." />
          </InfoCardGrid>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Подбор"
            title="Выберите формат купе, который подходит именно вашему сценарию."
            description="Можно быстро отфильтровать варианты для пары, семьи, приватного ужина или небольшой компании."
          />
          <SuiteFilter suites={suites?.suites ?? []} />
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <SectionHeader eyebrow="Сервисы" title="Дополнения, которые делают вечер цельным." />
          <InfoCardGrid columns={3}>
            {suites?.services?.map((s) => (
              <InfoCard key={s.title} badge="Сервис" title={s.title} text={s.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Сценарии вечера" title="Купе подходят и для спокойного ужина, и для более закрытого формата после события." />
          <InfoCardGrid columns={3}>
            {suites?.experiences?.map((e) => (
              <InfoCard key={e.title} badge="Формат" title={e.title} text={e.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>
    </>
  );
}
