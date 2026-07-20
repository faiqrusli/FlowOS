import { GLOBAL_SHORTCUTS } from "@/lib/global-shortcuts";
import { cn } from "@/lib/utils";

type KeyboardShortcutsSectionProps = {
  /** Compact layout for Settings modal. */
  compact?: boolean;
  className?: string;
};

export function KeyboardShortcutsSection({
  compact = false,
  className,
}: KeyboardShortcutsSectionProps) {
  return (
    <section
      className={cn(
        !compact &&
          "rounded-xl border-0 bg-surface-section px-5 py-5 shadow-none",
        className,
      )}
    >
      <h2
        className={cn(
          "font-medium text-foreground",
          compact ? "text-[13px]" : "text-sm",
        )}
      >
        Keyboard shortcuts
      </h2>
      <p
        className={cn(
          "text-muted-foreground",
          compact ? "mt-1 text-[12px]" : "mt-1 text-xs",
        )}
      >
        Works anywhere in the app (not while typing in a field). Chord shortcuts
        use <span className="text-foreground">Ctrl</span>, not ⌘.
      </p>
      <ul className={cn(compact ? "mt-3 space-y-2" : "mt-4 space-y-2")}>
        {GLOBAL_SHORTCUTS.map((shortcut) => (
          <li
            key={shortcut.keys}
            className={cn(
              "flex items-baseline justify-between gap-3",
              !compact && "rounded-lg bg-surface-raised px-3.5 py-2.5",
            )}
          >
            <span
              className={cn(
                "min-w-0 text-muted-foreground",
                compact ? "text-[12px]" : "text-sm",
              )}
            >
              {shortcut.action}
            </span>
            <kbd
              className={cn(
                "shrink-0 rounded-md bg-surface-base px-1.5 py-0.5 font-mono text-[11px] text-foreground tabular-nums",
                compact && "bg-surface-raised",
              )}
            >
              {shortcut.keys}
            </kbd>
          </li>
        ))}
      </ul>
    </section>
  );
}
