"use client";

import { useCallback, useEffect, useState } from "react";
import { CustomEntriesSection } from "@/components/reflection/custom-entries-section";
import { ReflectionKanbanSection } from "@/components/reflection/reflection-kanban-section";
import { ReflectionQuestionsCard } from "@/components/reflection/reflection-questions-card";
import {
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import type { CustomEntry, ReflectionKanban } from "@/types/reflection";

export function SidebarReflectionPanel() {
  const [wentWell, setWentWell] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [customKanbans, setCustomKanbans] = useState<ReflectionKanban[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReflection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const todayReflection = await fetchTodayReflection();
      if (todayReflection) {
        setWentWell(todayReflection.went_well);
        setWentWrong(todayReflection.went_wrong);
        setCustomEntries(todayReflection.custom_entries);
        setCustomKanbans(todayReflection.custom_kanbans ?? []);
      } else {
        setWentWell("");
        setWentWrong("");
        setCustomEntries([]);
        setCustomKanbans([]);
      }
      setDirty(false);
    } catch {
      setError("Failed to load reflection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReflection();
  }, [loadReflection]);

  useEffect(() => {
    if (!dirty || loading || saving) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        setSaving(true);
        try {
          await saveReflection({
            went_well: wentWell,
            went_wrong: wentWrong,
            custom_entries: customEntries.filter((entry) => entry.title.trim()),
            custom_kanbans: customKanbans,
          });
          setDirty(false);
        } catch {
          setError("Failed to save reflection.");
        } finally {
          setSaving(false);
        }
      })();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [wentWell, wentWrong, customEntries, customKanbans, dirty, loading, saving]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading reflection…</div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="flex flex-col gap-8 p-4">
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <ReflectionQuestionsCard
          wentWell={wentWell}
          wentWrong={wentWrong}
          onWentWellChange={(value) => {
            setWentWell(value);
            setDirty(true);
          }}
          onWentWrongChange={(value) => {
            setWentWrong(value);
            setDirty(true);
          }}
          disabled={saving}
          hideTitle
          flat
        />

        <CustomEntriesSection
          entries={customEntries}
          onChange={(entries) => {
            setCustomEntries(entries);
            setDirty(true);
          }}
          disabled={saving}
          flat
        />

        <ReflectionKanbanSection
          kanbans={customKanbans}
          onChange={(kanbans) => {
            setCustomKanbans(kanbans);
            setDirty(true);
          }}
          disabled={saving}
          compact
          flat
        />
      </div>
    </div>
  );
}
