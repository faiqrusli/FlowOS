"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { normalizeCardInput } from "@/lib/kanban-drag-utils";
import {
  kanbanCardClass,
  kanbanColumnBodyClass,
  kanbanColumnHeaderClass,
} from "@/lib/theme/surface-classes";
import { cn } from "@/lib/utils";
import type {
  ReflectionKanban,
  ReflectionKanbanCard,
} from "@/types/reflection";

type ReflectionKanbanSectionProps = {
  kanbans: ReflectionKanban[];
  onChange: (kanbans: ReflectionKanban[]) => void;
  disabled?: boolean;
  compact?: boolean;
  /** Drawer: no outer card — content sits on chrome. */
  flat?: boolean;
  /** Hide the section title (e.g. when wrapped in a collapsible). */
  hideHeader?: boolean;
  /** Section heading — default "Custom kanban". */
  title?: string;
  /** CTA label — default "Add kanban". */
  addLabel?: string;
};

export function ReflectionKanbanSection({
  kanbans,
  onChange,
  disabled,
  compact,
  flat = false,
  hideHeader = false,
  title = "Custom kanban",
  addLabel = "Add kanban",
}: ReflectionKanbanSectionProps) {
  const [titleDraft, setTitleDraft] = useState("");
  const [addingBoard, setAddingBoard] = useState(false);

  function updateKanban(
    kanbanId: string,
    updater: (kanban: ReflectionKanban) => ReflectionKanban,
  ) {
    onChange(
      kanbans.map((kanban) =>
        kanban.id === kanbanId ? updater(kanban) : kanban,
      ),
    );
  }

  function handleAddKanban() {
    const boardTitle = titleDraft.trim();
    if (!boardTitle) return;
    onChange([
      ...kanbans,
      {
        id: crypto.randomUUID(),
        title: boardTitle,
        cards: [],
        collapsed: false,
      },
    ]);
    setTitleDraft("");
    setAddingBoard(false);
  }

  const header = hideHeader ? (
    <div className="flex h-7 items-center justify-end">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => setAddingBoard(true)}
        className="h-7 gap-1"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  ) : (
    <div className="flex h-7 flex-row items-center justify-between gap-4">
      <h3 className="flex h-7 items-center text-sm font-semibold leading-none tracking-tight text-foreground">
        {title} ({kanbans.length})
      </h3>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => setAddingBoard(true)}
        className="h-7 gap-1"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );

  const body = (
    <div className="space-y-3">
      {addingBoard && (
        <div className="flex items-center gap-2 rounded-lg border-0 bg-surface-base p-2">
          <Input
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            placeholder="Kanban title"
            autoFocus
            disabled={disabled}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleAddKanban();
              if (event.key === "Escape") {
                setAddingBoard(false);
                setTitleDraft("");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={disabled || !titleDraft.trim()}
            onClick={handleAddKanban}
          >
            Done
          </Button>
        </div>
      )}

      {kanbans.length === 0 && !addingBoard ? (
        <p className="text-sm text-muted-foreground">
          Add kanban boards for weight, mood, insights, and more.
        </p>
      ) : (
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-1",
            compact ? "flex-col overflow-visible" : "kanban-board-scroll",
          )}
        >
          {kanbans.map((kanban) => (
            <ReflectionKanbanColumn
              key={kanban.id}
              kanban={kanban}
              disabled={disabled}
              compact={compact}
              onChange={(next) => updateKanban(kanban.id, () => next)}
              onDelete={() =>
                onChange(kanbans.filter((item) => item.id !== kanban.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );

  if (flat) {
    return (
      <section className="space-y-3">
        {header}
        {body}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {header}
      {body}
    </section>
  );
}

function ReflectionKanbanColumn({
  kanban,
  onChange,
  onDelete,
  disabled,
  compact,
}: {
  kanban: ReflectionKanban;
  onChange: (kanban: ReflectionKanban) => void;
  onDelete: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [composing, setComposing] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardDraft, setCardDraft] = useState("");
  const [contextCardId, setContextCardId] = useState<string | null>(null);
  const composeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (composing) composeRef.current?.focus();
  }, [composing]);

  function addCard(text: string) {
    const normalized = normalizeCardInput(text);
    if (!normalized.trim()) {
      setComposing(false);
      setComposeText("");
      return;
    }

    const card: ReflectionKanbanCard = {
      id: crypto.randomUUID(),
      content: normalized,
    };

    onChange({
      ...kanban,
      cards: [...kanban.cards, card],
    });
    setComposeText("");
    setComposing(true);
  }

  function saveCard(cardId: string, text: string) {
    const normalized = normalizeCardInput(text);
    onChange({
      ...kanban,
      cards: kanban.cards.map((card) =>
        card.id === cardId ? { ...card, content: normalized } : card,
      ),
    });
    setEditingCardId(null);
    setCardDraft("");
  }

  function deleteCard(cardId: string) {
    onChange({
      ...kanban,
      cards: kanban.cards.filter((card) => card.id !== cardId),
    });
    setContextCardId(null);
  }

  const collapsed = kanban.collapsed ?? false;

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col rounded-xl",
        kanbanColumnBodyClass,
        compact ? "w-full" : "w-[min(100%,280px)] min-w-[240px] max-w-[280px]",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-t-xl px-2 py-2",
          kanbanColumnHeaderClass,
        )}
      >
        <button
          type="button"
          onClick={() => onChange({ ...kanban, collapsed: !collapsed })}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover"
          aria-label={
            collapsed ? `Expand ${kanban.title}` : `Collapse ${kanban.title}`
          }
        >
          {collapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">
          {kanban.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover"
            aria-label={`${kanban.title} options`}
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              className="text-destructive"
              onClick={onDelete}
              disabled={disabled}
            >
              <Trash2 className="size-3.5" />
              Delete kanban
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!collapsed && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
          {kanban.cards.map((card) => {
            const isEditing = editingCardId === card.id;
            return (
              <div
                key={card.id}
                className={cn("group relative px-3 py-2", kanbanCardClass)}
                onDoubleClick={() => {
                  if (disabled) return;
                  setEditingCardId(card.id);
                  setCardDraft(card.content);
                }}
                onContextMenu={(event) => {
                  if (disabled) return;
                  event.preventDefault();
                  setContextCardId(card.id);
                }}
              >
                {isEditing ? (
                  <AutoGrowTextarea
                    value={cardDraft}
                    onChange={setCardDraft}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        saveCard(card.id, cardDraft);
                      }
                      if (event.key === "Escape") {
                        setEditingCardId(null);
                        setCardDraft("");
                      }
                    }}
                    onBlur={() => saveCard(card.id, cardDraft)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {card.content}
                  </p>
                )}

                <DropdownMenu
                  open={contextCardId === card.id}
                  onOpenChange={(open) =>
                    setContextCardId(open ? card.id : null)
                  }
                >
                  <DropdownMenuTrigger className="sr-only">
                    Card menu
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-xl">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingCardId(card.id);
                        setCardDraft(card.content);
                        setContextCardId(null);
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit card
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteCard(card.id)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete card
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}

          {composing ? (
            <AutoGrowTextarea
              ref={composeRef}
              value={composeText}
              onChange={setComposeText}
              placeholder="Write here... use - for bullets"
              className="rounded-lg border border-border/50 bg-background px-3 py-2"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  addCard(composeText);
                }
                if (event.key === "Escape") {
                  setComposing(false);
                  setComposeText("");
                }
              }}
              onBlur={() => {
                if (!composeText.trim()) {
                  setComposing(false);
                  return;
                }
                addCard(composeText);
              }}
            />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setComposing(true);
                setComposeText("");
              }}
              className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            >
              <Plus className="size-3" />
              Add a card
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type AutoGrowTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
};

const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
  function AutoGrowTextarea(
    { value, onChange, className, placeholder, onKeyDown, onBlur },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "0px";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
      resize();
      innerRef.current?.focus();
    }, [resize]);

    useEffect(() => {
      resize();
    }, [value, resize]);

    return (
      <textarea
        ref={innerRef}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          requestAnimationFrame(resize);
        }}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none overflow-hidden text-sm leading-relaxed outline-none",
          className,
        )}
        style={{ minHeight: "2.25rem" }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    );
  },
);
