import type { MenuHighlight } from "@/types";
import { MenuDishCard } from "./MenuDishCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface MenuHighlightsProps {
  highlights: MenuHighlight[];
  emptyMessage?: string;
}

export function MenuHighlights({
  highlights,
  emptyMessage = "Популярные позиции скоро появятся.",
}: MenuHighlightsProps) {
  if (!highlights.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {highlights.map((item) => (
        <div key={item.title} className="reveal">
          <MenuDishCard
            name={item.title}
            description={item.text}
            price={item.price}
            portion={item.portion}
            ingredients={item.ingredients}
            image={item.image}
            badge={item.badge}
            mediaLabel="Рекомендуем"
          />
        </div>
      ))}
    </>
  );
}
