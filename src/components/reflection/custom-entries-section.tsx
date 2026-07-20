"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { CustomEntryDialog } from "@/components/reflection/custom-entry-dialog";
import { Button } from "@/components/ui/button";
import type { CustomEntry } from "@/types/reflection";

type CustomEntriesSectionProps = {
  entries: CustomEntry[];
  onChange: (entries: CustomEntry[]) => void;
  disabled?: boolean;
  /** Drawer: no outer card — content sits on chrome. */
  flat?: boolean;
  /** Hide the section title (e.g. when wrapped in a collapsible). */
  hideHeader?: boolean;
};

export function CustomEntriesSection({
  entries,
  onChange,
  disabled,
  flat = false,
  hideHeader = false,
}: CustomEntriesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<CustomEntry | undefined>();

  function handleSave(entry: CustomEntry) {
    const exists = entries.some((e) => e.id === entry.id);
    onChange(
      exists
        ? entries.map((e) => (e.id === entry.id ? entry : e))
        : [...entries, entry]
    );
    setEditingEntry(undefined);
  }

  function handleDelete(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  function openCreate() {
    setDialogMode("create");
    setEditingEntry(undefined);
    setDialogOpen(true);
  }

  function openEdit(entry: CustomEntry) {
    setDialogMode("edit");
    setEditingEntry(entry);
    setDialogOpen(true);
  }

  const header = hideHeader ? (
    <div className="flex h-7 items-center justify-end">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={openCreate}
        className="h-7 gap-1"
      >
        <Plus className="size-3.5" />
        Add entry
      </Button>
    </div>
  ) : (
    <div className="flex h-7 flex-row items-center justify-between gap-4">
      <h3 className="flex h-7 items-center text-sm font-semibold leading-none tracking-tight text-foreground">
        Custom entries ({entries.length})
      </h3>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={openCreate}
        className="h-7 gap-1"
      >
        <Plus className="size-3.5" />
        Add entry
      </Button>
    </div>
  );

  const list = (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add entries like Weight, Daily Insight, Mood, or Notes.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-3 rounded-lg border-0 bg-surface-5 px-4 py-3 transition-[background-color] duration-150 hover:bg-surface-6"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.title}
                </p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {entry.content || "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => openEdit(entry)}
                  aria-label={`Edit ${entry.title}`}
                  className="text-muted-foreground"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(entry.id)}
                  aria-label={`Delete ${entry.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const dialog = (
    <CustomEntryDialog
      mode={dialogMode}
      entry={editingEntry}
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setEditingEntry(undefined);
      }}
      onSave={handleSave}
    />
  );

  if (flat) {
    return (
      <section className="space-y-3">
        {header}
        {list}
        {dialog}
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <div className="mb-4">{header}</div>
      {list}
      {dialog}
    </section>
  );
}
