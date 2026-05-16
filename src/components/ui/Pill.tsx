import { escapeHtml } from "@/lib/utils";

interface PillProps {
  children: string;
  variant?: "default" | "price";
}

export function Pill({ children, variant = "default" }: PillProps) {
  const className = variant === "price" ? "price-pill" : "pill";
  return <span className={className}>{escapeHtml(children)}</span>;
}
