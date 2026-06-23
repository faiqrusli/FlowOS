/**
 * FlowOS typography scale.
 * Use these tokens instead of arbitrary text-* classes.
 *
 * Hierarchy:
 * 1. pageTitle       — Dashboard, Schedule, Tasks, …
 * 2. sectionTitle    — Next Action, Tasks, Habits, …
 * 3. contentPrimary  — task names, next actions, session titles
 * 4. body            — descriptions, summaries
 * 5. meta            — timestamps, labels, tags, overflow counts
 * 6. kpiValue        — emphasized KPI numbers
 */

export const type = {
  pageTitle:
    "font-heading text-2xl font-bold tracking-tight text-foreground",
  pageGreeting: "text-sm font-medium text-muted-foreground",
  pageDescription: "text-sm text-muted-foreground",
  pageDate: "text-sm text-muted-foreground",

  sectionTitle: "text-sm font-semibold tracking-tight text-foreground",
  sectionLabel:
    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",

  contentPrimary: "text-sm font-semibold text-foreground",
  contentPrimaryLg: "text-base font-semibold text-foreground",

  body: "text-sm text-foreground",
  bodyMuted: "text-sm text-muted-foreground",

  meta: "text-xs text-muted-foreground",
  metaMedium: "text-xs font-medium text-muted-foreground",
  metaLabel:
    "text-xs font-medium uppercase tracking-wide text-muted-foreground",
  tag: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",

  kpiLabel: "text-xs font-medium text-muted-foreground",
  kpiValue:
    "text-xl font-bold tabular-nums leading-none tracking-tight text-foreground sm:text-2xl",

  panelAction:
    "inline-flex items-center gap-0.5 text-sm font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline",
  inlineAction:
    "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
} as const;

export type TypographyToken = keyof typeof type;

export function typography(...tokens: TypographyToken[]): string {
  return tokens.map((token) => type[token]).join(" ");
}
