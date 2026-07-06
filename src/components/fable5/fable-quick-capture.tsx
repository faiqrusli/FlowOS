"use client";

import { useState } from "react";
import { Inbox, Plus, Repeat, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FableQuickCapture({
  onCapture,
}: {
  onCapture: (title: string, kind: "task" | "habit") => void;
}) {
  const [value, setValue] = useState("");
  const [kind, setKind] = useState<"task" | "habit">("task");

  function submit() {
    const title = value.trim();
    if (!title) return;
    onCapture(title, kind);
    setValue("");
  }

  return (
    <div className="flow-surface-raised flex items-center gap-2 rounded-xl px-2.5 py-2">
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border/70 bg-muted/50 p-0.5">
        {(["task", "habit"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium capitalize transition-colors",
              kind === k
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {k === "task" ? (
              <Plus className="size-3" />
            ) : (
              <Repeat className="size-3" />
            )}
            {k}
          </button>
        ))}
      </div>

      <Inbox className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.nativeEvent.isComposing &&
            e.keyCode !== 229
          ) {
            submit();
          }
        }}
        placeholder={
          kind === "task"
            ? "Capture a task for today…  (Enter to add)"
            : "Add a habit to track…  (Enter to add)"
        }
        className="min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
        aria-label="Quick capture"
      />
      <Button size="sm" onClick={submit} disabled={!value.trim()}>
        <Send className="size-3.5" />
        Add
      </Button>
    </div>
  );
}
