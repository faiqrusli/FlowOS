"use client";

import { useState } from "react";
import { NotebookPen, Sparkles, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

type RailTab = "details" | "notes" | "reflect";

const TABS: { id: RailTab; label: string; icon: React.ReactNode }[] = [
  { id: "notes", label: "Note", icon: <StickyNote className="size-3.5" /> },
  { id: "details", label: "Details", icon: <NotebookPen className="size-3.5" /> },
  { id: "reflect", label: "Reflect", icon: <Sparkles className="size-3.5" /> },
];

export function FableRightRail() {
  const [tab, setTab] = useState<RailTab>("notes");
  const [note, setNote] = useState(
    "Ship the greenfield Today. Protect the 9:30–11:00 deep-work block.",
  );

  return (
    <aside className="flow-surface-card flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-0.5 border-b border-divider p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[13px] font-medium transition-colors",
              tab === t.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "notes" ? (
          <div className="flex h-full flex-col gap-2">
            <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
              Today&apos;s note
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-0 flex-1 resize-none rounded-lg border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground outline-none focus-visible:border-ring"
              placeholder="What matters most today?"
            />
          </div>
        ) : null}

        {tab === "details" ? (
          <div className="space-y-3 text-[13px]">
            <p className="text-muted-foreground">
              Select any task to see and edit its details here — group,
              priority, estimate, schedule, checklist and tracked focus time.
            </p>
            <div className="flow-empty grid h-24 place-items-center text-center text-[12px] text-muted-foreground">
              No task selected
            </div>
          </div>
        ) : null}

        {tab === "reflect" ? (
          <div className="space-y-3 text-[13px]">
            <p className="font-medium text-foreground">End-of-day reflection</p>
            {[
              "What went well today?",
              "What pulled you out of focus?",
              "One thing for tomorrow",
            ].map((q) => (
              <div key={q} className="space-y-1">
                <label className="text-[12px] text-muted-foreground">{q}</label>
                <textarea
                  className="h-14 w-full resize-none rounded-lg border border-border bg-background p-2 text-[13px] outline-none focus-visible:border-ring"
                  placeholder="…"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
