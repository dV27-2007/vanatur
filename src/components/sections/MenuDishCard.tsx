import { escapeHtml } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";

interface MenuDishCardProps {
  name: string;
  description?: string;
  price: string;
  portion?: string;
  ingredients?: string[];
  image?: string;
  badge?: string;
  mediaLabel?: string;
}

export function MenuDishCard({
  name,
  description,
  price,
  portion,
  ingredients = [],
  image,
  badge,
  mediaLabel = "VANATUR",
}: MenuDishCardProps) {
  return (
    <article className="menu-dish-card">
      <div className="menu-dish-media">
        {image && (
          <img
            className="menu-dish-image"
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            width="1200"
            height="900"
          />
        )}
        <span className="menu-dish-badge">{escapeHtml(badge || mediaLabel)}</span>
      </div>

      <div className="menu-dish-body">
        <div className="menu-dish-top">
          <h3>{name}</h3>
          <Pill variant="price">{price}</Pill>
        </div>
        {description && <p className="menu-dish-description">{description}</p>}
        {ingredients.length > 0 && (
          <p className="menu-dish-ingredients">
            <span>Ингредиенты:</span>
            {ingredients.join(" \u2022 ")}
          </p>
        )}
        {portion && (
          <div className="menu-dish-meta">
            <span>{portion}</span>
          </div>
        )}
      </div>
    </article>
  );
}
