import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SurfaceCardProps {
  children: ReactNode;
  variant?: "default" | "dark" | "emphasis";
  className?: string;
  id?: string;
}

export function SurfaceCard({ children, variant = "default", className, id }: SurfaceCardProps) {
  const variantClass =
    variant === "dark" ? "surface-dark" : variant === "emphasis" ? "surface-emphasis" : "";

  return (
    <div id={id} className={cn("surface-card", variantClass, className)}>
      {children}
    </div>
  );
}
