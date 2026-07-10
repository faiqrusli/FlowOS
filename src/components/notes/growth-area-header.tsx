import { type } from "@/lib/typography";
import { MINDSET_GROWTH_AREA_NAME } from "@/lib/notes-utils";
import { cn } from "@/lib/utils";
import type { GrowthArea } from "@/types/notes";
import { Button } from "@/components/ui/button";

type ContentTab = "notes" | "kanban";

type GrowthAreaHeaderProps = {
  area: GrowthArea;
  tab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  onOpenTodaysNote?: () => void;
};

export function GrowthAreaHeader({
  area,
  tab,
  onTabChange,
  onOpenTodaysNote,
}: GrowthAreaHeaderProps) {
  return (
    <div className="shrink-0 border-b border-border/30 px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex min-w-0 items-center gap-2"
          title={area.description?.trim() || undefined}
        >
          <span className="text-xl leading-none">{area.emoji}</span>
          <h2 className={cn(type.sectionTitle, "truncate text-base leading-tight")}>
            {area.name}
          </h2>
        </div>

        <div className="inline-flex shrink-0 rounded-lg border border-border/50 bg-background/60 p-0.5">
          {(["notes", "kanban"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTabChange(item)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-[background-color,color,box-shadow]",
                tab === item
                  ? "bg-surface-hover text-foreground shadow-sm ring-1 ring-border/40"
                  : "text-muted-foreground hover:bg-surface-hover/50 hover:text-foreground"
              )}
            >
              {item === "notes" ? "Notes" : "Kanban"}
            </button>
          ))}
        </div>

        {area.name === MINDSET_GROWTH_AREA_NAME && onOpenTodaysNote ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto shrink-0"
            onClick={onOpenTodaysNote}
          >
            Open today&apos;s note
          </Button>
        ) : null}
      </div>
    </div>
  );
}
