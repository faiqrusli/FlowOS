"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CustomEntriesSection } from "@/components/reflection/custom-entries-section";
import { ReflectionKanbanSection } from "@/components/reflection/reflection-kanban-section";
import { ReflectionHistory } from "@/components/reflection/reflection-history";
import { ReflectionQuestionsCard } from "@/components/reflection/reflection-questions-card";
import { TodaySummaryCard } from "@/components/reflection/today-summary-card";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useActionToast } from "@/contexts/action-toast-context";
import { getTodayDateString } from "@/lib/date-utils";
import {
  fetchReflections,
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import { fetchReflectionDayReview } from "@/lib/reflection-day-review";
import {
  clearReflectionDraft,
  readReflectionDraft,
  writeReflectionDraft,
} from "@/lib/reflection-recovery";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import type {
  CustomEntry,
  Reflection,
  ReflectionDraft,
  ReflectionKanban,
} from "@/types/reflection";

type ReflectionEditorStatus =
  | "empty"
  | "local-draft"
  | "saving"
  | "saved"
  | "failed";

export function ReflectionPageContent() {
  const { showActionToast } = useActionToast();
  const [dayReview, setDayReview] = useState<ReflectionDayReview | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [wentWell, setWentWell] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [customKanbans, setCustomKanbans] = useState<ReflectionKanban[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorStatus, setEditorStatus] =
    useState<ReflectionEditorStatus>("empty");
  const dailyIdentityRef = useRef("new-daily");
  const draftRevisionRef = useRef(0);
  const draftRef = useRef<ReflectionDraft>({
    went_well: "",
    went_wrong: "",
    custom_entries: [],
    custom_kanbans: [],
  });

  const today = getTodayDateString();

  const getDraft = useCallback(
    (overrides: Partial<ReflectionDraft> = {}): ReflectionDraft => ({
      went_well: overrides.went_well ?? wentWell,
      went_wrong: overrides.went_wrong ?? wentWrong,
      custom_entries: overrides.custom_entries ?? customEntries,
      custom_kanbans: overrides.custom_kanbans ?? customKanbans,
    }),
    [customEntries, customKanbans, wentWell, wentWrong],
  );

  const persistLocalDraft = useCallback(
    (draft: ReflectionDraft) => {
      draftRef.current = draft;
      draftRevisionRef.current += 1;
      writeReflectionDraft({
        identityId: dailyIdentityRef.current,
        dateKey: today,
        recordKind: "daily",
        draft,
        savedAt: new Date().toISOString(),
      });
      setEditorStatus("local-draft");
    },
    [today],
  );

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dayReviewData, todayReflection, allReflections] = await Promise.all([
        fetchReflectionDayReview(today),
        fetchTodayReflection(),
        fetchReflections(),
      ]);

      setDayReview(dayReviewData);
      setReflections(allReflections);

      if (todayReflection) {
        dailyIdentityRef.current = todayReflection.id;
        const localDraft = readReflectionDraft(todayReflection.id, today);
        const restored = localDraft?.draft;
        draftRef.current = restored ?? {
          went_well: todayReflection.went_well,
          went_wrong: todayReflection.went_wrong,
          custom_entries: todayReflection.custom_entries,
          custom_kanbans: todayReflection.custom_kanbans ?? [],
        };
        setWentWell(restored?.went_well ?? todayReflection.went_well);
        setWentWrong(restored?.went_wrong ?? todayReflection.went_wrong);
        setCustomEntries(restored?.custom_entries ?? todayReflection.custom_entries);
        setCustomKanbans(restored?.custom_kanbans ?? todayReflection.custom_kanbans ?? []);
        setEditorStatus(restored ? "local-draft" : "saved");
      } else {
        dailyIdentityRef.current = "new-daily";
        const localDraft = readReflectionDraft("new-daily", today)?.draft;
        draftRef.current = localDraft ?? {
          went_well: "",
          went_wrong: "",
          custom_entries: [],
          custom_kanbans: [],
        };
        setWentWell(localDraft?.went_well ?? "");
        setWentWrong(localDraft?.went_wrong ?? "");
        setCustomKanbans(localDraft?.custom_kanbans ?? []);
        setCustomEntries(localDraft?.custom_entries ?? [
          { id: crypto.randomUUID(), title: "Weight", content: "72.4kg" },
          {
            id: crypto.randomUUID(),
            title: "Daily Insight",
            content: "",
          },
        ]);
        setEditorStatus(localDraft ? "local-draft" : "empty");
      }
    } catch {
      setError("Failed to load reflection data.");
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    // Load the reflection page data after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader updates local reflection state
    loadPage();
  }, [loadPage]);

  async function handleSave() {
    const draft = getDraft({
      custom_entries: customEntries.filter((e) => e.title.trim()),
    });
    persistLocalDraft(draft);
    const saveRevision = draftRevisionRef.current;
    const saveIdentity = dailyIdentityRef.current;
    setSaving(true);
    setEditorStatus("saving");
    setError(null);

    try {
      const saved = await saveReflection(draft);

      const allReflections = await fetchReflections();
      const refreshedReview = await fetchReflectionDayReview(today);

      setReflections(allReflections);
      setDayReview(refreshedReview);
      dailyIdentityRef.current = saved.id;
      const hasNewerDraft = draftRevisionRef.current !== saveRevision;

      if (hasNewerDraft) {
        writeReflectionDraft({
          identityId: saved.id,
          dateKey: today,
          recordKind: "daily",
          draft: draftRef.current,
          savedAt: new Date().toISOString(),
        });
        setEditorStatus("local-draft");
      } else {
        const confirmedDraft: ReflectionDraft = {
          went_well: saved.went_well,
          went_wrong: saved.went_wrong,
          custom_entries: saved.custom_entries,
          custom_kanbans: saved.custom_kanbans ?? [],
        };
        draftRef.current = confirmedDraft;
        setWentWell(saved.went_well);
        setWentWrong(saved.went_wrong);
        setCustomKanbans(confirmedDraft.custom_kanbans);
        setCustomEntries(confirmedDraft.custom_entries);
        clearReflectionDraft(saveIdentity, today);
        clearReflectionDraft("new-daily", today);
        setEditorStatus("saved");
      }

      showActionToast({
        message: hasNewerDraft
          ? "Reflection saved; newer edits remain local"
          : "Reflection saved",
        tone: "success",
        icon: "reflection",
      });
    } catch {
      setError("Failed to save reflection.");
      setEditorStatus("failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Reflection" />

      {error && <ErrorBanner message={error} />}

      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {editorStatus === "empty"
          ? "No Reflection record is confirmed for this date."
          : editorStatus === "local-draft"
            ? "Local draft restored. It is not saved until Reflection confirms persistence."
            : editorStatus === "saving"
              ? "Saving Reflection at its owner."
              : editorStatus === "failed"
                ? "Save failed. Your local draft remains available to retry."
                : "Reflection saved at its owner."}
      </p>

      <TodaySummaryCard review={dayReview} loading={loading} />

      <ReflectionQuestionsCard
        wentWell={wentWell}
        wentWrong={wentWrong}
        onWentWellChange={(value) => {
          setWentWell(value);
          persistLocalDraft(getDraft({ went_well: value }));
        }}
        onWentWrongChange={(value) => {
          setWentWrong(value);
          persistLocalDraft(getDraft({ went_wrong: value }));
        }}
        disabled={loading}
      />

      <CustomEntriesSection
        entries={customEntries}
        onChange={(entries) => {
          setCustomEntries(entries);
          persistLocalDraft(getDraft({ custom_entries: entries }));
        }}
        disabled={loading}
      />

      <ReflectionKanbanSection
        kanbans={customKanbans}
        onChange={(kanbans) => {
          setCustomKanbans(kanbans);
          persistLocalDraft(getDraft({ custom_kanbans: kanbans }));
        }}
        disabled={loading}
      />

      <div className="flex justify-center pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading || saving}
          className="w-full rounded-full px-8 py-2 sm:w-auto sm:min-w-[200px]"
        >
          {saving ? "Saving…" : "Save reflection"}
        </Button>
      </div>

      <ReflectionHistory
        reflections={reflections}
        loading={loading}
        todayDate={today}
        todayReview={dayReview}
      />
    </div>
  );
}
