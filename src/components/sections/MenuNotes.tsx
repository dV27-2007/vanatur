import type { MenuNote } from "@/types";
import { FeatureList } from "@/components/ui/FeatureList";
import { EmptyState } from "@/components/ui/EmptyState";

interface MenuNotesProps {
  notes: MenuNote[];
  emptyMessage?: string;
}

export function MenuNotes({
  notes,
  emptyMessage = "Дополнительная информация по меню скоро появится.",
}: MenuNotesProps) {
  if (!notes.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {notes.map((note) => (
        <article key={note.title} className="info-card reveal">
          <span className="pill">{note.badge || "Информация"}</span>
          <h3>{note.title}</h3>
          <p>{note.text}</p>
          <FeatureList items={note.points} />
        </article>
      ))}
    </>
  );
}
