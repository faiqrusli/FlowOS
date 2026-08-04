"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomEntriesSection } from "@/components/reflection/custom-entries-section";
import { ReflectionKanbanSection } from "@/components/reflection/reflection-kanban-section";
import { ReflectionQuestionsCard } from "@/components/reflection/reflection-questions-card";
import {
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import { createReflectionAutosaveController } from "@/lib/reflection-autosave";
import { getTodayDateString } from "@/lib/date-utils";
import { readStorageJson, removeStorageItem, writeStorageJson } from "@/lib/safe-storage";
import type {
  CustomEntry,
  ReflectionKanban,
} from "@/types/reflection";

type SidebarReflectionDraft = {
  wentWell: string;
  wentWrong: string;
  customEntries: CustomEntry[];
  customKanbans: ReflectionKanban[];
};

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
  const draftRef = useRef<SidebarReflectionDraft>({
    wentWell: "",
    wentWrong: "",
    customEntries: [] as CustomEntry[],
    customKanbans: [] as ReflectionKanban[],
  });
  const draftKey = `flowos:reflection-draft:${getTodayDateString()}`;
  const persistDraft = useCallback(
    (draft: SidebarReflectionDraft) =>
      saveReflection({
        went_well: draft.wentWell,
        went_wrong: draft.wentWrong,
        custom_entries: draft.customEntries.filter((entry) => entry.title.trim()),
        custom_kanbans: draft.customKanbans,
      }),
    [],
  );
  const autosave = useMemo(
    () =>
      createReflectionAutosaveController<SidebarReflectionDraft>(persistDraft, {
        delayMs: 400,
        onSaved: (hasPendingDraft) => {
          if (!hasPendingDraft) removeStorageItem(draftKey);
        },
        onError: () => setError("Failed to save reflection. It will retry when changed."),
      }),
    [draftKey, persistDraft],
  );

  const scheduleSave = useCallback(
    (draft: SidebarReflectionDraft) => {
      dirtyRef.current = true;
      draftRef.current = draft;
      writeStorageJson(draftKey, draft);
      autosave.schedule(draft);
    },
    [autosave, draftKey],
  );

  const loadReflection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const todayReflection = await fetchTodayReflection();
      if (dirtyRef.current) {
        // User typed while load was in flight — keep local draft.
        return;
      }

      const localDraft = readStorageJson<SidebarReflectionDraft | null>(draftKey, null);
      if (localDraft) {
        setWentWell(localDraft.wentWell);
        setWentWrong(localDraft.wentWrong);
        setCustomEntries(localDraft.customEntries);
        setCustomKanbans(localDraft.customKanbans);
        draftRef.current = localDraft;
        dirtyRef.current = true;
        autosave.schedule(localDraft);
      } else if (todayReflection) {
        const nextDraft = {
          wentWell: todayReflection.went_well,
          wentWrong: todayReflection.went_wrong,
          customEntries: todayReflection.custom_entries,
          customKanbans: todayReflection.custom_kanbans ?? [],
        };
        setWentWell(nextDraft.wentWell);
        setWentWrong(nextDraft.wentWrong);
        setCustomEntries(nextDraft.customEntries);
        setCustomKanbans(nextDraft.customKanbans);
        draftRef.current = nextDraft;
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
      if (!localDraft) dirtyRef.current = false;
    } catch {
      setError("Failed to load reflection.");
    } finally {
      setLoading(false);
    }
  }, [autosave, draftKey]);

  useEffect(() => {
    void loadReflection();
  }, [loadReflection]);

  useEffect(() => {
    draftRef.current = { wentWell, wentWrong, customEntries, customKanbans };
  }, [customEntries, customKanbans, wentWell, wentWrong]);

  useEffect(() => {
    const flush = () => void autosave.flush();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      void autosave.flush();
    };
  }, [autosave]);

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
              scheduleSave({ ...draftRef.current, wentWell: value });
            }}
            onWentWrongChange={(value) => {
              setWentWrong(value);
              scheduleSave({ ...draftRef.current, wentWrong: value });
            }}
            hideTitle
            flat
          />
        </section>

        <CustomEntriesSection
          entries={customEntries}
          onChange={(entries) => {
            setCustomEntries(entries);
            scheduleSave({ ...draftRef.current, customEntries: entries });
          }}
          flat
        />

        <ReflectionKanbanSection
          kanbans={customKanbans}
          onChange={(kanbans) => {
            setCustomKanbans(kanbans);
            scheduleSave({ ...draftRef.current, customKanbans: kanbans });
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
