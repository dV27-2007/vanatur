import type { MenuCategory } from "@/types";
import { MenuDishCard } from "./MenuDishCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface MenuCategoryGridProps {
  categories: MenuCategory[];
  emptyMessage?: string;
}

export function MenuCategoryGrid({
  categories,
  emptyMessage = "Полное меню временно недоступно.",
}: MenuCategoryGridProps) {
  if (!categories.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="menu-category-grid">
      {categories.map((category) => (
        <section key={category.name} className="menu-category-card reveal">
          <div className="menu-panel-header menu-category-card__header">
            <span className="pill">{category.name}</span>
            <h3 className="card-title">{category.name}</h3>
            <p className="section-copy">{category.description}</p>
          </div>
          <div className="menu-dish-grid">
            {category.items.map((item) => (
              <MenuDishCard
                key={item.name}
                name={item.name}
                description={item.description}
                price={item.price}
                portion={item.portion}
                ingredients={item.ingredients}
                image={item.image}
                mediaLabel={category.name}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
