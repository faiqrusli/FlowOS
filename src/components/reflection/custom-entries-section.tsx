"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { CustomEntryDialog } from "@/components/reflection/custom-entry-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomEntry } from "@/types/reflection";

type CustomEntriesSectionProps = {
  entries: CustomEntry[];
  onChange: (entries: CustomEntry[]) => void;
  disabled?: boolean;
  /** Drawer: no outer card — content sits on chrome. */
  flat?: boolean;
};

export function CustomEntriesSection({
  entries,
  onChange,
  disabled,
  flat = false,
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

  const header = (
    <div className="flex flex-row items-center justify-between gap-4">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        Custom entries
      </h3>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={openCreate}
        className="gap-1"
      >
        <Plus className="size-4" />
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
              className="flex items-start justify-between gap-3 rounded-lg border border-border-subtle bg-surface-base px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
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
    <Card className="border-border-subtle shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Custom entries</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={openCreate}
          className="gap-1"
        >
          <Plus className="size-4" />
          Add entry
        </Button>
      </CardHeader>
      <CardContent>{list}</CardContent>
      {dialog}
    </Card>
  );
}
