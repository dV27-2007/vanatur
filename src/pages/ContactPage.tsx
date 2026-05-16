import { useSiteContent } from "@/hooks/use-site-content";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { InfoCard } from "@/components/sections/InfoCard";
import { SurfaceCard } from "@/components/sections/SurfaceCard";
import { FaqItem } from "@/components/ui/FaqItem";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export function ContactPage() {
  const { content, loading } = useSiteContent();
  useReveal();

  if (loading) return <LoadingSpinner />;

  const contact = content?.contact;

  return (
    <>
      <PageHero
        eyebrow="Контакты и заявки"
        title="Одна точка связи для ресторана, мероприятий, купе и сауны."
        lead="Напишите, что именно вам нужно: ресторан, банкетный зал, купе или комплексный формат. Для сауны лучше сразу позвонить по номеру, потому что она бронируется только по телефону."
        actions={
          <>
            <Button as="a" href="tel:+37433510510">Позвонить сейчас</Button>
            <Button as="a" href="#inquiry-form" variant="ghost">Оставить заявку</Button>
          </>
        }
        panel={
          <>
            <SurfaceCard>
              <p className="card-kicker">Контакт</p>
              <p className="panel-copy">+374 33 510 510</p>
              <p className="panel-copy">hello@vanatur.am</p>
            </SurfaceCard>
            <SurfaceCard variant="dark">
              <p className="card-kicker">Важно</p>
              <p className="quote-text">Сауна бронируется только по телефону +374 33 510 510.</p>
            </SurfaceCard>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Преимущества" title="Почему бронировать через VANATUR удобно даже для сложного запроса." />
          <InfoCardGrid columns={3}>
            {contact?.advantages?.map((a) => (
              <InfoCard key={a.title} badge="Advantage" title={a.title} text={a.text} />
            ))}
          </InfoCardGrid>
        </div>
      </section>

      <section className="section section-band">
        <div className="container split-layout">
          <div>
            <SectionHeader eyebrow="Режим и вопросы" title="Быстрые ответы до отправки заявки." />
            <div className="stack-list">
              {contact?.hours?.map((h) => (
                <article key={h.title} className="stack-card reveal">
                  <h3>{h.title}</h3>
                  <p>{h.value}</p>
                </article>
              ))}
            </div>
            <div className="faq-list">
              {contact?.faq?.map((f) => (
                <FaqItem key={f.question} question={f.question} answer={f.answer} />
              ))}
            </div>
          </div>

          <SurfaceCard className="reveal" id="inquiry-form">
            <p className="eyebrow">Форма запроса</p>
            <h2 className="card-title">Отправьте заявку в VANATUR</h2>
            <InquiryForm sourcePage="contact" />
          </SurfaceCard>
        </div>
      </section>
    </>
  );
}
