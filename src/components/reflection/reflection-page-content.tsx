"use client";

import { useCallback, useEffect, useState } from "react";
import { CustomEntriesSection } from "@/components/reflection/custom-entries-section";
import { ReflectionKanbanSection } from "@/components/reflection/reflection-kanban-section";
import { ReflectionHistory } from "@/components/reflection/reflection-history";
import { ReflectionQuestionsCard } from "@/components/reflection/reflection-questions-card";
import { TodaySummaryCard } from "@/components/reflection/today-summary-card";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getTodayDateString } from "@/lib/date-utils";
import {
  fetchReflections,
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import { fetchReflectionDayReview } from "@/lib/reflection-day-review";
import type { ReflectionDayReview } from "@/lib/reflection-day-review";
import type { CustomEntry, Reflection, ReflectionKanban } from "@/types/reflection";

export function ReflectionPageContent() {
  const [dayReview, setDayReview] = useState<ReflectionDayReview | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [wentWell, setWentWell] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [customKanbans, setCustomKanbans] = useState<ReflectionKanban[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const today = getTodayDateString();

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
        setWentWell(todayReflection.went_well);
        setWentWrong(todayReflection.went_wrong);
        setCustomEntries(todayReflection.custom_entries);
        setCustomKanbans(todayReflection.custom_kanbans ?? []);
      } else {
        setWentWell("");
        setWentWrong("");
        setCustomKanbans([]);
        setCustomEntries([
          { id: crypto.randomUUID(), title: "Weight", content: "72.4kg" },
          {
            id: crypto.randomUUID(),
            title: "Daily Insight",
            content: "",
          },
        ]);
      }
    } catch {
      setError("Failed to load reflection data.");
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const saved = await saveReflection({
        went_well: wentWell,
        went_wrong: wentWrong,
        custom_entries: customEntries.filter((e) => e.title.trim()),
        custom_kanbans: customKanbans,
      });

      const allReflections = await fetchReflections();
      const refreshedReview = await fetchReflectionDayReview(today);

      setReflections(allReflections);
      setDayReview(refreshedReview);
      setWentWell(saved.went_well);
      setWentWrong(saved.went_wrong);
      setCustomKanbans(saved.custom_kanbans ?? customKanbans);
      setCustomEntries(
        saved.custom_entries.length > 0
          ? saved.custom_entries
          : customEntries.filter((e) => e.title.trim())
      );

      setSavedMessage("Reflection saved successfully.");
      window.setTimeout(() => setSavedMessage(null), 4000);
    } catch {
      setError("Failed to save reflection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Reflection"
        description="Review your day, capture insights, and build a calm evening ritual."
      />

      {error && <ErrorBanner message={error} />}
      {savedMessage && (
        <p
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          role="status"
        >
          {savedMessage}
        </p>
      )}

      <TodaySummaryCard review={dayReview} loading={loading} />

      <ReflectionQuestionsCard
        wentWell={wentWell}
        wentWrong={wentWrong}
        onWentWellChange={setWentWell}
        onWentWrongChange={setWentWrong}
        disabled={loading || saving}
      />

      <CustomEntriesSection
        entries={customEntries}
        onChange={setCustomEntries}
        disabled={loading || saving}
      />

      <ReflectionKanbanSection
        kanbans={customKanbans}
        onChange={setCustomKanbans}
        disabled={loading || saving}
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
