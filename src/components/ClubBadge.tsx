import { Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClubBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
    >
      <Cloud className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      AWS Student Builder Group at RGUKT-ONGOLE
    </span>
  );
}
