"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import {
  getTodayDateString,
  getWeekDateKeys,
  getWeekStartMonday,
} from "@/lib/date-utils";
import { fetchReflectionDayReview } from "@/lib/reflection-day-review";
import { fetchReflections } from "@/lib/reflection-storage";
import {
  fetchWeeklyReflectionLayout,
  saveWeeklyReflectionLayout,
} from "@/lib/weekly-reflection-layout";
import {
  buildWeeklyReflectionDayBundle,
  formatWeeklyDayHeading,
  type WeeklyReflectionBoardCard,
  type WeeklyReflectionDayBundle,
} from "@/lib/weekly-reflection-data";
import {
  kanbanCardClass,
  kanbanColumnBodyClass,
  kanbanColumnHeaderClass,
} from "@/lib/theme/surface-classes";
import { cn } from "@/lib/utils";
import type {
  WeeklyReflectionCardPlacement,
  WeeklyReflectionLayout,
} from "@/types/reflection";

function columnId(dayDateKey: string, columnKey: string): string {
  return `${dayDateKey}:${columnKey}`;
}

export function WeeklyReflectionPageContent() {
  const today = getTodayDateString();
  const weekStart = getWeekStartMonday(today);
  const weekDays = useMemo(() => {
    const days = getWeekDateKeys(weekStart);
    return [...days].sort((a, b) => b.localeCompare(a));
  }, [weekStart]);

  const [bundles, setBundles] = useState<WeeklyReflectionDayBundle[]>([]);
  const [layout, setLayout] = useState<WeeklyReflectionLayout>({
    weekStart,
    placements: [],
    collapsedColumns: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadWeek = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reflections, savedLayout] = await Promise.all([
        fetchReflections(),
        fetchWeeklyReflectionLayout(weekStart),
      ]);

      const reflectionByDate = new Map(
        reflections.map((reflection) => [
          reflection.reflection_date,
          reflection,
        ]),
      );

      const dayBundles = await Promise.all(
        weekDays.map(async (dateKey) => {
          const reflection = reflectionByDate.get(dateKey) ?? null;
          const review = await fetchReflectionDayReview(dateKey);
          return buildWeeklyReflectionDayBundle(dateKey, reflection, review);
        }),
      );

      setBundles(dayBundles);
      setLayout(
        savedLayout.weekStart === weekStart
          ? savedLayout
          : {
              weekStart,
              placements: [],
              collapsedColumns: [],
            },
      );
    } catch {
      setError("Failed to load weekly reflection.");
    } finally {
      setLoading(false);
    }
  }, [weekDays, weekStart]);

  useEffect(() => {
    void loadWeek();
  }, [loadWeek]);

  const allCards = useMemo(
    () => bundles.flatMap((bundle) => bundle.cards),
    [bundles],
  );

  const cardById = useMemo(
    () => new Map(allCards.map((card) => [card.id, card])),
    [allCards],
  );

  function resolvePlacement(
    card: WeeklyReflectionBoardCard,
  ): WeeklyReflectionCardPlacement {
    const existing = layout.placements.find((item) => item.cardId === card.id);
    if (existing) return existing;
    return {
      cardId: card.id,
      dayDateKey: card.dayDateKey,
      columnKey: card.defaultColumnKey,
      sortOrder: 0,
    };
  }

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, WeeklyReflectionBoardCard[]>();

    for (const bundle of bundles) {
      for (const column of bundle.columns) {
        map.set(columnId(bundle.dateKey, column.key), []);
      }
    }

    for (const card of allCards) {
      const placement = resolvePlacement(card);
      const key = columnId(placement.dayDateKey, placement.columnKey);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(card);
    }

    for (const [key, cards] of map.entries()) {
      cards.sort((a, b) => {
        const orderA =
          layout.placements.find((item) => item.cardId === a.id)?.sortOrder ??
          0;
        const orderB =
          layout.placements.find((item) => item.cardId === b.id)?.sortOrder ??
          0;
        return orderA - orderB;
      });
      map.set(key, cards);
    }

    return map;
  }, [allCards, bundles, layout.placements]);

  function scheduleSaveLayout(next: WeeklyReflectionLayout) {
    setLayout(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveWeeklyReflectionLayout(next);
    }, 600);
  }

  function moveCard(
    cardId: string,
    targetDay: string,
    targetColumnKey: string,
    targetIndex: number,
  ) {
    const card = cardById.get(cardId);
    if (!card) return;

    const others = layout.placements.filter((item) => item.cardId !== cardId);
    const targetColumnCards = [
      ...(cardsByColumn.get(columnId(targetDay, targetColumnKey)) ?? []),
    ].filter((item) => item.id !== cardId);
    targetColumnCards.splice(targetIndex, 0, card);

    const nextPlacements: WeeklyReflectionCardPlacement[] = [
      ...others,
      ...targetColumnCards.map((item, index) => ({
        cardId: item.id,
        dayDateKey: targetDay,
        columnKey: targetColumnKey,
        sortOrder: index,
      })),
    ];

    for (const [key, cards] of cardsByColumn.entries()) {
      if (key === columnId(targetDay, targetColumnKey)) continue;
      const [day, ...columnParts] = key.split(":");
      const columnKey = columnParts.join(":");
      cards
        .filter((item) => item.id !== cardId)
        .forEach((item, index) => {
          const existing = nextPlacements.find((p) => p.cardId === item.id);
          if (!existing) {
            nextPlacements.push({
              cardId: item.id,
              dayDateKey: day,
              columnKey,
              sortOrder: index,
            });
          }
        });
    }

    scheduleSaveLayout({
      ...layout,
      weekStart,
      placements: nextPlacements,
    });
  }

  function toggleColumnCollapsed(dayDateKey: string, columnKey: string) {
    const id = columnId(dayDateKey, columnKey);
    const collapsed = new Set(layout.collapsedColumns);
    if (collapsed.has(id)) collapsed.delete(id);
    else collapsed.add(id);
    scheduleSaveLayout({
      ...layout,
      collapsedColumns: [...collapsed],
    });
  }

  function handleDropOnColumn(
    event: DragEvent<HTMLDivElement>,
    dayDateKey: string,
    columnKey: string,
  ) {
    event.preventDefault();
    if (!dragCardId) return;
    const cards = cardsByColumn.get(columnId(dayDateKey, columnKey)) ?? [];
    moveCard(dragCardId, dayDateKey, columnKey, cards.length);
    setDragCardId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Link
          href="/reflection"
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-surface-base px-3 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="min-w-0 flex-1">
          <PageHeader
            title="Weekly reflection"
            description="Review the week by day. Drag cards between boards to reorganize."
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading weekly board…</p>
      ) : (
        <div className="kanban-board-scroll flex gap-3 overflow-x-auto pb-4">
          {bundles.map((bundle) => (
            <div
              key={bundle.dateKey}
              className="flex w-[min(100%,320px)] min-w-[300px] shrink-0 flex-col gap-2.5"
            >
              <h2 className="sticky top-0 z-10 rounded-lg border-0 bg-surface-section px-3 py-2 text-sm font-semibold">
                {formatWeeklyDayHeading(bundle.dateKey)}
              </h2>

              {bundle.columns.map((column) => {
                const colId = columnId(bundle.dateKey, column.key);
                const isCollapsed = layout.collapsedColumns.includes(colId);
                const cards = cardsByColumn.get(colId) ?? [];

                return (
                  <div
                    key={colId}
                    className={cn("rounded-xl border-0", kanbanColumnBodyClass)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleColumnCollapsed(bundle.dateKey, column.key)
                      }
                      className={cn(
                        "flex w-full items-center gap-1 rounded-t-xl px-2 py-2 text-left",
                        kanbanColumnHeaderClass,
                      )}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="size-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {column.title}
                      </span>
                      <span className="ml-auto text-xs text-foreground-secondary">
                        {cards.length}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div
                        className="space-y-2 p-2"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) =>
                          handleDropOnColumn(event, bundle.dateKey, column.key)
                        }
                      >
                        {cards.length === 0 ? (
                          <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                            No cards
                          </p>
                        ) : (
                          cards.map((card) => {
                            const showCardTitle =
                              card.title.trim().length > 0 &&
                              card.title !== column.title;

                            return (
                              <div
                                key={card.id}
                                draggable
                                onDragStart={() => setDragCardId(card.id)}
                                onDragEnd={() => setDragCardId(null)}
                                className={cn(
                                  "px-3 py-2",
                                  kanbanCardClass,
                                  dragCardId === card.id && "opacity-50",
                                )}
                              >
                                {showCardTitle ? (
                                  <p className="text-xs font-medium text-foreground-secondary">
                                    {card.title}
                                  </p>
                                ) : null}
                                <p
                                  className={cn(
                                    "whitespace-pre-wrap text-sm leading-relaxed",
                                    showCardTitle && "mt-1",
                                  )}
                                >
                                  {card.content}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
