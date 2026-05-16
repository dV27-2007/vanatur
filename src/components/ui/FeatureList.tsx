interface FeatureListProps {
  items: string[];
}

export function FeatureList({ items }: FeatureListProps) {
  if (!items.length) return null;

  return (
    <ul className="feature-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
