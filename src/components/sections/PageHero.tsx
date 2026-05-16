import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
  panel?: ReactNode;
  className?: string;
}

export function PageHero({ eyebrow, title, lead, actions, panel, className }: PageHeroProps) {
  return (
    <section className={`page-hero${className ? ` ${className}` : ""}`}>
      <div className="container hero-layout">
        <div className="hero-copy reveal">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {actions && <div className="hero-actions">{actions}</div>}
        </div>

        {panel && <div className="hero-panel reveal">{panel}</div>}
      </div>
    </section>
  );
}
