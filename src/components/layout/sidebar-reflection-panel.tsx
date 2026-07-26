"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CustomEntriesSection } from "@/components/reflection/custom-entries-section";
import { ReflectionKanbanSection } from "@/components/reflection/reflection-kanban-section";
import { ReflectionQuestionsCard } from "@/components/reflection/reflection-questions-card";
import {
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import type { CustomEntry, ReflectionKanban } from "@/types/reflection";

/**
 * Drawer reflection — local text stays interactive while autosave runs silently
 * (same feel as task description; never disable fields for saving).
 */
export function SidebarReflectionPanel() {
  const [wentWell, setWentWell] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [customKanbans, setCustomKanbans] = useState<ReflectionKanban[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const draftRef = useRef({
    wentWell: "",
    wentWrong: "",
    customEntries: [] as CustomEntry[],
    customKanbans: [] as ReflectionKanban[],
  });

  const loadReflection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const todayReflection = await fetchTodayReflection();
      if (dirtyRef.current) {
        // User typed while load was in flight — keep local draft.
        return;
      }
      if (todayReflection) {
        setWentWell(todayReflection.went_well);
        setWentWrong(todayReflection.went_wrong);
        setCustomEntries(todayReflection.custom_entries);
        setCustomKanbans(todayReflection.custom_kanbans ?? []);
        draftRef.current = {
          wentWell: todayReflection.went_well,
          wentWrong: todayReflection.went_wrong,
          customEntries: todayReflection.custom_entries,
          customKanbans: todayReflection.custom_kanbans ?? [],
        };
      } else {
        setWentWell("");
        setWentWrong("");
        setCustomEntries([]);
        setCustomKanbans([]);
        draftRef.current = {
          wentWell: "",
          wentWrong: "",
          customEntries: [],
          customKanbans: [],
        };
      }
      dirtyRef.current = false;
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
    draftRef.current = {
      wentWell,
      wentWrong,
      customEntries,
      customKanbans,
    };
  }, [wentWell, wentWrong, customEntries, customKanbans]);

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void (async () => {
        if (savingRef.current) {
          scheduleSave();
          return;
        }
        savingRef.current = true;
        const draft = draftRef.current;
        try {
          await saveReflection({
            went_well: draft.wentWell,
            went_wrong: draft.wentWrong,
            custom_entries: draft.customEntries.filter((entry) =>
              entry.title.trim(),
            ),
            custom_kanbans: draft.customKanbans,
          });
          // Only clear dirty if draft is unchanged since this save started.
          const latest = draftRef.current;
          if (
            latest.wentWell === draft.wentWell &&
            latest.wentWrong === draft.wentWrong &&
            latest.customEntries === draft.customEntries &&
            latest.customKanbans === draft.customKanbans
          ) {
            dirtyRef.current = false;
          } else {
            scheduleSave();
          }
          setError(null);
        } catch {
          setError("Failed to save reflection.");
        } finally {
          savingRef.current = false;
        }
      })();
    }, 900);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading reflection…</div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="flex flex-col gap-8 px-5 py-4">
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <section className="space-y-3">
          <ReflectionQuestionsCard
            wentWell={wentWell}
            wentWrong={wentWrong}
            onWentWellChange={(value) => {
              setWentWell(value);
              scheduleSave();
            }}
            onWentWrongChange={(value) => {
              setWentWrong(value);
              scheduleSave();
            }}
            hideTitle
            flat
          />
        </section>

        <CustomEntriesSection
          entries={customEntries}
          onChange={(entries) => {
            setCustomEntries(entries);
            scheduleSave();
          }}
          flat
        />

        <ReflectionKanbanSection
          kanbans={customKanbans}
          onChange={(kanbans) => {
            setCustomKanbans(kanbans);
            scheduleSave();
          }}
          compact
          flat
          title="Boards"
          addLabel="Add board"
        />
      </div>
    </div>
  );
}
