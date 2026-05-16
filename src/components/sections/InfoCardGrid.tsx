import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardGridProps {
  children: ReactNode;
  columns?: 3 | 4;
  className?: string;
}

export function InfoCardGrid({ children, columns = 4, className }: InfoCardGridProps) {
  const gridClass = columns === 3 ? "card-grid card-grid-tight" : "card-grid";
  return <div className={cn(gridClass, className)}>{children}</div>;
}
