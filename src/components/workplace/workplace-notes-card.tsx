"use client";

import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";

type WorkplaceNotesCardProps = {
  moduleId: "notes-left" | "notes-right";
};

export function WorkplaceNotesCard({ moduleId }: WorkplaceNotesCardProps) {
  return (
    <WorkplaceModuleCard moduleId={moduleId} title="Notes">
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        <p className="text-center text-[11px] text-muted-foreground/55">
          Notes panel
        </p>
      </div>
    </WorkplaceModuleCard>
  );
}
