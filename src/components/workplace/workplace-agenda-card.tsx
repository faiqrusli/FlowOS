"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";

const AGENDA_ITEMS = [
  {
    id: "read-goals",
    title: "Read Goals",
    status: "Due now",
  },
  {
    id: "weekly-review",
    title: "Weekly review prep",
    status: "Due today",
  },
  {
    id: "plan-tomorrow",
    title: "Plan tomorrow",
    status: "This evening",
  },
] as const;

export function WorkplaceAgendaCard() {
  return (
    <WorkplaceModuleCard
      moduleId="agenda"
      title="Agenda"
      titleCount={AGENDA_ITEMS.length}
      className="min-h-[4.25rem]"
    >
      <ul className="space-y-0.5 p-1.5">
        {AGENDA_ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-1.5 py-1"
          >
            <Target className="size-3 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium leading-none text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 text-[9px] text-muted-foreground/75">
                {item.status}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 shrink-0 px-2 text-[11px]"
            >
              Open
            </Button>
          </li>
        ))}
      </ul>
    </WorkplaceModuleCard>
  );
}
