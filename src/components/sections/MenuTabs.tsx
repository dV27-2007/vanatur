import { useState } from "react";
import type { MenuCategory } from "@/types";
import { MenuDishCard } from "./MenuDishCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface MenuTabsProps {
  categories: MenuCategory[];
  emptyMessage?: string;
}

export function MenuTabs({ categories, emptyMessage = "Меню временно недоступно." }: MenuTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!categories.length) {
    return <EmptyState message={emptyMessage} />;
  }

  const active = categories[activeIndex];

  return (
    <>
      <div className="tab-controls reveal">
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            className={`tab-button${i === activeIndex ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveIndex(i)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="surface-card menu-panel">
        <div className="menu-panel-header">
          <span className="pill">{active.name}</span>
          <h3 className="card-title">{active.name}</h3>
          <p className="section-copy">{active.description}</p>
        </div>
        <div className="menu-dish-grid menu-dish-grid--compact">
          {active.items.map((item) => (
            <MenuDishCard
              key={item.name}
              name={item.name}
              description={item.description}
              price={item.price}
              portion={item.portion}
              ingredients={item.ingredients}
              image={item.image}
              mediaLabel={active.name}
            />
          ))}
        </div>
      </div>
    </>
  );
}
