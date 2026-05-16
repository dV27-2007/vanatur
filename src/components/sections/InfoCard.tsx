import type { ReactNode } from "react";

interface InfoCardProps {
  badge?: string;
  title: string;
  text: string;
  link?: string;
  linkLabel?: string;
  meta?: string;
  children?: ReactNode;
}

export function InfoCard({ badge, title, text, link, linkLabel, meta, children }: InfoCardProps) {
  return (
    <article className="info-card reveal">
      {badge && <span className="pill">{badge}</span>}
      {meta && <span className="price-pill">{meta}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
      {link && (
        <a className="inline-link" href={link}>
          {linkLabel}
        </a>
      )}
      {children}
    </article>
  );
}
