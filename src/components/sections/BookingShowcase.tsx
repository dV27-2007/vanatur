import type { ReactNode } from "react";

interface BookingShowcaseProps {
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
    subcaption: string;
    href?: string;
  }>;
}

export function BookingShowcase({
  eyebrow,
  title,
  description,
  actions,
  images,
}: BookingShowcaseProps) {
  return (
    <div className="booking-showcase reveal">
      <div className="booking-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="section-copy">{description}</p>
        <div className="hero-actions">{actions}</div>
      </div>

      <div className="booking-gallery">
        {images.map((img, i) => {
          const inner = (
            <>
              <img
                className="booking-image-media"
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width="1024"
                height="768"
              />
              <span className="booking-image-caption">
                <strong>{img.caption}</strong>
                <span>{img.subcaption}</span>
              </span>
            </>
          );

          if (img.href) {
            return (
              <a key={i} className="booking-image-card" href={img.href} target="_blank" rel="noreferrer">
                {inner}
              </a>
            );
          }

          return (
            <article key={i} className="booking-image-card">
              {inner}
            </article>
          );
        })}
      </div>
    </div>
  );
}
