"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GROWTH_AREA_ICON_CATEGORIES,
  type GrowthAreaIconOption,
} from "@/lib/growth-area-icons";
import { cn } from "@/lib/utils";

type GrowthAreaIconChooserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (emoji: string, label: string) => void;
  /** When true, show a clear action to return to color-only identity. */
  allowClear?: boolean;
  onClear?: () => void;
};

export function GrowthAreaIconChooser({
  open,
  onOpenChange,
  value,
  onSelect,
  allowClear = false,
  onClear,
}: GrowthAreaIconChooserProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setActiveSlide(0);
    setHoveredLabel(null);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [open]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const slideWidth = container.clientWidth;
      if (!slideWidth) return;
      setActiveSlide(Math.round(container.scrollLeft / slideWidth));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [open]);

  function scrollToSlide(index: number) {
    const container = scrollRef.current;
    if (!container) return;
    const next = Math.max(
      0,
      Math.min(index, GROWTH_AREA_ICON_CATEGORIES.length - 1),
    );
    container.scrollTo({
      left: next * container.clientWidth,
      behavior: "smooth",
    });
    setActiveSlide(next);
    setHoveredLabel(null);
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const container = scrollRef.current;
    if (!container) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (e.deltaY === 0) return;
    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }

  const activeCategory = GROWTH_AREA_ICON_CATEGORIES[activeSlide];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm">
        <DialogHeader className="border-b border-border/30 px-4 py-3 pr-12">
          <DialogTitle className="text-base">Choose icon</DialogTitle>
          <p className="min-h-4 truncate text-xs text-muted-foreground">
            {hoveredLabel ?? activeCategory?.label}
          </p>
        </DialogHeader>

        <div
          ref={scrollRef}
          onWheel={handleWheel}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {GROWTH_AREA_ICON_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="w-full shrink-0 snap-start px-3 py-3"
            >
              <div className="grid grid-cols-5 gap-1.5">
                {category.icons.map((option) => (
                  <IconButton
                    key={`${category.id}-${option.label}`}
                    option={option}
                    selected={value === option.emoji}
                    onHover={setHoveredLabel}
                    onSelect={() => {
                      onSelect(option.emoji, option.label);
                      onOpenChange(false);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/30 px-4 py-3">
          {allowClear ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onClear?.();
                onOpenChange(false);
              }}
            >
              Remove icon
            </Button>
          ) : null}

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSlide(activeSlide - 1)}
              disabled={activeSlide === 0}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-surface-hover disabled:opacity-30"
              aria-label="Previous icon group"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {GROWTH_AREA_ICON_CATEGORIES.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === activeSlide
                      ? "w-4 bg-foreground/70"
                      : "w-1.5 bg-muted-foreground/35 hover:bg-surface-hover-foreground/55",
                  )}
                  aria-label={`Show ${category.label} icons`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSlide(activeSlide + 1)}
              disabled={activeSlide === GROWTH_AREA_ICON_CATEGORIES.length - 1}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-surface-hover disabled:opacity-30"
              aria-label="Next icon group"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IconButton({
  option,
  selected,
  onSelect,
  onHover,
}: {
  option: GrowthAreaIconOption;
  selected: boolean;
  onSelect: () => void;
  onHover: (label: string | null) => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(option.label)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(option.label)}
      onBlur={() => onHover(null)}
      aria-label={option.label}
      className={cn(
        "flex size-11 items-center justify-center rounded-xl text-xl leading-none transition-colors",
        selected
          ? "flow-selected text-foreground"
          : "hover:bg-surface-hover/80",
      )}
    >
      {option.emoji}
    </button>
  );
}
