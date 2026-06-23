import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { GrowthArea } from "@/types/notes";

type ContentTab = "notes" | "kanban";

type GrowthAreaHeaderProps = {
  area: GrowthArea;
  tab: ContentTab;
  noteCount: number;
  boardCount: number;
  lastUpdatedLabel: string | null;
  onTabChange: (tab: ContentTab) => void;
};

export function GrowthAreaHeader({
  area,
  tab,
  noteCount,
  boardCount,
  lastUpdatedLabel,
  onTabChange,
}: GrowthAreaHeaderProps) {
  const stats = [
    `${noteCount} ${noteCount === 1 ? "note" : "notes"}`,
    `${boardCount} ${boardCount === 1 ? "board" : "boards"}`,
    lastUpdatedLabel,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="border-b border-border/30 px-4 pt-4 pb-0">
      <div className="flex min-w-0 items-start gap-2.5 pb-3">
        <span className="text-2xl leading-none">{area.emoji}</span>
        <div className="min-w-0">
          <h2 className={cn(type.sectionTitle, "text-lg")}>{area.name}</h2>
          {area.description && (
            <p className={cn("mt-1 leading-snug", type.bodyMuted, "text-[13px]")}>
              {area.description}
            </p>
          )}
          {stats && (
            <p className={cn("mt-1.5 leading-snug", type.metaMedium)}>
              {stats}
            </p>
          )}
        </div>
      </div>

      <div className="inline-flex rounded-lg border border-border/40 bg-muted/30 p-1">
        {(["notes", "kanban"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onTabChange(item)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-sm font-medium transition-all",
              tab === item
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item === "notes" ? "Notes" : "Kanban"}
          </button>
        ))}
      </div>

      <div className="h-3" aria-hidden />
    </div>
  );
}
