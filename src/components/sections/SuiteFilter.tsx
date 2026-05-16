import { useState } from "react";
import type { Suite } from "@/types";
import { FeatureList } from "@/components/ui/FeatureList";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";

interface SuiteFilterProps {
  suites: Suite[];
  emptyMessage?: string;
}

export function SuiteFilter({ suites, emptyMessage = "Купе временно недоступны." }: SuiteFilterProps) {
  const filters = ["Все", ...new Set(suites.flatMap((s) => s.audiences ?? []))];
  const [activeFilter, setActiveFilter] = useState("Все");

  if (!suites.length) {
    return <EmptyState message={emptyMessage} />;
  }

  const filtered =
    activeFilter === "Все"
      ? suites
      : suites.filter((s) => (s.audiences ?? []).includes(activeFilter));

  return (
    <>
      <div className="filter-row reveal">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-button${f === activeFilter ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.length ? (
          filtered.map((suite) => (
            <article key={suite.name} className="info-card reveal">
              <div className="meta-row">
                <Pill>{suite.highlight}</Pill>
                <Pill variant="price">{suite.price}</Pill>
              </div>
              <h3>{suite.name}</h3>
              <div className="meta-row">
                <Pill variant="price">{suite.size}</Pill>
                <Pill variant="price">{suite.guests}</Pill>
              </div>
              <p>{suite.description}</p>
              <FeatureList items={suite.features} />
            </article>
          ))
        ) : (
          <EmptyState message="По выбранному фильтру подходящих купе пока нет." />
        )}
      </div>
    </>
  );
}
