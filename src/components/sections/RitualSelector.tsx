import { useState } from "react";
import type { SaunaRitual } from "@/types";
import { FeatureList } from "@/components/ui/FeatureList";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";

interface RitualSelectorProps {
  rituals: SaunaRitual[];
  emptyMessage?: string;
}

export function RitualSelector({ rituals, emptyMessage = "Форматы сауны скоро появятся." }: RitualSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!rituals.length) {
    return <EmptyState message={emptyMessage} />;
  }

  const active = rituals[activeIndex];

  return (
    <div className="ritual-layout reveal">
      <div className="ritual-nav">
        {rituals.map((ritual, i) => (
          <button
            key={ritual.title}
            className={`ritual-button${i === activeIndex ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveIndex(i)}
          >
            {ritual.title}
          </button>
        ))}
      </div>

      <div className="surface-card ritual-spotlight">
        <Pill>{`Формат ${activeIndex + 1}`}</Pill>
        <h3>{active.title}</h3>
        <div className="ritual-meta">
          <Pill variant="price">{active.duration}</Pill>
          <Pill variant="price">{active.price}</Pill>
        </div>
        <p className="section-copy">{active.description}</p>
        <div className="ritual-includes">
          <FeatureList items={active.includes} />
        </div>
      </div>
    </div>
  );
}
